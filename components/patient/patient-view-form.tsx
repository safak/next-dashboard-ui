'use client'

import Image from 'next/image';
import { RowActionsProps } from '@/types'
import { Badge } from '@/components/ui/badge'

export function ViewPatient<TData>({ row }: RowActionsProps<TData>) {

  return (
    <div className="ms-1.5 w-[325px] flex flex-col gap-5 pt-5 pb-16">
      <div className="grid gap-2">
        <div className="flex flex-col items-start w-full rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">
            TV image
          </p>
          <p className="truncate text-xs max-w-[300px] font-mono p-1 bg-slate-100 rounded-md">
            {row.getValue("tvIcon")}
          </p>
          {!row.getValue("tvIcon") ? (<Image
            src='/images/no-image.png'
            width={400}
            height={400}
            alt='no image'
            className='rounded-xl'
          />) : (
            <Image
              src={row.getValue("tvIcon")}
              width={400}
              height={400}
              alt="thumbnail"
              className='rounded-xl'
            />
          )}
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">
            TV Name
          </p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {row.getValue("tvName")}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">
            TV Number
          </p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {row.getValue("tvNumber")}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">
            TV Media
          </p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {row.getValue("tvmedia")}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">
            Status
          </p>
          <Badge
            variant={row.getValue("isStatus") ? "success" : "destructive"}
          >
            {row.getValue("isStatus") ? "Enable" : "Disable"}
          </Badge>
        </div>
      </div>
    </div>
  )
}