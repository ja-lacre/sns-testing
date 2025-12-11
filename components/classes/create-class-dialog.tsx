'use client'

import { useState } from "react"
import { PlusCircle, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export function CreateClassDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const code = formData.get("code") as string

    // Insert into Supabase
    const { error } = await supabase
      .from('classes')
      .insert({ name, code, status: 'active' })

    setLoading(false)

    if (error) {
      console.error(error)
      // You could add toast error handling here
    } else {
      onOpenChange(false) // Close modal
      router.refresh() // Refresh server data
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200 relative">
        
        {/* Header */}
        <div className="bg-[#17321A] p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold font-montserrat">Create New Class</h2>
            <p className="text-xs text-gray-300 font-roboto mt-1">Add a new course to your curriculum.</p>
          </div>
          <button onClick={() => onOpenChange(false)} className="text-white/70 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#17321A] font-bold font-roboto">Class Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="e.g. Advanced Chemistry" 
              required 
              className="border-gray-200 focus:border-[#00954f] focus:ring-[#00954f]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="code" className="text-[#17321A] font-bold font-roboto">Course Code</Label>
            <Input 
              id="code" 
              name="code" 
              placeholder="e.g. CHEM-301" 
              required 
              className="border-gray-200 focus:border-[#00954f] focus:ring-[#00954f]"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-[#17321A] hover:bg-gray-100 font-montserrat"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#146939] hover:bg-[#00954f] text-white font-montserrat min-w-[120px]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />}
              Create Class
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}