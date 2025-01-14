"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";


const schema = z.object({
    username: z.string()
    .min(3, { message: 'Username must be at least 3 character long!' })
    .max(20, { message: 'Username must be max 20 character long!' }),
    email: z.string()
    .email({message:"invalid email address"}),
    password: z.string()
    .min(8, { message: 'Password must be at least 8 character long!' })
    .max(40, { message: 'Password must be max 40 character long!' }),
    bloodType: z.string().optional(),
    firstName: z.string().min(1, {message:"FirstName field is required"}),
    lastName: z.string().min(1, {message:"LastName field is required"}),
    phone: z.string().min(1, {message:"Phone field is required"}),
    address: z.string().min(1, {message:"Address field is required"}),
    birthday: z.date({message:"Birthday field is required"}),
    sex: z.enum(["male", "famale"], {message:"You need to choose"}),
    img: z.instanceof(File, {message: "Image is Required"}),
  });

  type Inputs = z.infer<typeof schema>;

const TeacherForm = ({
    type,
    data
    }:{
        type:"create" | "update"; 
        data?:any
    }) => {
        
        const {
            register,
            handleSubmit,
            formState: { errors },
          } = useForm<Inputs>({
            resolver: zodResolver(schema),
          });

    
    const onSubmit = handleSubmit(data=>{
        console.log(data);
    })


    return (
        <>
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Create a new Teacher</h1>
            <span className=" text-xs text-gray-400 font-medium">
                Authentication Infromation
            </span>
            <div className='flex justify-between flex-wrap gap-4'>
                <InputField 
                    label="Username" 
                    name="username" 
                    type="text" 
                    defaultValue={data?.username} 
                    register={register} 
                    error={errors.username} 
                />
                <InputField 
                    label="Password" 
                    name="password" 
                    type="password" 
                    defaultValue={data?.password} 
                    register={register} 
                    error={errors.password} 
                />
                <InputField 
                    label="E-mail" 
                    name="email" 
                    type="email" 
                    defaultValue={data?.email} 
                    register={register} 
                    error={errors.email} 
                />
            </div>
            <span className=" text-xs text-gray-400 font-medium">
                Personal Infromation
            </span>
            <div className='flex justify-between flex-wrap gap-4'>
                <InputField 
                    label="First Name" 
                    name="firstName" 
                    type="text" 
                    defaultValue={data?.firstName} 
                    register={register} 
                    error={errors.firstName} 
                />
                <InputField 
                    label="Last Name" 
                    name="lastName" 
                    type="text" 
                    defaultValue={data?.lastName} 
                    register={register} 
                    error={errors.lastName} 
                />
                <InputField 
                    label="Blood Type" 
                    name="bloodType" 
                    type="text" 
                    defaultValue={data?.bloodType} 
                    register={register} 
                    error={errors.bloodType} 
                />
                <InputField 
                    label="Address" 
                    name="address" 
                    type="text" 
                    defaultValue={data?.address} 
                    register={register} 
                    error={errors.address} 
                />
                <InputField 
                    label="Phone" 
                    name="phone" 
                    type="text" 
                    defaultValue={data?.phone} 
                    register={register} 
                    error={errors.phone} 
                />
                <InputField 
                    label="Birthday" 
                    name="birthday" 
                    type="date" 
                    defaultValue={data?.birthday} 
                    register={register} 
                    error={errors.phone} 
                />
                <div className='flex flex-col g2 w-full md:w-1/4'>
                    <label className="text-sm text-gray-500">Gender</label>
                    <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("sex")} defaultValue={data?.sex}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors?.sex?.message && <p className="text-sm text-red-400 font-semibold">{errors?.sex.message.toString()}</p>}
                </div>
                <div className='flex flex-col g2 w-full md:w-1/4 justify-center'>
                    <label className="text-sm text-gray-500 flex items-center gap-2 cursor-pointer" htmlFor="img">
                        <Image src="/upload.png" alt="" height={40} width={40} /><span>Upload Photo</span>
                    </label>
                    <input type="file" {...register("img")} className="hidden" id="img"/>
                    {errors?.img?.message && <p className="text-sm text-red-400 font-semibold">{errors?.img.message.toString()}</p>}
                </div>
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">{type==="create" ? "Create" : "Update"}</button>
        </form>
        </>
    )
}

export default TeacherForm