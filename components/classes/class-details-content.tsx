'use client'

import { useState } from "react"
import { ArrowLeft, Users, Search, MoreVertical, FileText, Settings, UserPlus, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ClassFormDialog } from "./class-form-dialog"
import { ManageStudentsDialog } from "./manage-students-dialog"
import { ConfirmActionDialog } from "./confirm-action-dialog"
import { ExamFormDialog } from "@/components/exams/exam-form-dialog"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast-notification"

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
  allStudents: Student[]
}

export function ClassDetailsContent({ classData, students, allStudents }: ClassDetailsContentProps) {
  const [search, setSearch] = useState("")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isManageOpen, setIsManageOpen] = useState(false)
  const [isExamOpen, setIsExamOpen] = useState(false)
  
  const [studentToRemove, setStudentToRemove] = useState<Student | null>(null)

  const supabase = createClient()
  const router = useRouter()
  const { addToast } = useToast()

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleRemoveStudent = async () => {
    if (!studentToRemove) return

    const { error } = await supabase
      .from('enrollments')
      .delete()
      .match({ 
        class_id: classData.id, 
        student_id: studentToRemove.id 
      })

    if (error) {
      console.error("Error removing student:", error)
      addToast("Failed to remove student.", "error")
    } else {
      addToast("Student removed from class successfully.", "success")
      router.refresh()
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 max-w-5xl mx-auto">
      
      {/* Header */}
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
             <Button 
                variant="outline" 
                onClick={() => setIsEditOpen(true)}
                className="border-gray-200 text-gray-700 hover:bg-gray-50 font-montserrat rounded-xl h-11 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
             >
                <Settings className="mr-2 h-4 w-4" /> Class Settings
             </Button>
             
             <Button 
                onClick={() => setIsExamOpen(true)}
                className="bg-[#146939] hover:bg-[#00954f] text-white font-montserrat rounded-xl h-11 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
             >
                <FileText className="mr-2 h-4 w-4" /> Create Exam
             </Button>
          </div>
        </div>
        <div className="h-px w-full bg-gray-200 mt-6"></div>
      </div>

      {/* Student List */}
      <div className="space-y-6">
        <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50 pt-6 px-6">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-[#e6f4ea] rounded-full text-[#146939]">
                    <Users className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-lg font-bold text-[#17321A] font-montserrat">
                        Enrolled Students
                    </CardTitle>
                    <p className="text-xs text-gray-500 font-roboto mt-0.5">
                        Manage student access and details
                    </p>
                </div>
             </div>
             
             <div className="flex items-center gap-3 w-full sm:w-auto">
               <div className="relative flex-1 sm:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <Input 
                   placeholder="Search students..." 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="pl-9 h-10 bg-gray-50 border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] rounded-xl" 
                 />
               </div>
               <Button 
                 onClick={() => setIsManageOpen(true)}
                 className="bg-[#146939] hover:bg-[#00954f] text-white rounded-xl h-10 px-4 font-montserrat text-xs shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer whitespace-nowrap"
               >
                 <UserPlus className="h-4 w-4 sm:mr-2" /> 
                 <span className="hidden sm:inline">Add Student</span>
               </Button>
             </div>
          </CardHeader>

          <CardContent className="p-0">
             <div className="min-h-[300px]">
               {filteredStudents.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 font-roboto flex flex-col items-center justify-center h-64">
                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 opacity-20 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-600">No students found</p>
                    <p className="text-sm text-gray-400 mt-1">Try searching for a different name or add a new student.</p>
                    <Button variant="link" onClick={() => setIsManageOpen(true)} className="text-[#146939] mt-2 font-montserrat">
                        Enroll students now
                    </Button>
                  </div>
               ) : (
                 <div className="divide-y divide-gray-50">
                   {filteredStudents.map((student) => (
                     <div key={student.id} className="p-4 px-6 flex items-center justify-between hover:bg-[#e6f4ea]/30 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#146939] to-[#00954f] flex items-center justify-center text-white font-bold font-montserrat text-sm shadow-sm ring-2 ring-white">
                            {student.full_name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-semibold text-[#17321A] font-montserrat text-sm">{student.full_name}</p>
                             <p className="text-xs text-gray-500 font-roboto">{student.email || 'No email provided'}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#146939] hover:bg-[#e6f4ea] rounded-lg h-8 w-8 p-0 transition-all cursor-pointer">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-lg p-1">
                            <DropdownMenuItem 
                                onClick={() => setStudentToRemove(student)}
                                className="cursor-pointer font-roboto text-red-600 focus:text-red-700 focus:bg-red-50 rounded-lg m-1"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Remove from Class
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          </CardContent>
          
          <div className="bg-gray-50/50 p-3 border-t border-gray-100 text-center text-xs text-gray-400 font-roboto">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </Card>
      </div>

      {/* Dialogs */}
      <ClassFormDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        classToEdit={classData}
      />

      <ManageStudentsDialog
        open={isManageOpen}
        onOpenChange={setIsManageOpen}
        classId={classData.id}
        className={classData.name}
        allStudents={allStudents}
      />

      <ExamFormDialog
        open={isExamOpen}
        onOpenChange={setIsExamOpen}
        availableClasses={[{ id: classData.id, name: classData.name, code: classData.code }]} 
        defaultClassCode={classData.code}
      />

      <ConfirmActionDialog 
        open={!!studentToRemove}
        onOpenChange={(open) => !open && setStudentToRemove(null)}
        title="Remove Student"
        description={`Are you sure you want to remove ${studentToRemove?.full_name} from ${classData.name}?`}
        actionLabel="Remove"
        variant="danger"
        onConfirm={handleRemoveStudent}
      />
    </div>
  )
}