'use client'
import SendIcon from '@mui/icons-material/Send';

export default function SearchBar() {

    const handleSend = () => {

    }
    return (
        <div
            className="w-1/2 rounded-md"
        >
            <div
                className="flex items-center gap-2"
            >
                <input
                    className="rounded-l-full rounded-r-full w-full bg-black/20 placeholder-black/50 pl-6 p-4 text-xl focus:outline-none"
                    type="text"
                    placeholder="Ask anything..."
                />

                <button
                    onClick={handleSend}
                >
                    <SendIcon
                        className="text-black w-8 h-8 hover:text-black/50 "
                    />
                </button>
            </div>

        </div>
    )
}