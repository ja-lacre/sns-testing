'use client'

import { Calendar, Clock, FileText, CheckCircle, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ExamsList({ exams }: { exams: any[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {exams.map((exam) => (
        <Card key={exam.id} className="group border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 overflow-hidden">
          <div className={`h-1 w-full ${
            exam.status === 'Published' ? 'bg-[#00954f]' : 
            exam.status === 'Draft' ? 'bg-gray-300' : 'bg-blue-500'
          }`} />
          
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500">
                {exam.class_code}
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-gray-400">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="text-lg font-bold text-[#17321A] font-montserrat mt-2">
              {exam.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 pb-3">
            <div className="flex items-center text-sm text-gray-600 font-roboto">
              <Calendar className="mr-2 h-4 w-4 text-[#146939]" />
              {new Date(exam.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
            <div className="flex items-center text-sm text-gray-600 font-roboto">
              <Clock className="mr-2 h-4 w-4 text-[#146939]" />
              {/* Mock Time for now */}
              10:00 AM - 11:30 AM
            </div>
          </CardContent>

          <CardFooter className="pt-3 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center">
             <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
                exam.status === 'Published' ? 'text-[#00954f] bg-[#e6f4ea]' : 
                exam.status === 'Draft' ? 'text-gray-600 bg-gray-200' : 'text-blue-600 bg-blue-50'
             }`}>
               {exam.status === 'Published' && <CheckCircle className="h-3 w-3" />}
               {exam.status}
             </span>
             <Button variant="ghost" className="text-[#146939] hover:text-[#00954f] font-montserrat text-xs font-bold">
               Manage
             </Button>
          </CardFooter>
        </Card>
      ))}
      
      {/* Create New Exam Card */}
      <button className="flex flex-col items-center justify-center gap-3 min-h-[200px] rounded-xl border-2 border-dashed border-gray-200 hover:border-[#00954f] hover:bg-[#e6f4ea]/30 transition-all group text-gray-400 hover:text-[#00954f] cursor-pointer">
        <div className="p-3 rounded-full bg-gray-50 group-hover:bg-[#e6f4ea] transition-colors">
          <FileText className="h-6 w-6" />
        </div>
        <span className="font-bold font-montserrat">Create New Exam</span>
      </button>
    </div>
  )
}