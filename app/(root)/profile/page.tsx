"use client";

import { UserInfo } from '@/components/forms/auth/profile'
import { useCurrentUser } from '@/hooks/auth/sign-in/use-current-user';
import React from 'react'

const ProfilePage = () => {
    const user = useCurrentUser();
    return (
        <div className='h-full flex-1 flex-col space-y-2 pt-8 md:flex'>
            <UserInfo />
        </div>
    )
}

export default ProfilePage