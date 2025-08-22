import React from 'react'

type WrapperProps ={
    children: React.ReactNode
}
export default function Wrapper({children}: WrapperProps) {
  return (
    <div>
      <div className='px-5 md:px-[10%] mt-10'>
        {children}
      </div>
    </div>
  )
}
