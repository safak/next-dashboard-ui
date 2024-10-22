'use client'

import { useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/spinner'
import { deleteEvent } from '@/hooks/deleteEvent'
import { Hint } from '@/components/tootips'

type Props = {
  eventId: string,
  name: string,
  classname?: string
}

export const DeleteConfirmation = ({ eventId, name, classname }: Props) => {
  const pathname = usePathname()
  const router = useRouter();
  let [isPending, startTransition] = useTransition()

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Hint
          side="top"
          align="center"
          label="Delete"
        >
          <Image src="/icons/delete.svg" alt="delete" className={classname} width={20} height={20} />
        </Hint>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white-1">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to do this?</AlertDialogTitle>
          <AlertDialogDescription className="p-regular-16 text-grey-600">
            <span className="font-semibold text-primary">
              #{name}
            </span> will be permanentely deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                await deleteEvent(eventId, pathname)
                router.refresh();
                window.location.reload();
              })
            }>
            {isPending ? <Spinner /> : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}