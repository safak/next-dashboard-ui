'use client';

import ReactLoading from "react-loading";
import {useEffect, useRef, useState} from "react";
import {questionData} from "../../../../data/data";
import LinearProgressWithLabel from "../../../../components/LinearProgressWithLabel";
import Webcam from "react-webcam";
import {useRouter} from "next/navigation";

export default function MockInterviewPage() {

    const [isLoading, setIsLoading] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);
    const [isPrep, setIsPrep] = useState(true);
    const [qIdxs, setQIdxs] = useState([]);
    const [currIdx, setCurrIdx] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [timeLeft, setTimeLeft] = useState(0);
    const mediaRecorderRef = useRef(null);
    const [error, setError] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (sessionStorage.getItem("audio_files") !== null) {
            sessionStorage.removeItem("audio_files");
        }
    }, []);

    useEffect(() => {
        const indexes = Array.from({ length: questionData.length }, (_, i) => i)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        setQIdxs(indexes);
    }, []);

    useEffect(() => {
        if (!showQuestion) return;
        if (countdown === 0) {
            setIsRecording(true);
            setIsPrep(false);
            setTimeLeft(questionData[currIdx][1]);
            startAudioRecording();
        } else {
            const timer = setInterval(() => {
                setCountdown((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [countdown, showQuestion]);

    useEffect(() => {
        if (timeLeft === 0) {
            stopAudioRecording();
        } else {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    // prompt mic permissions
    useEffect(() => {
        const promptAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(track => track.stop());
            } catch (error) {
                console.error('Unexpected error occurred when getting mic permissions');
            }
        };

        promptAudio();
    }, []);

    // prompt cam permissions
    useEffect(() => {
        const promptCam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach(track => track.stop());
            } catch (error) {
                console.error('Unexpected error occurred when getting cam permissions');
            }
        };

        promptCam();
    }, []);

    // set error if mic or cam permissions denied
    useEffect(() => {
        async function checkPermissions() {
            try {
                const micPermission = await navigator.permissions.query({ name: 'microphone' });
                const camPermission = await navigator.permissions.query({ name: 'camera' });

                if (micPermission.state !== 'granted' || camPermission.state !== 'granted') {
                    setError(true);
                } else {
                    setError(false);
                }

                micPermission.onchange = () => {
                    if (micPermission.state !== 'granted' || camPermission.state !== 'granted') {
                        setError(true);
                    } else {
                        setError(false);
                    }
                };

                camPermission.onchange = () => {
                    if (micPermission.state !== 'granted' || camPermission.state !== 'granted') {
                        setError(true);
                    } else {
                        setError(false);
                    }
                };
            } catch (err) {
                console.error('Error checking media permissions:', err);
                setError(true);
            }
        }

        checkPermissions();
    }, []);

    const startAudioRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        let chunks = [];

        stream.getTracks().forEach(track => {
            track.addEventListener("ended", () => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                    mediaRecorderRef.current.stop();
                    mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
                    mediaRecorderRef.current = null;
                }
            })
        });

        recorder.ondataavailable = (event) => {
            chunks.push(event.data);
        };


        recorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: "audio/wav" });

            const newURL = URL.createObjectURL(audioBlob);

            let audioFiles = sessionStorage.getItem("audio_files");
            audioFiles = audioFiles ? JSON.parse(audioFiles) : [];
            audioFiles.push(newURL);
            sessionStorage.setItem("audio_files", JSON.stringify(audioFiles));
        };

        recorder.start();
    }

    const stopAudioRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
            mediaRecorderRef.current = null;
            handleNextQuestion();
        }
    };

    const handleStart = () => {
        if (isPrep) {
            setShowQuestion(true);
        } else if (isRecording) {
            stopAudioRecording();
        }
    }

    const handleNextQuestion = () => {
        if (qIdxs.length <= 0) return
        setIsLoading(true);

        if (currIdx === qIdxs.length - 1) {
            setTimeout(() => {
                router.push(`/dashboard/student/mockinterview/results?questions=${encodeURIComponent(qIdxs.join(','))}`);
            })
        } else {
            const new_idx = currIdx + 1;
            setIsPrep(true);
            setIsRecording(false);
            setTimeLeft(questionData[qIdxs[new_idx]][1])
            setCurrIdx(prev => prev + 1);
            setCountdown(5);
            setShowQuestion(false);

            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }

    return (
        <div className="h-[90%] w-full flex flex-col items-center justify-center">
            {
                isLoading ?
                    <ReactLoading type="bubbles" color="black"/> :
                    <div className="w-full grid grid-cols-10 grid-rows-1 gap-4">

                        {/*  Question  */}
                        <div className="col-start-3 col-span-2 p-4 bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col items-center justify-between">
                            <>
                                {
                                    showQuestion ?
                                        <>
                                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Question</h2>
                                            <p className="text-gray-600">{questionData[qIdxs[currIdx]][0]}</p>
                                        </> :
                                        <p className="text-lg font-semibold text-gray-800">Click Start</p>
                                }
                            </>

                            <div className="flex flex-col gap-4 w-full">
                                {
                                    showQuestion && isRecording &&
                                    <LinearProgressWithLabel value={timeLeft} variant="determinate"
                                                             total={questionData[qIdxs[currIdx]][1]}/>
                                }
                                <button
                                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                                    onClick={handleStart}
                                    // disabled={(showQuestion && !isRecording) || questionLeft === 0}
                                    disabled={(showQuestion && !isRecording) || error}
                                >
                                    {/*{ showQuestion ? questionLeft === 0 ? "Done" : "Continue" : "Start"}*/}
                                    { showQuestion ? "Continue" : "Start" }
                                </button>
                                { error && <p className="text-sm text-red-500 text-center">Enable microphone and camera permissions</p> }
                            </div>
                        </div>

                        {/*  Webcam  */}
                        <div
                            className="w-[640px] h-[480px] bg-black flex items-center justify-center relative rounded-lg overflow-hidden"
                        >
                            <div
                                className="w-full h-full relative flex items-center justify-center"
                            >
                                <Webcam
                                    audio={false}
                                    mirrored={true}
                                    height={500}
                                    disablePictureInPicture={true}
                                />
                            </div>
                            {
                                isPrep &&
                                <>
                                    <div className="absolute w-full h-full bg-black bg-opacity-50"></div>
                                    <div
                                        className="absolute w-full h-full inset-0 bg-person-outline bg-cover bg-center bg-no-repeat flex items-center justify-center text-white text-6xl z-10"
                                    >
                                        {countdown}
                                    </div>
                                </>
                            }
                        </div>
                    </div>
            }
        </div>
    )
}