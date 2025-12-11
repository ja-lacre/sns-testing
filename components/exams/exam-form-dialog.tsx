'use client'

import { useState, useEffect } from "react"
import { X, Loader2, Save, FileText, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ClassItem {
  id: string
  name: string
  code: string
}

interface ExamItem {
  id: string
  name: string
  class_code: string
  date: string
  status: string
}

interface ExamFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableClasses: ClassItem[]
  examToEdit?: ExamItem | null
}

export function ExamFormDialog({ open, onOpenChange, availableClasses, examToEdit }: ExamFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!examToEdit

  useEffect(() => {
    if (open) {
      setIsMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true))
      })
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => setIsMounted(false), 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const classCode = formData.get("classCode") as string
    const date = formData.get("date") as string
    const status = formData.get("status") as string

    const examData = {
      name,
      class_code: classCode,
      date,
      status
    }

    let error

    if (isEditing && examToEdit) {
      const { error: updateError } = await supabase
        .from('exams')
        .update(examData)
        .eq('id', examToEdit.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('exams')
        .insert(examData)
      error = insertError
    }

    setLoading(false)

    if (error) {
      console.error("Error saving exam:", error)
    } else {
      onOpenChange(false)
      router.refresh()
    }
  }

  if (!isMounted) return null

  return (
    <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0"
    )}>
      <div className={cn(
          "bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-300 ease-out transform",
          isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
      )}>
        
        {/* Top Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#146939] to-[#00954f]"></div>

        {/* Header */}
        <div className="px-6 pt-8 pb-2 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold font-montserrat text-[#17321A]">
              {isEditing ? "Edit Exam" : "Create New Exam"}
            </h2>
            <p className="text-sm text-gray-500 font-roboto mt-1">
              {isEditing ? "Update exam details below." : "Schedule a new assessment for your class."}
            </p>
          </div>
          <button 
            onClick={() => onOpenChange(false)} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer -mr-2 -mt-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#17321A] font-bold font-roboto text-sm">Exam Name</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={examToEdit?.name}
                  placeholder="e.g. Midterm Physics" 
                  required 
                  className="pl-9 border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] bg-gray-50/50 rounded-xl h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classCode" className="text-[#17321A] font-bold font-roboto text-sm">Assign to Class</Label>
              <div className="relative">
                <select 
                  id="classCode" 
                  name="classCode" 
                  defaultValue={examToEdit?.class_code || ""}
                  required
                  className="w-full pl-3 pr-10 py-2 text-sm border border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] bg-gray-50/50 rounded-xl h-11 appearance-none cursor-pointer text-gray-700 outline-none"
                >
                  <option value="" disabled>Select a class</option>
                  {availableClasses.map((cls) => (
                    <option key={cls.id} value={cls.code}>
                      {cls.name} ({cls.code})
                    </option>
                  ))}
                </select>
                {/* Custom chevron if desired, or rely on browser default/custom style */}
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-[#17321A] font-bold font-roboto text-sm">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="date" 
                    name="date" 
                    type="date"
                    defaultValue={examToEdit?.date}
                    required 
                    className="pl-9 border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] bg-gray-50/50 rounded-xl h-11 w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[#17321A] font-bold font-roboto text-sm">Status</Label>
                <div className="relative">
                  <select 
                    id="status" 
                    name="status" 
                    defaultValue={examToEdit?.status || "Draft"}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] bg-gray-50/50 rounded-xl h-11 appearance-none cursor-pointer text-gray-700 outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Published">Published</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-gray-50 mt-2">
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
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEditing ? "Save Changes" : "Create Exam"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}