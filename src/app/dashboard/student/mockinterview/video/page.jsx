'use client'
// import ReactLoading from "react-loading";
// import Webcam from "../../../../components/Webcam";
// import React from "react";
//
// {
//     !setup && (
//         isProcessing ?
//             <ReactLoading
//                 type="bubbles"
//                 color="black"
//             /> :
//             <>
//                 <div
//                     className="w-full flex flex-col gap-4 items-center justify-center"
//                 >
//                     <div
//                         className="min-w-[640px] min-h-[480px] bg-black flex items-center justify-center"
//                     >
//                         {
//                             isCamOn && (
//                                 isLoading ? (
//                                     <ReactLoading
//                                         type="bubbles"
//                                         color="black"
//                                     />
//                                 ) : (
//                                     <div
//                                         className="w-full h-full relative"
//                                     >
//                                         <Webcam
//                                             audio={false}
//                                             mirrored={true}
//                                             height={500}
//                                         />
//
//                                         showOverlay && (
//                                         <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white text-6xl z-10">
//                                             {countdown}
//                                         </div>
//                                         )
//                                     </div>
//                                 )
//                             )
//                         }
//                     </div>
//                     <button
//                         className={`p-2 px-5 text-2xl text-white ${isCamOn ? "bg-red-600" : "bg-green-600"}`}
//                         onClick={() => {
//                             if (isCamOn) {
//                                 toggleRecording(false);
//                             } else {
//                                 toggleRecording(true);
//                             }
//                         }}
//                     >
//                         {isCamOn ? "Stop" : "Start"}
//                     </button>
//                 </div>
//
//                 {/* Audio Recorder */}
//                 <div>
//                     {
//                         audioBlob && (
//                             <audio controls src={URL.createObjectURL(audioBlob)}/>
//                         )
//                     }
//                 </div>
//             </>
//     )
// }

import {useRouter, useSearchParams} from "next/navigation";
import Webcam from "../../../../../components/Webcam";
import {useEffect, useState} from "react";
import {questionData} from "../../../../../data/data";
import * as PropTypes from "prop-types";
import {Box, LinearProgress, Typography} from "@mui/material";
import ReactLoading from "react-loading";
import Microphone from "../../../../../components/Microphone";

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={props.value/props.total * 100} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {`${Math.round(props.value)}s`}
                </Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number,
    variant: PropTypes.string
};
export default function Page () {

    const [countdown, setCountdown] = useState(5);
    const [showOverlay, setShowOverlay] = useState(true);
    const [isPrep, setIsPrep] = useState(false);
    const [questionLeft, setQuestionLeft] = useState(5);
    const [questionTotal, setQuestionTotal] = useState(5);
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currQuestion, setCurrQuestion] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currIdx, setCurrIdx] = useState(0);
    const [cont, setCont] = useState(false);
    const [questionIdx, setQuestionIdx] = useState([]);

    const searchParams = useSearchParams();
    const feedbackType = searchParams.get("type");
    const router = useRouter();

    // const getRandomQuestions = () => {
    //     const shuffledQuestions = questionData.sort(() => Math.random() - 0.5);
    //
    //     return shuffledQuestions.slice(0, 1);
    // };

    const getRandomQuestions = () => {
        const idx = Array.from({ length: questionData.length }, (_, i) => i)
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);

        setQuestionIdx(idx);
        return idx.map(idx => questionData[idx]);
    };

    useEffect(() => {
        const randQuestions = getRandomQuestions();
        setQuestions(randQuestions);
        setCurrQuestion(randQuestions[currIdx]);
    }, []);


    useEffect(() => {
        if (!isPrep) return;
        if (countdown === 0) {
            setShowOverlay(false);
            setIsRecording(true);
            return
        }

        const timer = setInterval(() => {
            setCountdown((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isPrep, countdown]);

    useEffect(() => {
        if (!isRecording) return;
        if (questionLeft === 0) {
            setTimeout(() => {
                nextQuestion();
            }, 1000)
        }

        const timer = setInterval(() => {
            setQuestionLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isRecording, questionLeft]);



    const handleStart = () => {
        if (!isPrep) {
            setIsPrep(prev => !prev)
        } else if (isRecording) {
            setIsRecording(false);
            setTimeout(() => {
                nextQuestion();
            }, 1000)
        }
    }

    useEffect(() => {
        if (cont) {
            console.log('set to true')
            router.push(`/dashboard/student/mockinterview/results?questions=${encodeURIComponent(questionIdx.join(','))}`);
            setIsLoading(false)
        }
    }, [cont]);

    const nextQuestion = () => {

        if (currIdx === questions.length - 1) {
            setIsPrep(false);
            return;
        }
        setIsLoading(true);
        setQuestionLeft(5);
        setQuestionTotal(5);
        setIsRecording(false);
        setIsPrep(false);
        setShowOverlay(true);
        setCountdown(5);

        setCurrIdx(prev => prev + 1);
        setCurrQuestion(questions[currIdx + 1]);

        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
    }


    return (
        <div
            className="h-[90%] w-full flex flex-col items-center justify-center"
        >
            {
                isLoading ?
                    <ReactLoading type="bubbles" color="black" /> :
                    <div
                        className="w-full flex flex-col gap-4 items-center justify-center"
                    >
                        <div
                            className="w-full grid grid-cols-10 grid-rows-1 gap-4"
                        >
                            {/* Question */}
                            <div className="col-start-3 col-span-2 p-4 bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col items-center justify-between">
                                <div>
                                    {
                                        isPrep ?
                                            <>
                                                <h2 className="text-lg font-semibold text-gray-800 mb-2">Question</h2>
                                                <p className="text-gray-600">{currQuestion}</p>
                                            </> :
                                            <p className="text-lg font-semibold text-gray-800">Click Start</p>
                                    }
                                </div>
                                <div className="flex flex-col gap-4 w-full">
                                    {
                                        isRecording &&
                                            <LinearProgressWithLabel value={questionLeft} variant="determinate" total={questionTotal} />
                                    }
                                    <button
                                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                                        onClick={handleStart}
                                        disabled={(isPrep && !isRecording) || questionLeft === 0}
                                    >
                                        { isPrep ? questionLeft === 0 ? "Done" : "Continue" : "Start" }
                                    </button>
                                </div>
                            </div>

                            {/* Webcam */}
                            <div
                                className="w-[640px] h-[480px] bg-black flex items-center justify-center relative rounded-lg overflow-hidden"
                            >
                                {/*<Webcam/>*/}
                                <Microphone prep={isPrep} type={feedbackType} setCont={setCont} />
                                {
                                    showOverlay &&
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
                    </div>
            }
        </div>
    )
}