"use client"
import Image from "next/image"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', income: 4520, expense: 2150 },
    { name: 'Feb', income: 3600, expense: 1230 },
    { name: 'Mar', income: 2900, expense: 5400 },
    { name: 'Apr', income: 3100, expense: 2890 },
    { name: 'May', income: 4700, expense: 3700 },
    { name: 'Jun', income: 2200, expense: 2900 },
    { name: 'Jul', income: 3850, expense: 4200 },
    { name: 'Aug', income: 4700, expense: 4600 },
    { name: 'Sep', income: 5000, expense: 3200 },
    { name: 'Oct', income: 3900, expense: 4100 },
    { name: 'Nov', income: 4300, expense: 3000 },
    { name: 'Dec', income: 3400, expense: 4500 },
  ];
  

const FinianceChart = () => {
  return (
    <div className='bg-white rounded-xl w-full h-full p-4'>
        {/* TITLE  */}
        <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Finance</h1>
            <Image src="/moreDark.png" alt="" width={20} height={20} />
        </div>
        <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" axisLine={false} tick={{fill: "d1d5db"}} tickLine={false} stroke="5"/>
          <YAxis axisLine={false} />
          <Tooltip />
          <Legend align="center" verticalAlign="top" wrapperStyle={{paddingTop: "10px", paddingBottom: "20px"}} />
          <Line type="monotone" dataKey="income" stroke="#C3EBFA" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="expense" stroke="#CFCEFF" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FinianceChart