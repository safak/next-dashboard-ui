'use client';

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


interface UserAvatarProps {
    src?: string;
    className?: string;
    fallback?: string[] | undefined;
};

export const UserAvatar = ({
    src,
    className,
    fallback
}: UserAvatarProps) => {

    return (
        <Avatar className={className}>
        <AvatarImage src={src}/>
        <AvatarFallback className="bg-primary text-white-1">{fallback}</AvatarFallback>
    </Avatar>
    )
}


// <Avatar className="h-10 w-10 cursor-pointer">
//                     <AvatarImage src={user?.image || ""} alt="userimage" />
//                     <AvatarFallback className="bg-primary text-white-1">{user?.name?.toUpperCase().split("", 2)}</AvatarFallback>
//                 </Avatar>

