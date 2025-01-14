"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
// import TeacherForm from "./forms/TeacherForm";
// import MemberForm from "./forms/MemberForm";


const TeacherForm = dynamic(()=>import("./forms/TeacherForm"),{
    loading:()=> <h1>Loading...</h1>
});
const MemberForm = dynamic(()=>import("./forms/MemberForm"),{
    loading:()=> <h1>Loading...</h1>
});

const forms :{[key:string]:(type:"create" | "update" , data?:any)=>JSX.Element;

}={
    teacher: (type,data) => <TeacherForm type={type} data={data}/>,
    student: (type, data) => <MemberForm type={type} data={data}/>,
};

const FormModal = ({table, type, data, id}:{
    table:
    | "teacher"
    | "student"
    | "parent"
    | "class"
    | "lesson"
    | "event"
    | "announcement";
    type:"create" | "update" | "delete" | "view";
    data?:any;
    id?: number;
    

}) => {

    const size = type ==="create" ? "w-8 h-8" : "w-7 h-7";
    const bgColor = 
        type === "create" 
        ? "bg-zeidYellow" 
        : type === "update" 
        ? "bg-zeidSky" 
        : "bg-zeidPurple";
    const [open, setOpen] = useState(false);


    const Form = () => {
        return (
            type === "delete" && id ? 
            (
                <form action="" className=" p-4 flex flex-col gap-4">
                    <span className="text-center font-medium">Are you sure? This <b>{table}</b> data will be lost</span>
                    <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">Delete</button>
                </form>
            ) 
            : type === "create" || type === "update" ?
            (
                forms[table](type, data)
            ) : "Form not found!"
        );
    };


    return (
    <>
        <button className={`${size} flex items-center justify-center rounded-full ${bgColor}`} onClick={()=>setOpen(true)}>
            <Image src={`/${type}.png`} alt="" width={16} height={16}/>
        </button>
        {open && (
            <div className='w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-5- flex items-center justify-center'>
                <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] '>
                <Form/>
                    <div className='absolute top-4 right-4 cursor-pointer' onClick={()=>setOpen(false)}>
                        <Image src="/close.png" alt="" width={14} height={14}/>
                    </div>
                </div>
            </div>
        )}
    </>
  )
}

export default FormModal