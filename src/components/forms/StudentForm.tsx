'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from './InputField';
import Image from 'next/image';

const schema = z.object({
    username: z.string().min(3, { message: 'username must be at least 3 characters long!' }).max(3, { message: 'username must be at most 20 characters long!' }),
    email: z.string().email({message: 'Invalid email address!'}),
    password: z.string().min(8, {message: 'password must be at least 8 characters long!'}),
    firstName: z.string().min(1, { message: 'first name is required!' }),
    lastName: z.string().min(1, { message: 'last name is required!' }),
    phone: z.number().min(1, { message: 'phone number is required!' }),
    address: z.string().min(1, { message: 'address is required!' }),
    bloodType: z.string().min(1, { message: 'Blood type is required!' }),
    birthday: z.date( { message: 'birthday is required!' }),
    sex: z.enum(['male','female'], { message:'sex is required!'}),
    img: z.instanceof(File, { message: 'image is required!' }),
  });

  type Inputs = z.infer<typeof schema>;

const StudentForm = ({type,data}:{type:'create' | 'update'; data?:any}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<Inputs>({
        resolver: zodResolver(schema),
      });

      const onSubmit = handleSubmit(data=>{
        console.log(data)
      })

  return (
    <form className='flex flex-col gap-8' onSubmit={onSubmit}>
        <h1 className='text-xl font-semibold'>Create a new Student</h1>
        <span className='text-xs text-gray-400 font-medium'>Authentication Information</span>
        <div className='flex justify-between flex-wrap gap-4'>
            <InputField label='Username' name='username' defaultValue={data?.username} register={register} error={errors?.username}/>
            <InputField label='Email' type='email' name='email' defaultValue={data?.email} register={register} error={errors?.email}/>
            <InputField label='Password' type='password' name='password' defaultValue={data?.password} register={register} error={errors?.password}/>
        </div>
        <span className='text-xs text-gray-400 font-medium'>Personal Information</span>
        <div className='flex justify-between flex-wrap gap-4'>
            <InputField label='First Name' name='firstName' defaultValue={data?.firstName} register={register} error={errors?.firstName}/>
            <InputField label='Last Name' name='lastName' defaultValue={data?.lastName} register={register} error={errors?.lastName}/>
            <InputField label='Phone' name='phone' defaultValue={data?.phone} register={register} error={errors?.phone}/>
            <InputField label='Address' name='address' defaultValue={data?.address} register={register} error={errors?.address}/>
            <InputField label='Blood Type' name='bloodType' defaultValue={data?.bloodType} register={register} error={errors?.bloodType}/>
            <InputField label='Birthday' name='birthday' type='date' defaultValue={data?.birthday} register={register} error={errors?.birthday}/>
        <div className='flex flex-col gap-2 w-full md:w-1/4'>
            <label htmlFor='sex' className='text-xs text-gray-500'>sex</label>
            <select id='sex' className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full cursor-pointer' {...register('sex')} defaultValue={data?.sex}>
                <option value='male' className='cursor-pointer'>Male</option>
                <option value='female' className='cursor-pointer'>Female</option>
            </select>
            {errors.sex?.message && <p className='text-xs text-red-400'>{errors.sex.message.toString()}</p>}
        </div>
        <div className='flex flex-col gap-2 w-full md:w-1/4 justify-center'>
            <label htmlFor='img' className='text-xs text-gray-500 flex items-center gap-2 cursor-pointer'>
                <Image src='/upload.png' alt='upload' width={28} height={28}/>
                <span>Upload Image</span>
            </label>
            <input type='file' id='img' {...register('img')} className='hidden'/>
            {errors?.img?.message && <p className='text-xs text-red-400'>{errors.img.message.toString()}</p>}
        </div>
        </div>
        <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'create' : 'update'}</button>
    </form>
  )
}

export default StudentForm