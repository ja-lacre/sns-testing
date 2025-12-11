'use client'

import { useState, useEffect, useRef } from "react"
import { X, Upload, Loader2, FileSpreadsheet, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ImportStudentsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportStudentsDialog({ open, onOpenChange }: ImportStudentsDialogProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successCount, setSuccessCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (open) {
      setIsMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)))
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => {
        setIsMounted(false)
        setFile(null)
        setError(null)
        setSuccessCount(0)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const parseCSV = async (text: string) => {
    const lines = text.split('\n')
    const students = []
    
    // Skip header row if present (simple check)
    const startIndex = lines[0].toLowerCase().includes('email') ? 1 : 0

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      // Simple CSV split (handling standard comma separation)
      const parts = line.split(',').map(p => p.trim())
      
      // Expected format: student_id, full_name, email
      if (parts.length >= 2) {
        students.push({
          student_id: parts[0],
          full_name: parts[1],
          email: parts[2] || null
        })
      }
    }
    return students
  }

  const handleImport = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      const text = await file.text()
      const students = await parseCSV(text)

      if (students.length === 0) {
        setError("No valid student records found in file.")
        setLoading(false)
        return
      }

      const { error: uploadError } = await supabase
        .from('students')
        .insert(students)

      if (uploadError) {
        throw uploadError
      }

      setSuccessCount(students.length)
      router.refresh()
      
      // Close after short delay on success
      setTimeout(() => {
        onOpenChange(false)
      }, 1500)

    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to import students.")
    } finally {
      setLoading(false)
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
            <h2 className="text-2xl font-bold font-montserrat text-[#17321A]">Import Students</h2>
            <p className="text-sm text-gray-500 font-roboto mt-1">Bulk add students via CSV file.</p>
          </div>
          <button 
            onClick={() => onOpenChange(false)} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer -mr-2 -mt-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* File Drop Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group",
              file ? "border-[#146939] bg-[#e6f4ea]/30" : "border-gray-200 hover:border-[#146939] hover:bg-gray-50"
            )}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileChange}
            />
            
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center mb-3 transition-colors",
              file ? "bg-[#146939] text-white" : "bg-gray-100 text-gray-400 group-hover:text-[#146939] group-hover:bg-[#e6f4ea]"
            )}>
              {file ? <FileSpreadsheet className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
            </div>
            
            {file ? (
              <div>
                <p className="font-semibold text-[#17321A] text-sm">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-gray-700 text-sm">Click to upload CSV</p>
                <p className="text-xs text-gray-400 mt-1">Format: Student ID, Name, Email</p>
              </div>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2 border border-red-100">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {successCount > 0 && (
            <div className="bg-[#e6f4ea] text-[#146939] text-sm p-3 rounded-xl flex items-center gap-2 border border-[#146939]/20">
              <Check className="h-4 w-4 shrink-0" />
              Successfully imported {successCount} students!
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-[#17321A] hover:bg-gray-100 font-montserrat h-11 px-6 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleImport}
              disabled={loading || !file || successCount > 0}
              className="bg-[#146939] hover:bg-[#00954f] text-white font-montserrat min-w-[120px] h-11 shadow-md hover:shadow-lg transition-all rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              Import
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}