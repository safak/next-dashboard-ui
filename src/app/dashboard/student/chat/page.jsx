import SearchBar from "../../../../components/SearchBar";
import Image from "next/image";
import Robot from "/public/robot-chatbot.png";


export default function ChatPage(props) {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div
                className="w-full h-full flex flex-col items-center justify-center"
            >
                <Image
                    src={Robot}
                    className="w-48 h-48"
                />
                <SearchBar />
            </div>
        </div>
    )
}