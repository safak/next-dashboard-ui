import Image from 'next/image'
import React from 'react'

const UserCard = ({type}:{type:string}) => {
  return (
    <div className="rounded-2xl odd:bg-lansGreen even:bg-lansYellow p-4 flex-1 min-w-[130px] ">
        <div className='flex justify-between items-center'>
            <span className='text-[10px] bg-white px-2 py-1 rounded-full text-green-800'>2024/2025</span>
            <Image src='/more.png' alt='' width={20} height={20}/>
        </div>
        <h1 className='text-2xl font-semibold my-4'>1,213</h1>
        <h2 className='capitalize text-sm font-medium text-yellow-50'>{type}<span className='lowercase text-sm'>s</span></h2>
    </div>
  )
}

export default UserCard