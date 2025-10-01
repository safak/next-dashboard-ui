import AnalyticsChart from "@/components/AnalyticsChart"
import Calendar from "@/components/Calendar"
import CountChart from "@/components/CountChart"
import Notification from "@/components/Notification"
import ReportChart from "@/components/ReportChart"
import UserCards from "@/components/UserCards"

const AdminPage = () => {
    return(
        <div className="p-4 flex gap-4 flex-col md:flex-row">
            {/* left side */}
            <div className="w-full lg:w-2/3">
            {/* user cards */}
            <div className="flex gap-4 justify-between flex-wrap ">
                <UserCards type="Compliant"/>
                <UserCards type="Technicians"/>
                <UserCards type="Resolved Compliant"/>
                <UserCards type="Resident"/>
            </div>
            {/* middle chart */}
            <div className="flex gap-4 flex-col lg:flex-row">
                {/* count chart */}
                <div className="w-full lg:w-1/3 h-[450px]">
                <CountChart/>
                </div>
                {/* report chart */}
                <div className="w-full lg:w-2/3 h-[450px]">
                <ReportChart/>
                </div>
            </div>
            {/* bottom chart */}
            <div className="w-full h-[500px]">
            <AnalyticsChart/>
            </div>
            </div>
            {/* right side */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <Calendar/>
            <Notification/>
            </div>
        </div>
    )
} 

export default AdminPage