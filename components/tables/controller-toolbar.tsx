import { usePathname } from "next/navigation"
import { AddChannel } from "../tvchannel"
import AddUser from "../forms/auth/register"
import { DataTableTVChannelToolbar } from "./data-table-toolbar-tvchannel"
import { DataTableRegisToolbar } from "./data-table-toolbar-register"
import { Table } from "@tanstack/react-table";
import { DataTablePatientToolbar } from "./data-table-toolbar-patient"
import { DataTableRoomToolbar } from "./data-table-toolbar-room"

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function ControllerTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const pathname = usePathname();

    switch (pathname) {
        case "/tvchannel":
            return (
                <DataTableTVChannelToolbar table={table} />
            )
        case "/patient":
            return (
                //Wait for modify
                <DataTablePatientToolbar table={table} />
            )
        case "/register":
            return (
                <DataTableRegisToolbar table={table} />
            )
        case "/rooms":
            return (
                //Wait for modify
                <DataTableRoomToolbar table={table} />
            )
    }

}