'use client'

import { ProfileSchema } from "@/schemas/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/avatar";
import { UsersProps } from "@/types/index";


export const ViewUser = ({ name, email, role, image, isTwoFactorEnabled, isStatus }: UsersProps) => {

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            image: image || undefined,
            name: name,
            email: email,
            role: role,
            isTwoFactorEnabled: isTwoFactorEnabled || undefined,
            isStatus: isStatus || undefined
        },
    });

    return (
        <div className="ms-1.5 w-[325px] flex flex-col gap-5 pt-5 pb-16">
            <div className="grid gap-2">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Name
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                        {name}
                    </p>
                    <UserAvatar src={image || '/images/no-avatar.png'} className="h-14 w-14 text-center" fallback={["No Image"]} />
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Email
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                        {email}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Role
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                        {role}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Status
                    </p>
                    <Badge
                        variant={isStatus ? "success" : "destructive"}
                    >
                        {isStatus ? "Enable" : "Disable"}
                    </Badge>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Two Factor Authentication
                    </p>
                    <Badge
                        variant={isTwoFactorEnabled ? "success" : "destructive"}
                    >
                        {isTwoFactorEnabled ? "ON" : "OFF"}
                    </Badge>
                </div>
            </div>
        </div>
    )
}
