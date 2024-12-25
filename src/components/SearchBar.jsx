'use client'
import SendIcon from '@mui/icons-material/Send';

export default function SearchBar({handleSend, value, setValue}, props) {

    const onChange = (e) => {
        setValue(e.target.value);
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
                    onChange={(e) => {props.onChange ? props.onChange(e) : onChange(e)}}
                    value={value}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            handleSend();
                            setValue('');
                        }
                    }}
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