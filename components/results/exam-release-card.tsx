'use client'

import { useState } from "react"
import { Calendar, Users, CheckCircle, Loader2, Zap, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Exam {
  id: string
  name: string
  class_code: string
  date: string
  release_status: 'draft' | 'released'
  auto_release: boolean
  student_count: number
}

interface ExamReleaseCardProps {
  exam: Exam
  disabled?: boolean
}

export function ExamReleaseCard({ exam, disabled = false }: ExamReleaseCardProps) {
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [loadingToggle, setLoadingToggle] = useState(false)
  
  // Local state for immediate UI feedback before server refresh
  const [autoReleaseState, setAutoReleaseState] = useState(exam.auto_release)
  
  const supabase = createClient()
  const router = useRouter()
  const isReleased = exam.release_status === 'released'

  const handleToggleAutoRelease = async () => {
    if (disabled || isReleased) return;
    setLoadingToggle(true)
    const newState = !autoReleaseState
    setAutoReleaseState(newState) // Optimistic update

    const { error } = await supabase
      .from('exams')
      .update({ auto_release: newState })
      .eq('id', exam.id)

    if (error) {
      console.error("Error updating auto-release:", error)
      setAutoReleaseState(!newState) // Revert on error
    } else {
      router.refresh()
    }
    setLoadingToggle(false)
  }

  const handleReleaseNow = async () => {
    if (disabled || isReleased) return;
    if (!confirm(`Are you sure you want to release scores for "${exam.name}" to ${exam.student_count} students? Emails will be sent immediately.`)) return;

    setLoadingBtn(true)
    
    // 1. Update status in DB
    const { error } = await supabase
      .from('exams')
      .update({ 
        release_status: 'released',
        auto_release: false // Disable auto-release once manually released
      })
      .eq('id', exam.id)

    if (error) {
      console.error("Error releasing results:", error)
      // Add toast notification here if you have one
    } else {
      router.refresh()
    }
    setLoadingBtn(false)
  }

  return (
    <Card className={cn(
      "group relative border shadow-sm transition-all duration-300 ease-out bg-white overflow-hidden rounded-2xl flex flex-col justify-between",
      disabled ? "border-gray-100 bg-gray-50/50" : "border-gray-100 hover:shadow-xl hover:-translate-y-2"
    )}>
      {/* Top Gradient Line (Green if active, Gray if disabled) */}
      <div className={cn(
        "absolute top-0 left-0 w-full h-1.5 transition-opacity duration-300",
        disabled ? "bg-gray-200" : "bg-gradient-to-r from-[#146939] to-[#00954f] opacity-0 group-hover:opacity-100"
      )}></div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <div>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#e6f4ea] text-[#146939] border border-[#146939]/10">
                {exam.class_code}
                </span>
                <CardTitle className="text-xl font-bold text-[#17321A] font-montserrat mt-2 line-clamp-1" title={exam.name}>
                {exam.name}
                </CardTitle>
            </div>
            {isReleased && (
                <span className="text-[#146939] bg-[#e6f4ea] p-1 rounded-full">
                    <CheckCircle className="h-5 w-5" />
                </span>
            )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4 flex-grow">
        <div className="flex items-center text-sm text-gray-600 font-roboto">
          <Calendar className="mr-2 h-4 w-4 text-[#146939]" />
          {new Date(exam.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
        <div className="flex items-center text-sm font-roboto font-medium">
          <Users className="mr-2 h-4 w-4 text-[#146939]" />
          <span>{exam.student_count} {exam.student_count === 1 ? "Student" : "Students"} graded</span>
        </div>
      </CardContent>

      <CardFooter className={cn(
        "pt-4 pb-4 border-t border-gray-50 bg-gray-50/50 flex flex-col gap-4",
        isReleased ? "opacity-80" : ""
      )}>
         
         {/* Auto-Release Toggle Section */}
         {!isReleased && (
           <div className="flex items-center justify-between w-full rounded-xl bg-white border border-gray-100 p-3 shadow-sm">
             <div className="flex items-center gap-2">
               <Zap className={cn("h-4 w-4", autoReleaseState ? "text-amber-500" : "text-gray-400")} />
               <label htmlFor={`auto-toggle-${exam.id}`} className="text-sm font-bold font-montserrat text-[#17321A] cursor-pointer">
                 Auto-release
               </label>
             </div>
             
             {/* Custom Switch Implementation */}
             <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                <input 
                    type="checkbox" 
                    name={`auto-toggle-${exam.id}`} 
                    id={`auto-toggle-${exam.id}`} 
                    checked={autoReleaseState} 
                    onChange={handleToggleAutoRelease}
                    disabled={loadingToggle || disabled}
                    className={cn("absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out top-0.5 left-0.5", 
                        loadingToggle ? "opacity-50" : "",
                        autoReleaseState ? "border-[#146939] translate-x-4" : "border-gray-300"
                    )}
                />
                <label 
                    htmlFor={`auto-toggle-${exam.id}`} 
                    className={cn("block overflow-hidden h-6 rounded-full cursor-pointer transition-all duration-300",
                        autoReleaseState ? "bg-[#146939]" : "bg-gray-300"
                    )}
                ></label>
            </div>

           </div>
         )}

         {/* Main Action Button */}
         <Button 
           onClick={handleReleaseNow}
           disabled={disabled || isReleased || loadingBtn}
           className={cn(
             "w-full font-montserrat h-11 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm font-bold cursor-pointer",
             isReleased 
               ? "bg-gray-100 text-gray-500 shadow-none border border-gray-200 cursor-not-allowed" 
               : "bg-[#146939] hover:bg-[#00954f] text-white hover:shadow-lg hover:-translate-y-0.5"
           )}
         >
           {loadingBtn ? (
             <Loader2 className="h-4 w-4 animate-spin" />
           ) : isReleased ? (
             <>
               <CheckCircle className="h-4 w-4" /> Released
             </>
           ) : (
             <>
               <Send className="h-4 w-4" /> Release Now
             </>
           )}
         </Button>
      </CardFooter>
    </Card>
  )
}