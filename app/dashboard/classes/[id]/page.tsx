import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { ArrowLeft, Users, Calendar, Search, MoreVertical, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = 'force-dynamic'

export default async function ClassDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // 1. Fetch Class Info
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('*')
    .eq('id', params.id)
    .single()

  if (classError || !classData) {
    notFound()
  }

  // 2. Fetch Enrolled Students
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('student:students(*)')
    .eq('class_id', params.id)

  const students = enrollments?.map((e: any) => e.student) || []

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header / Breadcrumb */}
      <div>
        <Link href="/dashboard/classes" className="inline-flex items-center text-sm text-gray-500 hover:text-[#146939] transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Classes
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#17321A] font-montserrat tracking-tight">
                {classData.name}
              </h1>
              <span className="px-3 py-1 bg-[#e6f4ea] text-[#146939] text-xs font-bold rounded-full font-roboto border border-[#146939]/10">
                {classData.code}
              </span>
            </div>
            <p className="text-gray-500 font-roboto mt-2">
              Fall 2024 Semester • {students.length} Students Enrolled
            </p>
          </div>
          
          <div className="flex gap-3">
             <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-montserrat">
                Class Settings
             </Button>
             <Button className="bg-[#146939] hover:bg-[#00954f] text-white font-montserrat">
                <FileText className="mr-2 h-4 w-4" /> Create Exam
             </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Student List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
               <CardTitle className="text-lg font-bold text-[#17321A] font-montserrat">Enrolled Students</CardTitle>
               <div className="relative w-64 hidden sm:block">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                 <Input placeholder="Search students..." className="pl-9 h-9 bg-gray-50 border-gray-200" />
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-gray-100">
                 {students.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 font-roboto">
                      No students enrolled yet.
                    </div>
                 ) : (
                   students.map((student: any) => (
                     <div key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-[#17321A]/10 flex items-center justify-center text-[#17321A] font-bold font-montserrat">
                            {student.full_name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-semibold text-[#17321A] font-montserrat">{student.full_name}</p>
                             <p className="text-xs text-gray-500 font-roboto">{student.email || 'No email provided'}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#146939]">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                     </div>
                   ))
                 )}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Quick Stats & Activity */}
        <div className="space-y-6">
           <Card className="bg-[#17321A] text-white border-none shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-[#00954f] rounded-full opacity-20 blur-2xl"></div>
              <CardHeader>
                <CardTitle className="font-montserrat text-lg">Class Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-300 text-sm">Average Score</span>
                  <span className="text-2xl font-bold font-montserrat">87%</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-300 text-sm">Attendance</span>
                  <span className="text-2xl font-bold font-montserrat">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Pending Grading</span>
                  <span className="text-xl font-bold font-montserrat text-amber-400">12</span>
                </div>
              </CardContent>
           </Card>

           <Card className="border-gray-200">
             <CardHeader>
               <CardTitle className="text-md font-bold text-[#17321A] font-montserrat">Recent Activity</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex gap-3 text-sm">
                   <div className="mt-1 h-2 w-2 rounded-full bg-[#00954f] shrink-0" />
                   <div>
                     <p className="text-gray-800 font-medium">New assignment posted</p>
                     <p className="text-xs text-gray-500">2 hours ago</p>
                   </div>
                 </div>
               ))}
             </CardContent>
           </Card>
        </div>

      </div>
    </div>
  )
}