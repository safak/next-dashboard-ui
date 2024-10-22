import React from 'react'
import DashboardCard from './card'
import { PieChartComponent } from './piechart-donut'
import { BarChartComponent } from './barchart'
import { BarInterActiveComponent } from './bar-interactive'
import { CodeSquare, Server, Tv2, Users2 } from 'lucide-react'
import { getApp, getDevices, getTvChannel, getUserClients } from '@/actions/dashboard'

type Props = {}

const Dashboard = async (props: Props) => {

    const users = await getUserClients()
    const tvchannel = await getTvChannel()
    const apps = await getApp()
    const devices = await getDevices()
    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    value={devices || 0}
                    title="Total Devices"
                    icon={<Server />}
                />
                <DashboardCard
                    value={tvchannel || 0}
                    title="TV Channels"
                    icon={<Tv2 />}
                />
                <DashboardCard
                    value={apps || 0}
                    title="Applications"
                    icon={<CodeSquare />}
                />
                <DashboardCard
                    value={users || 0}
                    title="Users"
                    icon={<Users2 />}
                />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <PieChartComponent
                    title='Visitor to your tv channel'
                    daterange='January - June 2024'
                    value={5.9}
                />
                <BarChartComponent
                    title='Visitor to your tv channel'
                    daterange='January - June 2024'
                    unit='unit'
                    value={3.3}
                />
            </div>
            <div>
                <BarInterActiveComponent
                title='Bar Chart - Interactive'
                description='Showing total visitors for the last 3 months'
                />
            </div>
        </div>

    )
}

export default Dashboard