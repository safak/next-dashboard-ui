'use client';
import Image from 'next/image';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
// rest of your component...

const data = [
  {
    name: 'Total',
    count: 144,
    fill: 'white',
  },
  {
    name: 'Boys',
    count: 84,
    fill: '#FAE27C',
  },
  {
    name: 'Girls',
    count :60,
    fill: '#C3EBFA',
  }
];


const CountChart = () => {
  return (
    <div className='bg-white rounded-xl w-full h-full p-4'>
        {/* TITLE  */}
        <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Students</h1>
            <Image src="/moreDark.png" alt="" width={20} height={20} />
        </div>
        {/* CHART  */}
        <div className="relative w-full h-[75%]">
        <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
          <RadialBar
            
            background
            dataKey="count"
          />
          
        </RadialBarChart>
      </ResponsiveContainer>
            <Image src="/maleFemale.png" alt='' height={50} width={50} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
        </div>
        {/* BOTTOM  */}
        <div className="flex justify-center gap-16">
            <div className="flex flex-col gap-1">
                <div className="w-5 h-5 bg-lamaSky rounded-full"></div>
                <h1 className='font-bold'>1,212</h1>
                <h2 className='text-xs text-gray-300'>Boys (55%)</h2>
            </div>
            <div className="flex flex-col gap-1">
                <div className="w-5 h-5 bg-lamaYellow rounded-full"></div>
                <h1 className='font-bold'>1,212</h1>
                <h2 className='text-xs text-gray-300'>Girls (45%)</h2>
            </div>
        </div>
    </div>
  )
}

export default CountChart