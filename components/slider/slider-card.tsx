import { SliderCardProps } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import Image from 'next/image'
import { SideSheet } from "../sheet";
import { Edit } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { DeleteConfirmation } from "../delete/delete-form";
import { EditSliderForm } from "./slider-edit-form";
import { EditButtonOn } from "../button/edit-button-on";


const SliderCard = ({
    name,
    image,
    isStatus,
    id
}: SliderCardProps) => {
    const pathname = usePathname();
    return (
        <div className="group hover:shadow-md transition overflow-hidden border rounded-lg p-3 h-ful">
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
                {!image ? (<Image
                    src='/images/no-image.png'
                    fill
                    alt='no image'
                    className='aspect-square h-fit w-full rounded-xl 2xl:size-[200px] transition-all duration-300 hover:scale-110'
                />) : (
                    <Image
                        src={image}
                        fill
                        alt={name}
                        className='aspect-square h-fit w-full rounded-xl 2xl:size-[200px] transition-all duration-300 hover:scale-110'
                    />
                )}
                <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl p-3 shadow-sm transition-all flex-center flex-grow bg-center text-grey-500 hover:bg-white-2">
                    <SideSheet
                        icon={<Edit />}
                        title={name}
                        description={name}
                        className="w-full"
                        trigger={
                            <div>
                            <EditButtonOn />
                        </div>
                        }
                    >
                        <ScrollArea className='h-full w-[360px]'>
                            <EditSliderForm
                                id={id}
                                name={name}
                                image={image}
                                isStatus={isStatus}
                            />
                        </ScrollArea>
                    </SideSheet>
                    <DeleteConfirmation
                        eventId={id}
                        name={name}
                        classname="hidden group-hover:block ease-in-out transition hover:-translate-y-1 hover:scale-110 duration-300"
                    />
                </div>
            </div>

            <div className="flex flex-col pt-2">
                <div className="text-lg md:text-base font-medium group-hover:text-primary transition line-clamp-2">
                    {name}
                </div>
                <p className="text-xs text-muted-foreground">
                    {isStatus}
                </p>
                <div className="my-3 flex flex-col items-center gap-x-2 text-sm md:text-xs">
                </div>
            </div>
        </div>
    )
}

export default SliderCard