'use client'

import { useState, useEffect } from "react"
import { PlusCircle, X, Loader2, Save } from "lucide-react"
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

interface ClassFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classToEdit?: ClassItem | null
}

export function ClassFormDialog({ open, onOpenChange, classToEdit }: ClassFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()
  const { addToast } = useToast()
  const isEditing = !!classToEdit

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
    const code = formData.get("code") as string

    let error;

    if (isEditing && classToEdit) {
      const result = await supabase
        .from('classes')
        .update({ name, code })
        .eq('id', classToEdit.id)
      error = result.error
    } else {
      const result = await supabase
        .from('classes')
        .insert({ name, code, status: 'active' })
      error = result.error
    }

    setLoading(false)

    if (error) {
      console.error(error)
      addToast("Failed to save class details.", "error")
    } else {
      addToast(isEditing ? "Class updated successfully." : "New class created successfully.", "success")
      onOpenChange(false)
      router.refresh()
    }
  }

  if (!isMounted) return null

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div 
        className={cn(
          "bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-90 translate-y-8 opacity-0"
        )}
      >
        {/* Top Green Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#146939] to-[#00954f]"></div>

        {/* Header */}
        <div className="px-6 pt-8 pb-2 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold font-montserrat text-[#17321A]">
              {isEditing ? "Edit Class" : "Create New Class"}
            </h2>
            <p className="text-sm text-gray-500 font-roboto mt-1">
              {isEditing ? "Update the course details below." : "Enter the details for your new course."}
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
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#17321A] font-bold font-roboto text-sm">Class Name</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={classToEdit?.name}
                placeholder="e.g. Advanced Chemistry" 
                required 
                className="border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] h-11 bg-gray-50/50 rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code" className="text-[#17321A] font-bold font-roboto text-sm">Course Code</Label>
              <Input 
                id="code" 
                name="code" 
                defaultValue={classToEdit?.code}
                placeholder="e.g. CHEM-301" 
                required 
                className="border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] h-11 bg-gray-50/50 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
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
                <PlusCircle className="h-4 w-4 mr-2" />
              )}
              {isEditing ? "Save Changes" : "Create Class"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}