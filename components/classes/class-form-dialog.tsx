'use client'

import { useState, useEffect } from "react"
import { PlusCircle, X, Loader2, Save } from "lucide-react"
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

interface ClassFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classToEdit?: ClassItem | null // If present, we are in Edit mode
}

export function ClassFormDialog({ open, onOpenChange, classToEdit }: ClassFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!classToEdit

  useEffect(() => {
    if (open) {
      setIsMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
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
    const code = formData.get("code") as string

    let error;

    if (isEditing && classToEdit) {
      // Update existing class
      const result = await supabase
        .from('classes')
        .update({ name, code })
        .eq('id', classToEdit.id)
      error = result.error
    } else {
      // Create new class
      const result = await supabase
        .from('classes')
        .insert({ name, code, status: 'active' })
      error = result.error
    }

    setLoading(false)

    if (error) {
      console.error(error)
    } else {
      onOpenChange(false)
      router.refresh()
    }
  }

  if (!isMounted) return null

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div 
        className={cn(
          "bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative transition-all duration-300 ease-out transform",
          isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-[#146939] to-[#17321A] p-6 text-white flex justify-between items-center relative overflow-hidden">
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00954f] rounded-full opacity-20 blur-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-xl font-bold font-montserrat">{isEditing ? "Edit Class" : "Create New Class"}</h2>
            <p className="text-xs text-gray-200 font-roboto mt-1 opacity-80">
              {isEditing ? "Update class details." : "Add a new course to your curriculum."}
            </p>
          </div>
          <button 
            onClick={() => onOpenChange(false)} 
            className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors relative z-10 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#17321A] font-bold font-roboto">Class Name</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={classToEdit?.name}
              placeholder="e.g. Advanced Chemistry" 
              required 
              className="border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] h-11"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="code" className="text-[#17321A] font-bold font-roboto">Course Code</Label>
            <Input 
              id="code" 
              name="code" 
              defaultValue={classToEdit?.code}
              placeholder="e.g. CHEM-301" 
              required 
              className="border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] h-11"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-[#17321A] hover:bg-gray-100 font-montserrat h-11 px-6 cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#146939] hover:bg-[#00954f] text-white font-montserrat min-w-[140px] h-11 shadow-lg hover:shadow-xl transition-all cursor-pointer"
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