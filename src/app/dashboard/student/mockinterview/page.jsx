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

    const toggleCam = (value) => {
        setIsLoading(true);
        setIsCamOn(value);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const recorder = new MediaRecorder(stream);
                    setMediaRecorder(recorder);
                })
                .catch(error => {
                    console.error('Error accessing microphone:', error);
                });
        } else {
            console.error('MediaRecorder API not supported.');
        }
    }, []);

    const startRecording = () => {
        if (mediaRecorder) {
            const chunks = [];
            mediaRecorder.ondataavailable = event => {
                chunks.push(event.data);
            };
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: "audio/wav" });
                const wavBlob = await getWaveBlob(audioBlob);
                const base64str = await convertBlobToBase64(wavBlob);
                await sendToGPT4Audio(base64str);
            };
            mediaRecorder.start();
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    };

    function convertBlobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(blob);
        });
    }


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
            console.log("API Response:", result);

            console.log("Transcript:", result.transcript);
            console.log("Audio URL:", result.audioUrl);
        } catch (error) {
            console.error("Error sending audio to API:", error);
        }
    }



    const toggleRecording = async (isRecording) => {
        if (isRecording) {
            toggleCam(isRecording);
            startRecording();

        } else {
            toggleCam(isRecording);
            stopRecording();
        }
    }



    return (
        <div
            className="h-[90%] w-full flex flex-col items-center justify-center"
        >
            {
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
                                            <Webcam
                                                audio={false}
                                                mirrored={true}
                                                height={500}
                                            />
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
                                {isCamOn ? "Stop Recording" : "Start Recording"}
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
            }
        </div>
    )
}