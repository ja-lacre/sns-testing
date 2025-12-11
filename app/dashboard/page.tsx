import { TimeWidget } from "@/components/dashboard/time-widget"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { RecentExamsCard } from "@/components/dashboard/recent-exams-card"
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card"

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          {/* Increased text sizes here */}
          <h1 className="text-4xl sm:text-5xl font-bold text-[#17321A] font-montserrat tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 font-roboto mt-3 text-lg max-w-md leading-relaxed">
            Welcome back! Here is your daily overview.
          </p>
        </div>
        
        {/* Time Widget */}
        <TimeWidget />
      </div>

      {/* --- Stats Grid --- */}
      <StatsOverview />

      <div className="grid gap-6 md:grid-cols-7">
        
        {/* --- Recent Activity / Exams Table --- */}
        <RecentExamsCard />

        {/* --- Quick Actions Card --- */}
        <QuickActionsCard />

      </div>
    </div>
  )
}