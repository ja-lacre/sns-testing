'use client'

import { useState, useEffect } from "react"
import { X, Search, Check, Loader2, PlusCircle, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast-notification"

interface Student {
  id: string
  full_name: string
  email: string
}

interface ManageStudentsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classId: string
  className: string
  allStudents: Student[]
  title?: string
  actionLabel?: string
  onDataChange?: () => void // New Prop
}

export function ManageStudentsDialog({ 
  open, 
  onOpenChange, 
  classId, 
  className, 
  allStudents,
  title = "Manage Students",
  actionLabel = "Enroll",
  onDataChange
}: ManageStudentsDialogProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [search, setSearch] = useState("")
  const [enrolledStudentIds, setEnrolledStudentIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()
  const { addToast } = useToast()

  useEffect(() => {
    if (open) {
      setIsMounted(true)
      fetchEnrollments()
      requestAnimationFrame(() => setIsVisible(true))
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => setIsMounted(false), 500)
      return () => clearTimeout(timer)
    }
  }, [open, classId])

  const fetchEnrollments = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('enrollments')
      .select('student_id')
      .eq('class_id', classId)
    
    if (data) {
      setEnrolledStudentIds(new Set(data.map(e => e.student_id)))
    }
    setLoading(false)
  }

  const toggleEnrollment = async (studentId: string) => {
    setProcessingId(studentId)
    const isEnrolled = enrolledStudentIds.has(studentId)

    if (isEnrolled) {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .match({ class_id: classId, student_id: studentId })
      
      if (!error) {
        const newSet = new Set(enrolledStudentIds)
        newSet.delete(studentId)
        setEnrolledStudentIds(newSet)
        addToast("Student removed from class.", "info")
      }
    } else {
      const { error } = await supabase
        .from('enrollments')
        .insert({ class_id: classId, student_id: studentId })
      
      if (!error) {
        const newSet = new Set(enrolledStudentIds)
        newSet.add(studentId)
        setEnrolledStudentIds(newSet)
        addToast("Student enrolled successfully.", "success")
      }
    }
    
    setProcessingId(null)
    router.refresh()
    if (onDataChange) onDataChange() // Trigger parent update
  }

  const filteredStudents = allStudents.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (!isMounted) return null

  return (
    <div className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0"
    )}>
      <div className={cn(
          "bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform h-[80vh] flex flex-col",
          isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-90 translate-y-8 opacity-0"
      )}>
        {/* Top Green Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#146939] to-[#00954f]"></div>

        {/* Header */}
        <div className="px-6 pt-8 pb-4 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-2xl font-bold font-montserrat text-[#17321A]">
              {title}
            </h2>
            <p className="text-sm text-gray-500 font-roboto mt-1">
              Select students to add to <span className="font-semibold text-[#146939]">{className}</span>
            </p>
          </div>
          <button 
            onClick={() => onOpenChange(false)} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] bg-gray-50/50 h-11 rounded-xl"
            />
          </div>
        </div>

        {/* Student List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
          {loading ? (
             <div className="flex flex-col justify-center items-center h-full text-gray-400 gap-2">
               <Loader2 className="h-8 w-8 animate-spin text-[#146939]" />
               <span className="text-sm font-roboto">Loading students...</span>
             </div>
          ) : filteredStudents.length === 0 ? (
             <div className="flex flex-col justify-center items-center h-full text-gray-400 gap-2">
                <UserCircle className="h-10 w-10 opacity-20" />
                <span className="text-sm font-roboto">No students found.</span>
             </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map(student => {
                const isEnrolled = enrolledStudentIds.has(student.id)
                const isProcessing = processingId === student.id

                return (
                  <div key={student.id} className={cn(
                    "flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group",
                    isEnrolled 
                      ? "bg-[#e6f4ea]/50 border-[#00954f]/20" 
                      : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center font-bold font-montserrat text-sm transition-colors",
                        isEnrolled 
                          ? "bg-[#146939] text-white" 
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      )}>
                        {student.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className={cn(
                          "font-semibold font-montserrat text-sm", 
                          isEnrolled ? "text-[#17321A]" : "text-gray-700"
                        )}>
                          {student.full_name}
                        </p>
                        <p className="text-xs text-gray-500 font-roboto">{student.email}</p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isEnrolled ? "outline" : "default"}
                      disabled={isProcessing}
                      onClick={() => toggleEnrollment(student.id)}
                      className={cn(
                        "min-w-[105px] h-9 transition-all cursor-pointer font-montserrat text-xs font-semibold rounded-lg shadow-sm",
                        isEnrolled 
                          ? "border-[#146939]/30 text-[#146939] hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:shadow-none" 
                          : "bg-[#146939] hover:bg-[#00954f] text-white hover:shadow-md hover:-translate-y-0.5"
                      )}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : isEnrolled ? (
                         <>
                           <Check className="h-3 w-3 mr-1.5" /> Added
                         </>
                      ) : (
                         <>
                           <PlusCircle className="h-3 w-3 mr-1.5" /> {actionLabel}
                         </>
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}