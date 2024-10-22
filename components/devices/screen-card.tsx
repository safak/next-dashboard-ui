import { ScreenCardProps } from "@/types";
import { usePathname } from "next/navigation";
import Image from 'next/image'
import { Edit } from "lucide-react";
import { DeleteConfirmation } from "@/components/delete/delete-form";
import Modal from "../modal";
import { SocketIndicator } from "./socket-indicator";
import { Badge } from "@/components/ui/badge";
import { EditScreen } from "./device-edit-form";
import { EditButtonOn } from "@/components/button/edit-button-on";
// import { EditSliderForm } from "./slider-edit-form";



const ScreenCard = ({
    name,
    ipaddress,
    id
}: ScreenCardProps) => {
    const pathname = usePathname();
    const status = true;
    return (
        <div className="group hover:shadow-md transition overflow-hidden border rounded-lg p-3 h-full">
            <div className="relative w-full rounded-md">
                <div className="absolute right-1 flex flex-row gap-2 p-3">
                    <Modal
                        title="Add your Screen"
                        description="Create a new screen"
                        trigger={
                            <div>
                                <EditButtonOn />
                            </div>
                        }
                    >
                        <EditScreen
                            id={id}
                            name={name}
                            ipaddress={ipaddress}
                        />
                    </Modal>
                    <DeleteConfirmation
                        eventId={id}
                        name={name}
                        classname="hidden group-hover:block ease-in-out transition hover:-translate-y-1 hover:scale-110 duration-300"
                    />
                </div>
            </div>
            <div className="flex flex-col justify-start">
                <div className="text-sm md:text-base font-semibold group-hover:text-white-1 transition line-clamp-2">
                    <Badge className="bg-greenlight rounded-sm">{name}</Badge>
                </div>
                <div className="flex flex-row pt-2 gap-4 space-x-2">
                    <div className="flex flex-col gap-x-2 text-xs md:text-xs text-gray-400">
                        {ipaddress}
                    </div>
                    <SocketIndicator />
                    {/* <div className="flex flex-col gap-x-2 text-xs md:text-xs text-gray-400 justify-end">
                    <Image
                        src='/images/no-image.png'
                        width={40}
                        height={20}
                        alt='deviceimage'
                        className='rounded-md'
                    />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ScreenCard