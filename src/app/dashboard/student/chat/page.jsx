'use client';
import Image from "next/image";
import Robot from "/public/robot-chatbot.png";
import SearchBar from "/src/components/SearchBar";
import { useState } from "react";
import MessageBox from "/src/components/MessageBox";
import ReactLoading from 'react-loading';

export default function ChatPage() {
    const [messages, setMessages] = useState(["Hello! I’m AspireAI! Ask me any questions regarding colleges, careers, or feelings. You name it! I can probably help you out!"]);
    const [currMessage, setCurrMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {

        setLoading(true);

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: currMessage })
        });

        const data = await response.json();
        console.log(data.message.content)
        setCurrMessage("");
        setMessages((prev) => [...prev, currMessage, data.message.content]);
        setLoading(false);
    };

    return (
        <div className="w-full h-[90%] flex flex-col justify-between">
            {/* MessageBox Section */}
            <div className="h-[90%] w-full flex justify-center items-start">
                <div className="w-2/3 h-full">
                    {
                        loading ?
                            <div
                                className="h-full w-full flex justify-center items-center"
                            >
                                <ReactLoading type={'bubbles'} color={'black'} />
                            </div> :
                            messages.length > 0 ?
                                <MessageBox messages={messages} /> :
                                <div className="h-full flex justify-center items-center text-gray-500">
                                    No messages...
                                </div>
                    }
                </div>
            </div>

            {/* Input Section */}
            <div className="h-fit self-end w-full flex justify-center items-center">
                <Image
                    src={Robot}
                    className="w-32 h-32"
                    alt="Robot Image"
                />
                <SearchBar
                    handleSend={handleSend}
                    value={currMessage}
                    setValue={setCurrMessage}
                />
            </div>
        </div>
    );
}
