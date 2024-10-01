import Image from "next/image";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
    const data = await prisma.student.groupBy({
        by: ['sex'],
        _count: true
    });

    const boys = data.find((d) => d.sex === 'MALE')?._count || 0;
    const girls = data.find((d) => d.sex === 'FEMALE')?._count || 0;
    const total = boys + girls;

    // Calculate percentages
    const boysPercentage = total > 0 ? Math.round((boys / total) * 100) : 0;
    const girlsPercentage = total > 0 ? Math.round((girls / total) * 100) : 0;
    
    return (
        <div className='bg-white rounded-xl w-full h-full p-4'>
            {/* title */}
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Students</h1>
                <Image src='/moreDark.png' alt='' height={20} width={20} />
            </div>
            
            {/* chart */}
            <CountChart boys={boys} girls={girls} />
            
            {/* bottom */}
            <div className='flex justify-center gap-16'>
                <div className='flex flex-col gap-1'>
                    <div className='w-5 h-5 bg-lansGreen rounded-full'/>
                    <h1 className='font-bold'>{boys}</h1>
                    <h2 className='text-xs text-gray-500'>Boys ({boysPercentage}%)</h2>
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='w-5 h-5 bg-lansYellow rounded-full'/>
                    <h1 className='font-bold'>{girls}</h1>
                    <h2 className='text-xs text-gray-500'>Girls ({girlsPercentage}%)</h2>
                </div>
            </div>
        </div>
    );
};

export default CountChartContainer;
