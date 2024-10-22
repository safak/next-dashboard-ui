
import { usePathname, useRouter } from "next/navigation";
import Image from 'next/image'
import { DeleteConfirmation } from "@/components/delete/delete-form";
import { SideSheet } from "../sheet";
import { Edit, Info } from "lucide-react";
import { EditAppForm } from "./app-edit-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppCardProps } from "@/types";


const AppsCard = ({
  image, name, status, packagename, description, id, classname
}: AppCardProps) => {
  const pathname = usePathname();


  return (
    <div className="group hover:shadow-md transition overflow-hidden border rounded-lg p-3 h-full">
      <div className="relative w-full aspect-video rounded-md overflow-hidden">
        {!image ? (<Image
          src='/images/no-image.png'
          fill
          alt='no image'
          className='aspect-square h-fit w-full rounded-xl 2xl:size-[200px]'
        />) : (
          <Image
            src={image}
            fill
            alt={name}
            className='aspect-square h-fit w-full rounded-xl 2xl:size-[200px]'
          />
        )}
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl p-3 shadow-sm transition-all flex-center flex-grow bg-cover bg-center text-grey-500">
          <SideSheet
            icon={<Edit />}
            title={name}
            description={name}
            className="w-full"
            trigger={
              <Image src="/icons/edit.svg" alt="edit" className="hidden group-hover:block w-5 h-5 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" width={20} height={20} />
            }
          >
            <ScrollArea className='h-full w-[360px]'>
              <EditAppForm
                image={image}
                name={name}
                status={status}
                packagename={packagename}
                description={description}
                id={id}
                classname={classname}
              />
            </ScrollArea>
          </SideSheet>
          <DeleteConfirmation
            eventId={id}
            name={name}
            classname="hidden group-hover:block w-5 h-5 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          />
        </div>
      </div>

      <div className="flex flex-col pt-2">
        <div className="text-lg md:text-base font-medium group-hover:text-primary transition line-clamp-2">
          {name}
        </div>
        <p className="text-xs text-muted-foreground">
          {status}
        </p>
        <div className="my-3 items-center gap-x-2 text-sm md:text-sm text-slate-500 line-clamp-3">
          <span>
            {description}
          </span>
        </div>
        {/* <div className="flex gap-2 overflow-hidden cursor-pointer">
          <p className="text-xs">More..</p>
          <SideSheet
            icon={<Info />}
            title={name}
            description={description}
            className="w-full"
            trigger={
              <Image src="/icons/arrow.svg" alt="search" width={10} height={10} />
            }
          >
            Info
          </SideSheet>
        </div> */}
      </div>
    </div>

  )

}

export default AppsCard