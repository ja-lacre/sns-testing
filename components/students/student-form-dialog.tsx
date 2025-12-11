'use client'

import { useState, useEffect } from "react"
import { X, UserPlus, Loader2, Save, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast-notification"

interface ClassItem {
  id: string
  name: string
  code: string
}

interface Student {
  id: string
  student_id: string | null
  full_name: string
  email: string | null
}

interface StudentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableClasses: ClassItem[]
  studentToEdit?: Student | null
}

export function StudentFormDialog({ open, onOpenChange, availableClasses, studentToEdit }: StudentFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set())
  
  const router = useRouter()
  const supabase = createClient()
  const { addToast } = useToast()
  const isEditing = !!studentToEdit

  useEffect(() => {
    if (open) {
      setIsMounted(true)
      requestAnimationFrame(() => setIsVisible(true))
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => setIsMounted(false), 500)
      return () => clearTimeout(timer)
    }
  }, [open])

  const toggleClass = (classId: string) => {
    const newSet = new Set(selectedClasses)
    if (newSet.has(classId)) {
      newSet.delete(classId)
    } else {
      newSet.add(classId)
    }
    setSelectedClasses(newSet)
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const studentId = formData.get("studentId") as string

    if (isEditing && studentToEdit) {
      // --- Update Logic ---
      const { error } = await supabase
        .from('students')
        .update({ 
          full_name: fullName, 
          email: email,
          student_id: studentId
        })
        .eq('id', studentToEdit.id)

      if (error) {
        console.error("Error updating student:", error)
        addToast("Failed to update student profile.", "error")
      } else {
        addToast("Student profile updated successfully.", "success")
        onOpenChange(false)
        router.refresh()
      }
      setLoading(false)

    } else {
      // --- Create Logic ---
      // 1. Create Student
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({ 
          full_name: fullName, 
          email: email,
          student_id: studentId
        })
        .select()
        .single()

      if (studentError) {
        console.error("Error creating student:", studentError)
        addToast("Failed to add student.", "error")
        setLoading(false)
        return
      }

      // 2. Handle Enrollments (If student created successfully)
      if (selectedClasses.size > 0 && student) {
        const enrollments = Array.from(selectedClasses).map(classId => ({
          student_id: student.id,
          class_id: classId
        }))
        
        const { error: enrollError } = await supabase.from('enrollments').insert(enrollments)
        
        if (enrollError) {
            console.error("Error enrolling student:", enrollError)
            addToast("Student added, but enrollment failed.", "error")
        } else {
            addToast("New student added and enrolled successfully.", "success")
        }
      } else {
        addToast("New student added successfully.", "success")
      }

      setLoading(false)
      onOpenChange(false)
      setSelectedClasses(new Set())
      router.refresh()
    }
  }

  if (!isMounted) return null

  return (
    <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0"
    )}>
      <div className={cn(
          "bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform flex flex-col max-h-[90vh]",
          isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-90 translate-y-8 opacity-0"
      )}>
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#146939] to-[#00954f]"></div>

        <div className="px-6 pt-8 pb-2 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-2xl font-bold font-montserrat text-[#17321A]">
              {isEditing ? "Edit Student Profile" : "Add New Student"}
            </h2>
            <p className="text-sm text-gray-500 font-roboto mt-1">
              {isEditing ? "Update student information below." : "Enter details and enroll in classes."}
            </p>
          </div>
          <button 
            onClick={() => onOpenChange(false)} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-[#17321A] font-bold font-roboto text-sm">Student ID</Label>
                  <Input 
                    id="studentId" 
                    name="studentId" 
                    defaultValue={studentToEdit?.student_id || ""}
                    placeholder="e.g. 2024-001" 
                    required 
                    className="border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] bg-gray-50/50 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[#17321A] font-bold font-roboto text-sm">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    defaultValue={studentToEdit?.full_name || ""}
                    placeholder="e.g. John Doe" 
                    required 
                    className="border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] bg-gray-50/50 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#17321A] font-bold font-roboto text-sm">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  defaultValue={studentToEdit?.email || ""}
                  placeholder="student@school.edu" 
                  className="border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] bg-gray-50/50 rounded-xl"
                />
              </div>
            </div>

            {!isEditing && (
              <div className="space-y-3 pt-2">
                <Label className="text-[#17321A] font-bold font-roboto text-sm">Enroll in Classes (Optional)</Label>
                <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/30 max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
                  {availableClasses.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-2">No active classes found.</p>
                  ) : (
                    availableClasses.map((cls) => {
                      const isSelected = selectedClasses.has(cls.id)
                      return (
                        <div 
                          key={cls.id} 
                          onClick={() => toggleClass(cls.id)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                            isSelected 
                              ? "bg-[#e6f4ea] border-[#00954f]/30" 
                              : "bg-white border-gray-100 hover:border-gray-300"
                          )}
                        >
                          <div>
                            <p className={cn("text-sm font-semibold", isSelected ? "text-[#146939]" : "text-gray-700")}>
                              {cls.name}
                            </p>
                            <p className="text-xs text-gray-500">{cls.code}</p>
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-[#146939]" />}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 pt-2 border-t border-gray-50 bg-gray-50/30 flex justify-end gap-3 shrink-0">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-[#17321A] hover:bg-gray-100 font-montserrat h-11 px-6 cursor-pointer rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#146939] hover:bg-[#00954f] text-white font-montserrat min-w-[140px] h-11 shadow-md hover:shadow-lg transition-all cursor-pointer rounded-xl"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : isEditing ? (
                <Save className="h-4 w-4 mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              {isEditing ? "Save Changes" : "Add Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}