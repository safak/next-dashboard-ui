"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";


const schema = z.object({
    username: z.string()
    .min(3, { message: 'Username must be at least 3 character long!' })
    .max(20, { message: 'Username must be max 20 character long!' }),
    email: z.string()
    .email({message:"invalid email address"}),
    password: z.string()
    .min(8, { message: 'Password must be at least 8 character long!' })
    .max(40, { message: 'Password must be max 40 character long!' }),
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
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Create a new Teacher</h1>
            <span className=" text-xs text-gray-400 font-medium">
                Authentication Infromation
            </span>
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
            <div className=''>
                <span className=" text-xs text-gray-400 font-medium">
                    Personal Infromation
                </span>
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">{type==="create" ? "Create" : "Update"}</button>
        </form>
    )
}

export default TeacherForm