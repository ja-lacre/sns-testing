'use client'

import { useState, useEffect } from "react"
import { X, Search, UserCircle, Check, Loader2, MinusCircle, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

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
}

export function ManageStudentsDialog({ open, onOpenChange, classId, className, allStudents }: ManageStudentsDialogProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [search, setSearch] = useState("")
  const [enrolledStudentIds, setEnrolledStudentIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (open) {
      setIsMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true))
      })
      fetchEnrollments()
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => setIsMounted(false), 300)
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
      // Unenroll
      await supabase
        .from('enrollments')
        .delete()
        .match({ class_id: classId, student_id: studentId })
      
      const newSet = new Set(enrolledStudentIds)
      newSet.delete(studentId)
      setEnrolledStudentIds(newSet)
    } else {
      // Enroll
      await supabase
        .from('enrollments')
        .insert({ class_id: classId, student_id: studentId })
      
      const newSet = new Set(enrolledStudentIds)
      newSet.add(studentId)
      setEnrolledStudentIds(newSet)
    }
    
    setProcessingId(null)
    router.refresh()
  }

  const filteredStudents = allStudents.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (!isMounted) return null

  return (
    <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0"
    )}>
      <div className={cn(
          "bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden relative transition-all duration-300 ease-out transform h-[80vh] flex flex-col",
          isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
      )}>
        
        {/* Header */}
        <div className="bg-gradient-to-b from-[#146939] to-[#17321A] p-6 text-white flex justify-between items-center relative shrink-0">
          <div className="relative z-10">
            <h2 className="text-xl font-bold font-montserrat">Manage Students</h2>
            <p className="text-xs text-gray-200 font-roboto mt-1 opacity-80">
              Enrolling students for <span className="font-bold text-white">{className}</span>
            </p>
          </div>
          <button 
            onClick={() => onOpenChange(false)} 
            className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors relative z-10 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search students..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-gray-200 focus:border-[#00954f] focus:ring-[#00954f]"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
             <div className="flex justify-center items-center h-full text-[#146939]">
               <Loader2 className="h-8 w-8 animate-spin" />
             </div>
          ) : filteredStudents.length === 0 ? (
             <div className="text-center text-gray-500 py-10">No students found.</div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map(student => {
                const isEnrolled = enrolledStudentIds.has(student.id)
                const isProcessing = processingId === student.id

                return (
                  <div key={student.id} className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
                    isEnrolled ? "bg-[#e6f4ea] border-[#00954f]/30" : "bg-white border-gray-100 hover:border-gray-300"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center font-bold font-montserrat transition-colors",
                        isEnrolled ? "bg-[#146939] text-white" : "bg-gray-100 text-gray-500"
                      )}>
                        {student.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className={cn("font-semibold font-montserrat", isEnrolled ? "text-[#17321A]" : "text-gray-700")}>
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
                        "min-w-[100px] transition-all cursor-pointer font-montserrat text-xs",
                        isEnrolled 
                          ? "border-[#146939] text-[#146939] hover:bg-red-50 hover:text-red-600 hover:border-red-200" 
                          : "bg-[#146939] hover:bg-[#00954f] text-white"
                      )}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : isEnrolled ? (
                         <>
                           <Check className="h-3 w-3 mr-1" /> Enrolled
                         </>
                      ) : (
                         <>
                           <PlusCircle className="h-3 w-3 mr-1" /> Enroll
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