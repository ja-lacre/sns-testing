import { TimeWidget } from "@/components/dashboard/time-widget"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { RecentExamsCard } from "@/components/dashboard/recent-exams-card"
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card"
import { createClient } from "@/utils/supabase/server"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Fetch Stats in parallel for performance
  const [
    { count: studentsCount },
    { count: classesCount },
    { count: sentExamsCount }, // Results that are pending
    { count: examsCount },
    { data: recentExams }
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    
    supabase.from('classes').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    
    // Counting results where status is pending (needs grading)
    supabase.from('exams').select('*', { count: 'exact', head: true }).eq('release_status', 'released'),
    
    supabase.from('exams').select('*', { count: 'exact', head: true }),
    
    // Fetch 4 most recent exams
    supabase.from('exams').select('*').order('date', { ascending: false }).limit(2)
  ])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#17321A] font-montserrat tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 font-roboto mt-3 text-lg max-w-md leading-relaxed">
            Welcome back! Here is your daily overview.
          </p>
        </div>
        
        <TimeWidget />
      </div>

      {/* --- Stats Grid (Connected to DB) --- */}
      <StatsOverview 
        totalStudents={studentsCount || 0}
        activeClasses={classesCount || 0}
        sentExams={sentExamsCount || 0}
        examsManaged={examsCount || 0}
      />

      <div className="grid gap-6 md:grid-cols-7">
        
        {/* --- Recent Activity (Connected to DB) --- */}
        <RecentExamsCard exams={recentExams || []} />

        {/* --- Quick Actions Card --- */}
        <QuickActionsCard />

      </div>
    </div>
  )
}