import React, { useEffect, useRef } from "react";

export default function MessageBox({ messages }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    const renderedMessages = messages.map((msg, index) => {
        const isLeftAligned = index % 2 === 0;
        return (
            <div
                key={`msg-${index}`}
                className={`p-2 my-2 w-fit max-w-xs ${
                    isLeftAligned ? "text-right self-end bg-blue-200" : "text-left self-start bg-gray-200"
                } rounded-lg`}
            >
                {msg}
            </div>
        );
    });

    return (
        <div
            ref={containerRef}
            className="h-full overflow-y-auto flex flex-col gap-2 p-4 -z-10 mt-10 rounded bg-white"
        >
            {renderedMessages}
        </div>
    );
}
