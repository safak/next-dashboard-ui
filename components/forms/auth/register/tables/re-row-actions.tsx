"use client";

import { Row } from "@tanstack/react-table";
import Image from 'next/image'

import { SideSheet } from "@/components/sheet";
import { Eye, FilePenLine } from "lucide-react";
import { EditUser } from "@/components/forms/auth/register/register-edit-form";
import { ViewUser } from "@/components/forms/auth/register/register-view.form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeleteConfirmation } from "@/components/delete/delete-form";
import { EditButton } from "@/components/button/edit-button";
import { ViewButton } from "@/components/button/view-button";


interface DataRowActionsProps<TData> {
  row: Row<TData>;
  title: string;
  description: string;
}

export function DataRowActions<TData>({
  row,
  title,
  description,
}: DataRowActionsProps<TData>) {
  return (
    <div className="flex flex-row lg:flex-row">
      <div className="p-1">
        <SideSheet
          icon={<Eye />}
          title={title}
          description={description}
          className="w-full"
          trigger={
            <div>
              <ViewButton />
            </div>
          }
        >
          <ScrollArea className='h-full w-[360px]'>
            <ViewUser
              id={row.getValue("id")}
              image={row.getValue("image")}
              name={row.getValue("name")}
              email={row.getValue("email")}
              isTwoFactorEnabled={row.getValue("isTwoFactorEnabled")}
              isStatus={row.getValue("isStatus")}
              role={row.getValue("role")}
            />
          </ScrollArea>
        </SideSheet>
      </div>
      <div className="p-1">
        <SideSheet
          icon={<FilePenLine />}
          title={title}
          description={description}
          className="w-full"
          trigger={
            <div>
              <EditButton />
            </div>
          }
        >
          <ScrollArea className='h-full w-[360px]'>
            <EditUser
              id={row.getValue("id")}
              image={row.getValue("image")}
              name={row.getValue("name")}
              email={row.getValue("email")}
              isTwoFactorEnabled={row.getValue("isTwoFactorEnabled")}
              isStatus={row.getValue("isStatus")}
              role={row.getValue("role")}
            />
          </ScrollArea>
        </SideSheet>
      </div>
      <div className="p-1">
        <DeleteConfirmation
          eventId={row.getValue("id")}
          name={row.getValue("name")}
          classname="ease-in-out transition hover:-translate-y-1 hover:scale-110 duration-300"
        />
      </div>
    </div>
  );
}