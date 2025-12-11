import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, GraduationCap, FileWarning, ArrowRight, PlusCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

// Mock Data for the Dashboard
const stats = [
  {
    title: "Total Students",
    value: "142",
    description: "Across 4 active classes",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Pending Results",
    value: "28",
    description: "From yesterday's Biology quiz",
    icon: FileWarning,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    title: "Exams Managed",
    value: "12",
    description: "3 exams scheduled this week",
    icon: GraduationCap,
    color: "text-[#00954f]",
    bg: "bg-[#e6f4ea]",
  },
]

const recentExams = [
  { name: "Chemistry Midterm", class: "CHEM-101", date: "Oct 24, 2024", status: "Published" },
  { name: "Biology Pop Quiz", class: "BIO-202", date: "Oct 26, 2024", status: "Draft" },
  { name: "Physics Final", class: "PHY-303", date: "Nov 02, 2024", status: "Scheduled" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#17321A] font-montserrat">Dashboard</h1>
          <p className="text-gray-500 font-roboto mt-1">Welcome back, Professor Smith. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
            <Link href="/dashboard/results">
                <Button className="bg-[#146939] hover:bg-[#17321A] font-montserrat">
                    <CheckCircle className="mr-2 h-4 w-4" /> Send Scores
                </Button>
            </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-montserrat text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-roboto text-[#17321A]">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1 font-roboto">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        
        {/* Recent Activity / Exams Table */}
        <Card className="md:col-span-4 lg:col-span-5 border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#17321A] font-montserrat">Recent Exams</CardTitle>
            <CardDescription className="font-roboto">Latest exam papers created or modified.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExams.map((exam, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-[#17321A]/10 flex items-center justify-center text-[#17321A] font-bold font-montserrat">
                        {exam.class.substring(0, 1)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#17321A] font-montserrat group-hover:text-[#00954f] transition-colors">
                        {exam.name}
                      </p>
                      <p className="text-xs text-gray-500 font-roboto">
                        {exam.class} • {exam.date}
                      </p>
                    </div>
                  </div>
                  <div className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    exam.status === 'Published' ? 'bg-green-100 text-green-700' :
                    exam.status === 'Draft' ? 'bg-gray-200 text-gray-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {exam.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Tips */}
        <Card className="md:col-span-3 lg:col-span-2 bg-[#17321A] text-white border-none shadow-lg relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-[#00954f] rounded-full opacity-20 blur-2xl"></div>
          
          <CardHeader>
            <CardTitle className="font-montserrat text-lg">Quick Actions</CardTitle>
            <CardDescription className="text-gray-300 font-roboto text-xs">Manage your workflow efficiently.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
             <Button variant="secondary" className="w-full justify-between hover:bg-gray-100 font-montserrat text-[#17321A]">
                Create New Exam <PlusCircle className="h-4 w-4" />
             </Button>
             <Button variant="ghost" className="w-full justify-between text-white hover:text-white hover:bg-[#146939] font-montserrat border border-[#146939]">
                View Reports <ArrowRight className="h-4 w-4" />
             </Button>
             
             <div className="mt-6 pt-6 border-t border-[#146939]">
                <h4 className="font-bold text-sm mb-2 font-montserrat text-[#00954f]">Did you know?</h4>
                <p className="text-xs text-gray-300 font-roboto leading-relaxed">
                    You can now bulk-import student scores using CSV format in the Students tab.
                </p>
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}