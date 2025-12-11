'use client'

import { useState, useEffect } from "react"
import { X, Loader2, Save, FileText, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormSelect, FormDatePicker } from "@/components/ui/form-components"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast-notification"

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
  total_score?: number // Added field
}

interface ExamFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableClasses: ClassItem[]
  examToEdit?: ExamItem | null
  defaultClassCode?: string
}

export function ExamFormDialog({ open, onOpenChange, availableClasses, examToEdit, defaultClassCode }: ExamFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()
  const { addToast } = useToast()
  const isEditing = !!examToEdit

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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const classCode = formData.get("classCode") as string
    const date = formData.get("date") as string
    const totalScore = parseInt(formData.get("totalScore") as string) || 100 // Get total score

    // Find the Class ID based on the selected code
    const selectedClass = availableClasses.find(c => c.code === classCode)
    
    const examData = {
      name,
      class_code: classCode, 
      class_id: selectedClass?.id, 
      date,
      total_score: totalScore // Save total score
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
      addToast("Failed to save exam details.", "error")
    } else {
      addToast(isEditing ? "Exam updated successfully." : "Exam created successfully.", "success")
      onOpenChange(false)
      router.refresh()
    }
  }

  if (!isMounted) return null

  const classOptions = availableClasses.map(cls => ({
    label: `${cls.name} (${cls.code})`,
    value: cls.code
  }))

  return (
    <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0"
    )}>
      <div className={cn(
          "bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform",
          isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-90 translate-y-8 opacity-0"
      )}>
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#146939] to-[#00954f]"></div>

        <div className="px-6 pt-8 pb-2 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold font-montserrat text-[#17321A]">
              {isEditing ? "Edit Exam" : "Create New Exam"}
            </h2>
            <p className="text-sm text-gray-500 font-roboto mt-1">
              {isEditing ? "Update exam details below." : "Schedule a new assessment."}
            </p>
          </div>
          <button 
            onClick={() => onOpenChange(false)} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer -mr-2 -mt-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

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
                  className="pl-9 border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] bg-gray-50/50 rounded-xl h-11 font-roboto"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classCode" className="text-[#17321A] font-bold font-roboto text-sm">Assign to Class</Label>
              <FormSelect 
                id="classCode"
                name="classCode"
                defaultValue={examToEdit?.class_code || defaultClassCode || ""}
                required
                options={classOptions}
                placeholder="Select a class"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-[#17321A] font-bold font-roboto text-sm">Date</Label>
                <FormDatePicker 
                  id="date"
                  name="date"
                  defaultValue={examToEdit?.date}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalScore" className="text-[#17321A] font-bold font-roboto text-sm">Total Score</Label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="totalScore" 
                    name="totalScore" 
                    type="number"
                    min="1"
                    defaultValue={examToEdit?.total_score || 100}
                    placeholder="100" 
                    required 
                    className="pl-9 border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] bg-gray-50/50 rounded-xl h-11 font-roboto"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-50 mt-2">
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
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {isEditing ? "Save Changes" : "Create Exam"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}