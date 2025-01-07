// import { useEffect, useState } from "react";
// import getWaveBlob from "wav-blob-util";
//
// export default function Microphone(props) {
//
//     const [micError, setMicError] = useState(false);
//     const [mediaRecorder, setMediaRecorder] = useState(null);
//
//     useEffect(() => {
//         const promptAudio = async () => {
//             await navigator.mediaDevices
//                 .getUserMedia({ audio: true })
//                 .then(stream => {
//                     // localStorage.setItem("mic", "granted");
//                     stream.getTracks().forEach(track => track.stop());
//                 })
//                 .catch(error => {
//                     localStorage.setItem("mic", "denied");
//                     throw new Error('Unexpected error occurred when getting mic permissions');
//
//                 })
//         }
//
//         // const permissions = localStorage.getItem("mic");
//         // if (permissions === null) {
//         promptAudio();
//         // } else if (permissions === "denied") {
//         //     setMicError(true);
//         // }
//     }, []);
//
//
//
//     const startAudioRecording = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
//         const recorder = new MediaRecorder(stream);
//         setMediaRecorder(recorder);
//
//         let chunks = [];
//         recorder.ondataavailable = (event) => {
//             chunks.push(event.data);
//         };
//
//         recorder.onstop = () => {
//             console.log('stopping and entered onstop');
//             const audioBlob = new Blob(chunks, { type: "audio/wav" });
//
//             if (sessionStorage.getItem("audio_files") === null) {
//                 sessionStorage.setItem(
//                     "audio_files",
//                     JSON.stringify({
//                         audio: [URL.createObjectURL(audioBlob)]
//                     })
//                 );
//             } else {
//                 const prev = sessionStorage.getItem("audio_files");
//                 console.log('prev', prev.audio);
//                 // sessionStorage.setItem(
//                 //     "audio_files",
//                 //     JSON.stringify(
//                 //         [...prev, URL.createObjectURL(audioBlob)]
//                 //     )
//                 // );
//             }
//
//             console.log('stopped audio')
//             props.setCont(true);
//             // if (props.type === "audio") {
//             //     const wavBlob = await getWaveBlob(audioBlob);
//             //     const base64str = await convertBlobToBase64(wavBlob);
//             //     await sendToGPT4Audio(base64str);
//             // } else if (props.type === "text") {
//             //     const audioFile = new File([audioBlob], "userAudio.wav", { type: "audio/wav" });
//             //     await sendToTranscription(audioFile);
//             // }
//         }
//
//         recorder.start();
//     }
//
//     const stopAudioRecording = () => {
//         if (mediaRecorder) {
//             console.log('stopped reffffc')
//             mediaRecorder.stop();
//             // This line should use the 'mediaRecorder' instance:
//             mediaRecorder.stream.getTracks().forEach((track) => track.stop());
//             setMediaRecorder(null);
//         }
//     };
//
//
//     useEffect(() => {
//         if (props.prep) {
//             console.log('starting rec')
//             startAudioRecording();
//         } else {
//             console.log('stopping rec')
//             stopAudioRecording();
//         }
//     }, [props.prep]);
//
//
//     // convert wavBlob into base64 for openai api
//     function convertBlobToBase64(blob) {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result.split(',')[1]);
//             reader.onerror = (error) => reject(error);
//             reader.readAsDataURL(blob);
//         });
//     }
//
//     // get response to question as an audio output from openai api (gpt-4o-audio-preview model)
//     async function sendToGPT4Audio(base64str) {
//         try {
//             const response = await fetch("/api/audio", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     base64str: base64str,
//                     question: "Is this recording silent?",
//                 }),
//             });
//
//             if (!response.ok) {
//                 throw new Error(`Error: ${response.statusText}`);
//             }
//
//             const result = await response.json();
//         } catch (error) {
//             console.error("Error sending audio to API:", error);
//         }
//     }
//
//     // turn user audio into text using openai api (whisper model)
//     async function sendToTranscription(audioFile) {
//         try {
//             const response = await fetch("/api/transcription", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/octet-stream",
//                 },
//                 body: audioFile,
//             });
//
//             if (!response.ok) {
//                 throw new Error(`Error: ${response.statusText}`);
//             }
//
//             const result = await response.json();
//             console.log('tranascription', result);
//             if (result.transcription) {
//                 const assessment = await makeAssessment(result.transcription);
//                 if (assessment) {
//                     const transcriptionFile = new Blob([result.transcription], { type: "text/plain" });
//                     const assessmentFile = new Blob([assessment], { type: "audio/wav" });
//                     sessionStorage.setItem(
//                         "text_feedback",
//                         JSON.stringify({
//                             transcription: URL.createObjectURL(transcriptionFile),
//                             assessment: URL.createObjectURL(assessmentFile)
//                         })
//                     );
//                 }
//
//             }
//
//         } catch (error) {
//             console.error("Error sending transcription", error);
//         }
//     }
//
//     async function makeAssessment(transcription) {
//         try {
//             const response = await fetch("/api/text", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     question: "What is your name",
//                     userResponse: transcription
//                 })
//             });
//
//             if (!response.ok) {
//                 throw new Error(`Error: ${response.statusText}`);
//             }
//
//             const result = await response.json();
//
//             console.log('assessment from api call', result);
//             return result;
//         } catch (error) {
//             console.error("Error getting assessment", error);
//         }
//     }
//
//     if (props.setup) return null;
//
//     return (
//         <div className="absolute">
//             Microphone
//         </div>
//     )
// }


// import { useEffect, useState, useRef } from "react";
// import getWaveBlob from "wav-blob-util";
//
// export default function Microphone(props) {
//
//     const [micError, setMicError] = useState(false);
//     // ─────────────────────────────────────────────────────────────────────────────
//     // 1) Use a ref instead of React state for mediaRecorder:
//     // ─────────────────────────────────────────────────────────────────────────────
//     const mediaRecorderRef = useRef(null);
//
//     useEffect(() => {
//         const promptAudio = async () => {
//             await navigator.mediaDevices
//                 .getUserMedia({ audio: true })
//                 .then(stream => {
//                     // localStorage.setItem("mic", "granted");
//                     stream.getTracks().forEach(track => track.stop());
//                 })
//                 .catch(error => {
//                     localStorage.setItem("mic", "denied");
//                     throw new Error('Unexpected error occurred when getting mic permissions');
//                 });
//         };
//         promptAudio();
//     }, []);
//
//     const startAudioRecording = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
//
//         // Prepare to store chunks locally (no need for state or ref if this is enough):
//         let chunks = [];
//
//         // ─────────────────────────────────────────────────────────────────────────
//         // 2) Create MediaRecorder and store it in our ref:
//         // ─────────────────────────────────────────────────────────────────────────
//         const recorder = new MediaRecorder(stream);
//         mediaRecorderRef.current = recorder;
//
//         recorder.ondataavailable = (event) => {
//             chunks.push(event.data);
//         };
//
//         // recorder.onstop = async () => {
//         //     console.log('stopping and entered onstop');
//         //     const audioBlob = new Blob(chunks, { type: "audio/wav" });
//         //
//         //     if (sessionStorage.getItem("audio_files") === null) {
//         //         sessionStorage.setItem(
//         //             "audio_files",
//         //             JSON.stringify({
//         //                 audio: [URL.createObjectURL(audioBlob)]
//         //             })
//         //         );
//         //     } else {
//         //         const prev = sessionStorage.getItem("audio_files");
//         //         console.log('prev', prev);
//         //         // sessionStorage.setItem(
//         //         //     "audio_files",
//         //         //     JSON.stringify(
//         //         //         [...prev, URL.createObjectURL(audioBlob)]
//         //         //     )
//         //         // );
//         //     }
//         //
//         //     console.log('stopped audio');
//         //     props.setCont(true);
//         //
//         //     // if (props.type === "audio") {
//         //     //     const wavBlob = await getWaveBlob(audioBlob);
//         //     //     const base64str = await convertBlobToBase64(wavBlob);
//         //     //     await sendToGPT4Audio(base64str);
//         //     // } else if (props.type === "text") {
//         //     //     const audioFile = new File([audioBlob], "userAudio.wav", { type: "audio/wav" });
//         //     //     await sendToTranscription(audioFile);
//         //     // }
//         // };
//
//         recorder.onstop = () => {
//             console.log('onstop fired');
//             const audioBlob = new Blob(chunks, { type: "audio/wav" });
//
//             // 1) Retrieve or init
//             let audioFiles = sessionStorage.getItem("audio_files");
//             audioFiles = audioFiles ? JSON.parse(audioFiles) : [];
//
//             // 2) Push new
//             audioFiles.push(URL.createObjectURL(audioBlob));
//
//             // 3) Set
//             sessionStorage.setItem("audio_files", JSON.stringify(audioFiles));
//
//             props.setCont(true);
//         };
//
//         recorder.start();
//     };
//
//     const stopAudioRecording = () => {
//         // ─────────────────────────────────────────────────────────────────────────
//         // 3) Check the ref before stopping and cleaning up tracks:
//         // ─────────────────────────────────────────────────────────────────────────
//         if (mediaRecorderRef.current) {
//             console.log('stopped reffffc');
//             mediaRecorderRef.current.stop();
//             mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
//             mediaRecorderRef.current = null;
//         }
//     };
//
//     useEffect(() => {
//         if (props.prep) {
//             console.log('starting rec');
//             startAudioRecording();
//         } else {
//             console.log('stopping rec');
//             stopAudioRecording();
//         }
//     }, [props.prep]);
//
//     // convert wavBlob into base64 for openai api
//     function convertBlobToBase64(blob) {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result.split(',')[1]);
//             reader.onerror = (error) => reject(error);
//             reader.readAsDataURL(blob);
//         });
//     }
//
//     // get response to question as an audio output from openai api (gpt-4o-audio-preview model)
//     async function sendToGPT4Audio(base64str) {
//         try {
//             const response = await fetch("/api/audio", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     base64str: base64str,
//                     question: "Is this recording silent?",
//                 }),
//             });
//             if (!response.ok) {
//                 throw new Error(`Error: ${response.statusText}`);
//             }
//             const result = await response.json();
//         } catch (error) {
//             console.error("Error sending audio to API:", error);
//         }
//     }
//
//     // turn user audio into text using openai api (whisper model)
//     async function sendToTranscription(audioFile) {
//         try {
//             const response = await fetch("/api/transcription", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/octet-stream",
//                 },
//                 body: audioFile,
//             });
//             if (!response.ok) {
//                 throw new Error(`Error: ${response.statusText}`);
//             }
//             const result = await response.json();
//             console.log('tranascription', result);
//             if (result.transcription) {
//                 const assessment = await makeAssessment(result.transcription);
//                 if (assessment) {
//                     const transcriptionFile = new Blob([result.transcription], { type: "text/plain" });
//                     const assessmentFile = new Blob([assessment], { type: "audio/wav" });
//                     sessionStorage.setItem(
//                         "text_feedback",
//                         JSON.stringify({
//                             transcription: URL.createObjectURL(transcriptionFile),
//                             assessment: URL.createObjectURL(assessmentFile)
//                         })
//                     );
//                 }
//             }
//         } catch (error) {
//             console.error("Error sending transcription", error);
//         }
//     }
//
//     async function makeAssessment(transcription) {
//         try {
//             const response = await fetch("/api/text", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     question: "What is your name",
//                     userResponse: transcription
//                 })
//             });
//
//             if (!response.ok) {
//                 throw new Error(`Error: ${response.statusText}`);
//             }
//
//             const result = await response.json();
//             console.log('assessment from api call', result);
//             return result;
//         } catch (error) {
//             console.error("Error getting assessment", error);
//         }
//     }
//
//     if (props.setup) return null;
//
//     return (
//         <div className="absolute">
//             Microphone
//         </div>
//     );
// }








import { useEffect, useState, useRef } from "react";
import getWaveBlob from "wav-blob-util";

export default function Microphone(props) {
    const [micError, setMicError] = useState(false);
    const mediaRecorderRef = useRef(null);

    useEffect(() => {
        const promptAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(track => track.stop());
            } catch (error) {
                localStorage.setItem("mic", "denied");
                throw new Error('Unexpected error occurred when getting mic permissions');
            }
        };
        promptAudio();
    }, []);

    const startAudioRecording = async () => {
        // 1) Get user media
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

        // 2) Create MediaRecorder
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        let chunks = [];

        // 3) Listen for ended event on each track
        //    If a track ends (user forcibly stops from UI, etc.),
        //    we manually stop the recorder so onstop will fire.
        stream.getTracks().forEach(track => {
            track.addEventListener("ended", () => {
                console.log("A track ended unexpectedly. Forcing recorder stop.");
                if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                    mediaRecorderRef.current.stop();
                    mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
                    mediaRecorderRef.current = null;
                }
            });
        });

        recorder.ondataavailable = (event) => {
            chunks.push(event.data);
        };

        recorder.onstop = async () => {
            console.log('stopping and entered onstop');
            const audioBlob = new Blob(chunks, { type: "audio/wav" });

            // 4) Append the new recording to sessionStorage
            const newURL = URL.createObjectURL(audioBlob);
            let audioFiles = sessionStorage.getItem("audio_files");
            audioFiles = audioFiles ? JSON.parse(audioFiles) : [];
            audioFiles.push(newURL);
            sessionStorage.setItem("audio_files", JSON.stringify(audioFiles));

            console.log('stopped audio');
            props.setCont(true);

            // If you need to do anything else with the blob, do it here...
            // e.g. transcription or sending to GPT
        };

        // 5) Start recording
        recorder.start();
    };

    const stopAudioRecording = () => {
        if (mediaRecorderRef.current) {
            console.log('manually stopping recorder');
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
            mediaRecorderRef.current = null;
        }
    };

    useEffect(() => {
        if (props.prep) {
            console.log('starting rec');
            startAudioRecording();
        } else {
            console.log('stopping rec');
            stopAudioRecording();
        }
    }, [props.prep]);

    // -- everything else is unchanged ------------------------------------------
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
        } catch (error) {
            console.error("Error sending audio to API:", error);
        }
    }

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
                if (assessment) {
                    const transcriptionFile = new Blob([result.transcription], { type: "text/plain" });
                    const assessmentFile = new Blob([assessment], { type: "audio/wav" });
                    sessionStorage.setItem(
                        "text_feedback",
                        JSON.stringify({
                            transcription: URL.createObjectURL(transcriptionFile),
                            assessment: URL.createObjectURL(assessmentFile)
                        })
                    );
                }
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
            return result;
        } catch (error) {
            console.error("Error getting assessment", error);
        }
    }

    if (props.setup) return null;

    return (
        <div className="absolute">
            Microphone
        </div>
    );
}
