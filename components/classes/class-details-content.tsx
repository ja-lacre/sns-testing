'use client'

import { useState } from "react"
import { ArrowLeft, Users, Search, MoreVertical, FileText, Settings, Calendar, Award } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Student {
  id: string
  full_name: string
  email: string
}

interface ClassDetails {
  id: string
  name: string
  code: string
  status: string
}

interface ClassDetailsContentProps {
  classData: ClassDetails
  students: Student[]
}

export function ClassDetailsContent({ classData, students }: ClassDetailsContentProps) {
  const [search, setSearch] = useState("")

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* --- Breadcrumb & Header --- */}
      <div>
        <Link href="/dashboard/classes" className="inline-flex items-center text-sm text-gray-500 hover:text-[#146939] transition-colors mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to My Classes
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
             <div className="flex items-center gap-3 mb-2">
               <h1 className="text-4xl font-bold text-[#17321A] font-montserrat tracking-tight">
                 {classData.name}
               </h1>
               <span className={cn(
                 "px-3 py-1 text-xs font-bold rounded-full font-roboto border",
                 classData.status === 'active' 
                   ? "bg-[#e6f4ea] text-[#146939] border-[#146939]/10" 
                   : "bg-gray-100 text-gray-500 border-gray-200"
               )}>
                 {classData.code}
               </span>
             </div>
             <p className="text-gray-500 font-roboto text-lg">
               Active Session • {students.length} Students Enrolled
             </p>
          </div>
          
          <div className="flex gap-3">
             <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 font-montserrat rounded-xl h-11">
                <Settings className="mr-2 h-4 w-4" /> Class Settings
             </Button>
             <Button className="bg-[#146939] hover:bg-[#00954f] text-white font-montserrat rounded-xl h-11 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <FileText className="mr-2 h-4 w-4" /> Create Exam
             </Button>
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-px w-full bg-gray-200 mt-6"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Left Column: Student List --- */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50 pt-6 px-6">
               <CardTitle className="text-lg font-bold text-[#17321A] font-montserrat flex items-center gap-2">
                 <Users className="h-5 w-5 text-[#00954f]" />
                 Enrolled Students
               </CardTitle>
               
               <div className="relative w-64 hidden sm:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <Input 
                   placeholder="Search students..." 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="pl-9 h-10 bg-gray-50 border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] rounded-xl" 
                 />
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                 {filteredStudents.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 font-roboto flex flex-col items-center">
                      <Users className="h-10 w-10 opacity-20 mb-3" />
                      <p>No students found.</p>
                    </div>
                 ) : (
                   <div className="divide-y divide-gray-50">
                     {filteredStudents.map((student) => (
                       <div key={student.id} className="p-4 px-6 flex items-center justify-between hover:bg-[#e6f4ea]/30 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#146939] to-[#00954f] flex items-center justify-center text-white font-bold font-montserrat text-sm shadow-sm">
                              {student.full_name.charAt(0)}
                            </div>
                            <div>
                               <p className="font-semibold text-[#17321A] font-montserrat text-sm">{student.full_name}</p>
                               <p className="text-xs text-gray-500 font-roboto">{student.email || 'No email provided'}</p>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#146939] rounded-full h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem className="cursor-pointer font-roboto">View Profile</DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer font-roboto">Message</DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer font-roboto text-red-600 focus:text-red-700 focus:bg-red-50">Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* --- Right Column: Stats & Activity --- */}
        <div className="space-y-6">
           
           {/* Class Performance Card */}
           <Card className="bg-gradient-to-b from-[#146939] to-[#17321A] text-white border-none shadow-xl relative overflow-hidden rounded-2xl">
              {/* Decorative Orbs */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-[#00954f] rounded-full opacity-20 blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-black rounded-full opacity-20 blur-2xl pointer-events-none"></div>
              
              <CardHeader className="relative z-10 pb-2">
                <CardTitle className="font-montserrat text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#00954f]" />
                  Class Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 relative z-10 pt-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-200 text-sm font-roboto">Average Score</span>
                  <span className="text-2xl font-bold font-montserrat">87%</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-200 text-sm font-roboto">Attendance</span>
                  <span className="text-2xl font-bold font-montserrat">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-200 text-sm font-roboto">Pending Grading</span>
                  <span className="text-xl font-bold font-montserrat text-amber-400">12</span>
                </div>
              </CardContent>
           </Card>

           {/* Recent Activity Card */}
           <Card className="border-gray-100 shadow-sm rounded-2xl bg-white">
             <CardHeader className="pb-3 pt-6 px-6">
               <CardTitle className="text-md font-bold text-[#17321A] font-montserrat flex items-center gap-2">
                 <Calendar className="h-4 w-4 text-gray-400" />
                 Recent Activity
               </CardTitle>
             </CardHeader>
             <CardContent className="px-6 pb-6">
               <div className="space-y-0 relative">
                 {/* Timeline Line */}
                 <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-100"></div>

                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex gap-4 relative py-3 group">
                     <div className="h-5 w-5 rounded-full bg-white border-2 border-[#e6f4ea] group-hover:border-[#00954f] shrink-0 z-10 flex items-center justify-center transition-colors">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#00954f]" />
                     </div>
                     <div>
                       <p className="text-[#17321A] font-semibold text-sm font-montserrat group-hover:text-[#00954f] transition-colors">
                         New assignment posted
                       </p>
                       <p className="text-xs text-gray-500 font-roboto mt-0.5">2 hours ago</p>
                     </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </div>

      </div>
    </div>
  )
}