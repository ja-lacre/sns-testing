'use client'

import { useState } from "react"
import { Calendar, Clock, FileText, CheckCircle, MoreVertical, PlusCircle, Edit, Trash2, Archive } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ExamFormDialog } from "./exam-form-dialog"
import { ConfirmActionDialog } from "@/components/classes/confirm-action-dialog"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ExamItem {
  id: string
  name: string
  class_code: string
  date: string
  status: string
}

interface ClassItem {
  id: string
  name: string
  code: string
}

interface ExamsPageContentProps {
  exams: ExamItem[]
  availableClasses: ClassItem[]
}

export function ExamsPageContent({ exams, availableClasses }: ExamsPageContentProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [examToEdit, setExamToEdit] = useState<ExamItem | null>(null)
  const [examToDelete, setExamToDelete] = useState<ExamItem | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const handleDeleteExam = async () => {
    if (!examToDelete) return

    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', examToDelete.id)

    if (error) {
      console.error("Error deleting exam:", error)
    } else {
      router.refresh()
    }
  }

  const handleEditClick = (exam: ExamItem) => {
    setExamToEdit(exam)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#17321A] font-montserrat tracking-tight">
            Exams
          </h1>
          <p className="text-gray-500 font-roboto mt-3 text-lg">
            Create and schedule assessments for your classes.
          </p>
        </div>
        
        <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-[#146939] hover:bg-[#00954f] text-white font-montserrat shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-12 px-6 rounded-xl flex items-center gap-2 cursor-pointer"
        >
            <PlusCircle className="h-5 w-5" />
            Create Exam
        </Button>
      </div>

      {/* --- Exams Grid --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <Card 
            key={exam.id} 
            className="group relative border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ease-out bg-white overflow-hidden hover:-translate-y-2 rounded-2xl"
          >
            {/* Top Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#146939] to-[#00954f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardHeader className="flex flex-row items-start justify-between pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#e6f4ea] text-[#146939] border border-[#146939]/10">
                  {exam.class_code}
                </span>
                <CardTitle className="text-xl font-bold text-[#17321A] font-montserrat mt-2 line-clamp-1" title={exam.name}>
                  {exam.name}
                </CardTitle>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-[#17321A] hover:bg-[#e6f4ea] rounded-lg transition-colors cursor-pointer">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-lg p-1">
                  <DropdownMenuItem 
                    onClick={() => handleEditClick(exam)}
                    className="cursor-pointer font-roboto text-gray-600 focus:text-[#146939] focus:bg-[#e6f4ea] rounded-lg"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit Exam
                  </DropdownMenuItem>
                  <div className="h-px bg-gray-50 my-1"></div>
                  <DropdownMenuItem 
                    onClick={() => setExamToDelete(exam)}
                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 font-roboto rounded-lg"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent className="space-y-3 pb-3">
              <div className="flex items-center text-sm text-gray-600 font-roboto">
                <Calendar className="mr-2 h-4 w-4 text-[#146939]" />
                {new Date(exam.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              {/* Optional Time Placeholder if you add time column later */}
              <div className="flex items-center text-sm text-gray-400 font-roboto">
                <Clock className="mr-2 h-4 w-4 opacity-50" />
                <span>Time TBD</span>
              </div>
            </CardContent>

            <CardFooter className="pt-4 border-t border-gray-50 mt-4 bg-gray-50/30 flex justify-between items-center">
               <span className={cn(
                 "text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5",
                 exam.status === 'Published' 
                   ? "text-[#146939] bg-[#e6f4ea]" 
                   : exam.status === 'Draft' 
                     ? "text-gray-600 bg-gray-200" 
                     : "text-blue-600 bg-blue-50"
               )}>
                 {exam.status === 'Published' && <CheckCircle className="h-3 w-3" />}
                 {exam.status}
               </span>
               
               <Button 
                 variant="ghost" 
                 onClick={() => handleEditClick(exam)}
                 className="text-[#146939] hover:text-[#00954f] hover:bg-[#e6f4ea] font-montserrat text-xs font-bold rounded-xl h-8 px-3 transition-all cursor-pointer"
               >
                 Manage
               </Button>
            </CardFooter>
          </Card>
        ))}
        
        {/* Create New Exam Card */}
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex flex-col items-center justify-center gap-4 min-h-[220px] rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#00954f] hover:bg-[#e6f4ea]/30 transition-all duration-300 group cursor-pointer text-gray-400 hover:text-[#00954f]"
        >
          <div className="p-4 rounded-full bg-gray-50 group-hover:bg-[#e6f4ea] transition-colors">
            <FileText className="h-8 w-8 text-gray-300 group-hover:text-[#00954f] transition-colors" />
          </div>
          <div className="text-center">
            <span className="block font-bold font-montserrat text-lg">Create New Exam</span>
            <span className="text-sm font-roboto opacity-70">Schedule a new assessment</span>
          </div>
        </button>
      </div>

      {/* --- Dialogs --- */}
      
      <ExamFormDialog 
        open={isCreateOpen || !!examToEdit} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setExamToEdit(null)
          }
        }}
        availableClasses={availableClasses}
        examToEdit={examToEdit}
      />

      <ConfirmActionDialog
        open={!!examToDelete}
        onOpenChange={(open) => !open && setExamToDelete(null)}
        title="Delete Exam"
        description={`Are you sure you want to delete "${examToDelete?.name}"? This action cannot be undone and will remove all associated results.`}
        actionLabel="Delete Exam"
        variant="danger"
        onConfirm={handleDeleteExam}
      />
    </div>
  )
}