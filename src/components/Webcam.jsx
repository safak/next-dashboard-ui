import { useEffect, useState } from "react";
import Webcam from "react-webcam";


export default function Camera(props) {

    useEffect(() => {

        const promptAudio = async () => {
            await navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(stream => {
                    localStorage.setItem("cam", "granted");
                    return true;
                })
                .catch(error => {
                    localStorage.setItem("cam", "denied");
                    throw new Error('Unexpected error occurred when getting cam permissions');
                })
        }

        // const permissions = localStorage.getItem("permissions");
        // if (permissions === null) {
        promptAudio();
        // } else if (permissions === "denied") {
        //     setMicError(true);
        // }
    }, []);

    if (props.setup) return null;

    return (
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
    )
}