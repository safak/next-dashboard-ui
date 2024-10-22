import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

type Props = {
    title: string
    value: number
    icon: JSX.Element
    sales?: boolean
}

const DashboardCard = ({ icon, title, value, sales }: Props) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center text-5xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                </p>
            </CardContent>
        </Card>
    )
}

export default DashboardCard