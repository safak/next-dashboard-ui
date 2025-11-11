import Image from 'next/image'
import React from 'react'

const UserCard = ({type}: {type: string}) => {
  return (
    <div className='rounded-xl odd:bg-orange-100 even:bg-orange-400 p-4 flex-1'>
      <div className='flex justify-between items-center'>
        <span className='text-xs bg-white p-1 rounded-full text-black'> 2020/25 </span>
        <Image src={'/more.png'} alt='icon' width={20} height={20} />
      </div>
      <h1 className='text-2xl font-semibold my-4'>1,000</h1>
      <h2 className='capitalized text-sm font-meduim text-gray-600'>{type}</h2>
    </div>
  )
}

export default UserCard
