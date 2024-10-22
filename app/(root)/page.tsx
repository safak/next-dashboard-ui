"use client";
import { CalendarDateRangePicker } from "@/components/calendar/date-range-picker";
import Dashboard from "@/components/dashboard";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            {/* <Button>Download</Button> */}
          </div>
        </div>
        <Dashboard />
      </div>
    </>
  )
}