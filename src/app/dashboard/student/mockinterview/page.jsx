'use client'
import React, { useState, useEffect } from 'react';
import Webcam from "react-webcam";
import ReactLoading from "react-loading";
import getWaveBlob from "wav-blob-util";

export default function MockInterviewPage() {

    const [isCamOn, setIsCamOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [setup, setSetup] = useState(true);
    const [feedbackType, setFeedbackType] = useState("");
    const [error, setError] = useState(false);

    const [countdown, setCountdown] = useState(3);
    const [showOverlay, setShowOverlay] = useState(true);

    useEffect(() => {
        if (showOverlay && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);

            return () => clearInterval(timer); // Cleanup interval on unmount
        } else if (countdown === 0) {
            setShowOverlay(false); // Hide the overlay when countdown ends
        }
    }, [countdown, showOverlay]);
    
    // request microphone permissions
    useEffect(() => {
        const getMicPerm = async () => {
            console.log('getting mic perm')
            if (navigator.permissions) {
                try {
                    // const mic = await navigator.permissions.query({ name: "microphone" });
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        navigator.mediaDevices.getUserMedia({ audio: true })
                            .then(stream => {
                                stream.getTracks().forEach((track) => {track.stop()});
                            })
                            .catch(error => {
                                console.error("Error accessing microphone", error);
                            })
                    } else {
                        console.error("MediaRecorder API not supported");
                    }
                } catch (error) {
                    console.error("Permissions API not supported");
                }
            }
        }

        getMicPerm();
    }, []);

    //request webcam permissions
    useEffect( () => {
        const getWebcamPerm = async () => {
            console.log('getting webcam perm')
            if (navigator.permissions) {
                try {
                    const cam = await navigator.permissions.query({ name: "camera" });
                    if (cam.state === "granted") {
                        console.log("already granted cam")
                        return;

                    }
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        navigator.mediaDevices.getUserMedia({ video: true })
                            .then(stream => {
                                stream.getTracks().forEach((track) => {track.stop()});
                            })
                            .catch(error => {
                                console.error("Error accessing webcam", error);
                            })
                    } else {
                        console.error("Webcam API not supported");
                    }
                } catch (error) {
                    console.error("Permissions API not supported");
                }
            }
        }

        getWebcamPerm();
    }, []);

    const toggleCam = (value) => {
        setIsLoading(true);
        setIsCamOn(value);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    // set up and record microphone audio
    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);

                const chunks = [];
                recorder.ondataavailable = (event) => {
                    chunks.push(event.data);
                };

                recorder.onstop = async () => {
                    // const audioBlob = new Blob(chunks, { type: "audio/wav" });
                    // if (feedbackType === "audio") {
                    //     const wavBlob = await getWaveBlob(audioBlob);
                    //     const base64str = await convertBlobToBase64(wavBlob);
                    //     await sendToGPT4Audio(base64str);
                    // } else if (feedbackType === "text") {
                    //     const audioFile = new File([audioBlob], "userAudio.wav", { type: "audio/wav" });
                    //     await sendToTranscription(audioFile);
                    // }
                }

                recorder.start();
            } catch (error) {
                console.log("Error when starting recording", error);
            }
        }
    }

    // stop recording microphone audio
    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach((track) => track.stop());
            setMediaRecorder(null);
        }
    };

    // convert wavBlob into base64 for openai api
    function convertBlobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(blob);
        });
    }

    // get response to question as an audio output from openai api (gpt-4o-audio-preview model)
    async function sendToGPT4Audio(base64str) {
        try {
            const response = await fetch("/api/audio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    base64str: base64str,
                    question: "Is this recording silent?",
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
        } catch (error) {
            console.error("Error sending audio to API:", error);
        }
    }

    // turn user audio into text using openai api (whisper model)
    async function sendToTranscription(audioFile) {
        try {
            const response = await fetch("/api/transcription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/octet-stream",
                },
                body: audioFile,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('tranascription', result);
            if (result.transcription) {
                const assessment = await makeAssessment(result.transcription);
            }

        } catch (error) {
            console.error("Error sending transcription", error);
        }
    }

    async function makeAssessment(transcription) {
        try {
            const response = await fetch("/api/text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: "What is your name",
                    userResponse: transcription
                })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('assessment from api call', result);
        } catch (error) {
            console.error("Error getting assessment", error);
        }
    }

    const toggleRecording = async (isRecording) => {
        if (isRecording) {
            toggleCam(isRecording);
            await startRecording();
        } else {
            toggleCam(isRecording);
            stopRecording();
        }
    }

    const toggleFeedbackType = (type) => {
        setFeedbackType(type);
    }

    const handleFeedbackSelection = (e) => {
        e.preventDefault();

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSetup(false);
            setError(false);
        }, 500);
    }

    const checkError = () => {
        if (!feedbackType) {
            setError(true);
        }
    }



    return (
        <div
            className="h-[90%] w-full flex flex-col items-center justify-center"
        >
            {
                setup && (
                    isLoading ? (
                        <ReactLoading type="bubbles" color="black" />
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-8 p-6 bg-gray-100 rounded-lg shadow-md">
                            <p className="text-xl font-semibold text-gray-800">
                                Select your interview style:
                            </p>
                            <form
                                className="flex flex-col w-full max-w-md gap-6"
                                onSubmit={(e) => handleFeedbackSelection(e)}
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="interview-type"
                                            value="text"
                                            checked={feedbackType === "text"}
                                            required
                                            onChange={() => toggleFeedbackType("text")}
                                            className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                                        />
                                        <span className="text-gray-700">Text Feedback</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="interview-type"
                                            value="audio"
                                            required
                                            checked={feedbackType === "audio"}
                                            onChange={() => toggleFeedbackType("audio")}
                                            className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                                        />
                                        <span className="text-gray-700">
                                Audio Feedback (WIP)
                            </span>
                                    </div>
                                    <input
                                        type="submit"
                                        onClick={checkError}
                                        value="Continue"
                                        className="w-full py-3 font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                                    />
                                </div>
                                {error && (
                                    <p className="mt-4 text-sm font-semibold text-center text-red-500 animate-bounce">
                                        Select one option!
                                    </p>
                                )}
                            </form>
                        </div>
                    )
                )
            }
            {
                !setup && (
                    isProcessing ?
                    <ReactLoading
                        type="bubbles"
                        color="black"
                    /> :
                    <>
                        <div
                            className="w-full flex flex-col gap-4 items-center justify-center"
                        >
                            <div
                                className="min-w-[640px] min-h-[480px] bg-black flex items-center justify-center"
                            >
                                {
                                    isCamOn && (
                                        isLoading ? (
                                            <ReactLoading
                                                type="bubbles"
                                                color="black"
                                            />
                                        ) : (
                                            <div
                                                className="w-full h-full relative"
                                            >
                                                <Webcam
                                                    audio={false}
                                                    mirrored={true}
                                                    height={500}
                                                />

                                                showOverlay && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white text-6xl z-10">
                                                        {countdown}
                                                    </div>
                                                )
                                            </div>
                                        )
                                    )
                                }
                            </div>
                            <button
                                className={`p-2 px-5 text-2xl text-white ${isCamOn ? "bg-red-600" : "bg-green-600"}`}
                                onClick={() => {
                                    if (isCamOn) {
                                        toggleRecording(false);
                                    } else {
                                        toggleRecording(true);
                                    }
                                }}
                            >
                                {isCamOn ? "Stop" : "Start"}
                            </button>
                        </div>

                        {/* Audio Recorder */}
                        <div>
                            {
                                audioBlob && (
                                    <audio controls src={URL.createObjectURL(audioBlob)}/>
                                )
                            }
                        </div>
                    </>
                )
            }
        </div>
    )
}