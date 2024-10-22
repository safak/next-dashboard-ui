'use client'

import Link from "next/link";
import { DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuGroup, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuShortcut, 
    DropdownMenuTrigger } from "../ui/dropdown-menu";
import { LogoutButton } from "../button/logout-button";
import { useCurrentUser } from "@/hooks/auth/sign-in/use-current-user";
import { UserAvatar } from "@/components/avatar";

export function UserNav() {
    const user = useCurrentUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar src={user?.image || ""} className="h-10 w-10" fallback={user?.name?.toUpperCase().split("", 2)} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 z-[99998]">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link href="/profile">Profile</Link>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/settings">Setting</Link>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href="/auth/sign-in" onClick={() => LogoutButton}>Log out</Link>
                    <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}