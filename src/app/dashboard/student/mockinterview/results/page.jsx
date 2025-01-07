'use client'
import { useEffect, useState } from "react";
import {useRouter, useSearchParams} from "next/navigation";
import { questionData } from "../../../../../data/data";
import ReactLoading from "react-loading";

export default function Results () {
    const [audioFiles, setAudioFiles] = useState(null);
    const [idxs, setIdxs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState([]);

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const questions = searchParams.get("questions");
        setIdxs(questions.split(',').map(Number));
    }, [])

    useEffect(() => {
        const audioData = JSON.parse(sessionStorage.getItem("audio_files"));
        setAudioFiles(audioData);
    }, []);


    useEffect(() => {
        const getFeedback = async () => {
            try {
                const feedbackResults = [];
                for (const [index, url] of audioFiles.entries()) {
                    const res = await fetch(url);
                    const blob = await res.blob();
                    const audioFile = new File([blob], `userAudio${index}`, { type: "audio/wav" });
                    const feedback = await sendToTranscription(audioFile, questionData[index]);
                    feedbackResults.push(feedback);
                }

                setFeedback(feedbackResults);
                setIsLoading(false);
            } catch (error) {
                console.error("Error in getFeedback:", error);
            }
        };

        if (audioFiles && audioFiles.length > 0) {
            getFeedback();
        }
    }, [audioFiles]);


    // turn user audio into text using openai api (whisper model)
    async function sendToTranscription(audioFile, q) {
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
            if (result.transcription) {
                const assessment = await makeAssessment(result.transcription, q);
                return assessment;
            } else {
                return null;
            }

        } catch (error) {
            console.error("Error sending transcription", error);
        }
    }

    async function makeAssessment(transcription, q) {
        try {
            const response = await fetch("/api/text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: q,
                    userResponse: transcription,
                })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            return result
        } catch (error) {
            console.error("Error getting assessment", error);
        }
    }

    const handleRestart = () => {
        router.push('/dashboard/student/mockinterview');
    }

    if (!audioFiles) return <div>Loading...</div>;


    return (
        <div
            className={`h-[90%] w-full flex overflow-hidden ${isLoading ? "items-center justify-center" : "items-baseline"} space-y-6 p-4 bg-gray-50`}
        >
            {
                isLoading ?
                    <ReactLoading type="bubbles" color="black" /> :
                    <div className="flex flex-col gap-5 items-center">
                        <div className="flex gap-5">
                            {
                                idxs.map((idx, index) => (
                                <div key={index} className="w-full max-w-2xl h-[40%] overflow-y-scroll p-4 bg-white shadow-md rounded-lg border border-gray-200">
                                    <p className="text-lg font-semibold text-gray-700 mb-2">{questionData[idx][0]}</p>
                                    <audio controls className="w-full mb-4">
                                        <source src={audioFiles[index]} type="audio/wav"></source>
                                    </audio>
                                    <p className="text-sm text-gray-600 ">
                                        {feedback[index].messages.content}
                                    </p>
                                </div>
                                ))
                            }
                        </div>
                        <button onClick={handleRestart}
                                className="mt-6 w-fit px-6 py-3 bg-blue-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
                        >
                            Restart
                        </button>
                    </div>
            }
        </div>
    );
}