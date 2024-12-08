"use client";
import Image from 'next/image';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
    {
      name: 'Sep',
      income: 400,
      expenses: 2400,
      amt: 2400,
    },
    {
      name: 'Oct',
      income: 645,
      expenses: 1000,
      amt: 2210,
    },
    {
      name: 'Nov',
      income: 700,
      expenses: 800,
      amt: 2290,
    },
    {
      name: 'Dec',
      income: 1200,
      expenses: 50,
      amt: 2000,
    },
    {
      name: 'Jan',
      income: 500,
      expenses: 2400,
      amt: 2181,
    },
    {
      name: 'Feb',
      income: 450,
      expenses: 145,
      amt: 2500,
    },
    {
      name: 'Mar',
      income: 1400,
      expenses: 600,
      amt: 2100,
    },
    {
        name: 'Mai',
        income: 1670,
        expenses: 500,
        amt: 2100,
      },
      {
        name: 'Jun',
        income: 1200,
        expenses: 2400,
        amt: 2100,
      },
      {
        name: 'Jul',
        income: 300,
        expenses: 1200,
        amt: 2100,
      },
      {
        name: 'Aug',
        income: 0,
        expenses: 800,
        amt: 2100,
      },
  ];

const FinanceChart = () => {
  return (
    <div className='bg-white rounded-lg p-4 h-full'>
        <div className='flex justify-between items-center'>
            <h1 className='text-lg font-semibold'>Finances</h1>
            <Image src="/moreDark.png" alt='' width={20} height={20}/>
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
          <CartesianGrid strokeDasharray="3 3" stroke='#ddd'/>
          <XAxis dataKey="name" axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false} tickMargin={10}/>
          <YAxis axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false} tickMargin={20}/>
          <Tooltip />
          <Legend align='center' verticalAlign='top' wrapperStyle={{paddingTop:"10px", paddingBottom:"30px"}}/>
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#302780" 
            strokeWidth={5}
            />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#de7ed6" 
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


export default FinanceChart