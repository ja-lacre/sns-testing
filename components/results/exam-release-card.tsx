'use client'

import { useState } from "react"
import { Calendar, Users, CheckCircle, Loader2, Send, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Exam {
  id: string
  name: string
  class_code: string
  date: string
  release_status: 'draft' | 'released'
  student_count: number // Graded count
  total_students: number // Total enrolled
}

interface ExamReleaseCardProps {
  exam: Exam
  disabled?: boolean
}

export function ExamReleaseCard({ exam, disabled = false }: ExamReleaseCardProps) {
  const [loadingBtn, setLoadingBtn] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()
  const isReleased = exam.release_status === 'released'

  // Calculate percentage for a progress bar effect (optional, or just for logic)
  const isFullyGraded = exam.student_count >= exam.total_students

  const handleReleaseNow = async () => {
    if (disabled || isReleased) return;
    if (!confirm(`Are you sure you want to release scores for "${exam.name}"? Emails will be sent immediately.`)) return;

    setLoadingBtn(true)
    
    const { error } = await supabase
      .from('exams')
      .update({ 
        release_status: 'released',
      })
      .eq('id', exam.id)

    if (error) {
      console.error("Error releasing results:", error)
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
        
        {/* Graded Count Display */}
        <div className="flex items-center text-sm font-roboto font-medium">
          <Users className="mr-2 h-4 w-4 text-[#146939]" />
          <span>
            <span className={cn(isFullyGraded ? "text-[#146939] font-bold" : "text-amber-600 font-bold")}>
              {exam.student_count}
            </span>
            <span className="text-gray-400 mx-1">/</span>
            <span>{exam.total_students} students graded</span>
          </span>
        </div>
      </CardContent>

      <CardFooter className={cn(
        "pt-4 pb-4 border-t border-gray-50 bg-gray-50/50 flex gap-2",
        isReleased ? "opacity-80" : ""
      )}>
         
         <Link href={`/dashboard/results/${exam.id}`} className="flex-1">
            <Button 
                disabled={disabled || isReleased}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-white hover:text-[#146939] hover:border-[#146939] font-montserrat h-10 px-2 rounded-xl cursor-pointer text-xs font-bold"
            >
                <Edit className="mr-2 h-3.5 w-3.5" /> Edit
            </Button>
         </Link>

         <Button 
           onClick={handleReleaseNow}
           disabled={disabled || isReleased || loadingBtn}
           className={cn(
             "flex-1 font-montserrat h-10 px-2 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs font-bold cursor-pointer",
             isReleased 
               ? "bg-gray-100 text-gray-500 shadow-none border border-gray-200 cursor-not-allowed" 
               : "bg-[#146939] hover:bg-[#00954f] text-white hover:shadow-lg hover:-translate-y-0.5"
           )}
         >
           {loadingBtn ? (
             <Loader2 className="h-3.5 w-3.5 animate-spin" />
           ) : isReleased ? (
             <>
               <CheckCircle className="h-3.5 w-3.5" /> Released
             </>
           ) : (
             <>
               <Send className="h-3.5 w-3.5" /> Release
             </>
           )}
         </Button>
      </CardFooter>
    </Card>
  )
}