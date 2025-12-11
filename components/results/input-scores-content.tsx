'use client'

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Send, UserPlus, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { ManageStudentsDialog } from "@/components/classes/manage-students-dialog"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast-notification"

interface StudentScore {
  id: string
  student_id: string
  full_name: string
  email: string
  score: string | number
}

interface Exam {
  id: string
  name: string
  class_code: string
  date: string
  release_status: 'draft' | 'released'
  class_id?: string
  total_score?: number
}

interface InputScoresContentProps {
  exam: Exam
  students: StudentScore[]
  allStudents: any[]
  classId: string
}

export function InputScoresContent({ exam, students, allStudents, classId }: InputScoresContentProps) {
  const [scores, setScores] = useState<Record<string, string>>({})
  
  const [saving, setSaving] = useState(false)
  const [releasing, setReleasing] = useState(false)
  const [isManageOpen, setIsManageOpen] = useState(false)
  const [isReleased, setIsReleased] = useState(exam.release_status === 'released')
  
  const supabase = createClient()
  const router = useRouter()
  const { addToast } = useToast()

  // Default to 100 if undefined
  const maxScore = exam.total_score || 100

  // Sync local state with props whenever 'students' list updates
  useEffect(() => {
    setScores(prevScores => {
      const newScores: Record<string, string> = {}
      students.forEach(s => {
        if (prevScores[s.id] !== undefined) {
          newScores[s.id] = prevScores[s.id]
        } else {
          newScores[s.id] = s.score !== null && s.score !== undefined ? s.score.toString() : ''
        }
      })
      return newScores
    })
  }, [students])

  const handleScoreChange = (studentId: string, val: string) => {
    if (val === '' || /^\d+$/.test(val)) {
        if (val !== '' && parseInt(val) > maxScore) return
        setScores(prev => ({ ...prev, [studentId]: val }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    
    const upserts = Object.entries(scores).map(([studentId, score]) => ({
      exam_id: exam.id,
      student_id: studentId,
      score: score === '' ? null : parseInt(score),
    }))

    // Temporary delete + insert, assumes small dataset for simplicity
    await supabase.from('results').delete().eq('exam_id', exam.id)
    const { error } = await supabase.from('results').insert(upserts)

    setSaving(false)
    if (error) {
        console.error("Error saving scores:", error)
        addToast("Failed to save scores.", "error")
    } else {
        addToast("Scores saved successfully.", "success")
        router.refresh()
    }
  }

  const handleRelease = async () => {
    const filledScores = Object.values(scores).filter(s => s !== '').length
    if (!confirm(`Are you sure you want to release these results? \n\n${filledScores} students will receive their scores via email immediately.`)) return

    setReleasing(true)
    
    await handleSave()

    try {
      const response = await fetch('/api/release-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId: exam.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send emails')
      }

      addToast("Results released and emails sent successfully!", "success")
      setIsReleased(true)
      router.refresh()
    } catch (error: any) {
      console.error("Error releasing:", error)
      addToast(error.message, "error")
    } finally {
      setReleasing(false)
    }
  }

  return (
    // PRIMARY FIX: Added overflow-x-hidden here to contain any potential overflow
    <div className="space-y-8 animate-in fade-in pb-10 max-w-5xl mx-auto w-full overflow-x-hidden">
      
      {/* Header */}
      <div>
        <Link href="/dashboard/exams" className="inline-flex items-center text-sm text-gray-500 hover:text-[#146939] mb-6 group transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Exams
        </Link>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-[#17321A] font-montserrat">{exam.name}</h1>
                {isReleased && (
                    <span className="px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#146939] text-xs font-bold border border-[#146939]/20 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Released
                    </span>
                )}
            </div>
            <p className="text-gray-500 font-roboto mt-1">Input scores for <span className="font-semibold text-[#17321A]">{exam.class_code}</span></p>
          </div>
          
          {/* Action Buttons: Stacked on mobile */}
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <Button 
                variant="outline"
                onClick={() => setIsManageOpen(true)}
                className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 font-montserrat h-11 px-4 rounded-xl cursor-pointer justify-center"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Add Students
            </Button>

            <Button 
                onClick={handleSave} 
                disabled={saving || isReleased} 
                className="w-full sm:w-auto bg-white border border-[#146939] text-[#146939] hover:bg-[#e6f4ea] font-montserrat h-11 px-6 rounded-xl shadow-sm cursor-pointer justify-center"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>

            {!isReleased && (
                <Button 
                    onClick={handleRelease} 
                    disabled={releasing || saving} 
                    className="w-full sm:w-auto bg-[#146939] hover:bg-[#00954f] text-white font-montserrat h-11 px-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer justify-center"
                >
                {releasing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                Release Results
                </Button>
            )}
          </div>
        </div>
      </div>

      {/* Score Card */}
      <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white">
        
        {/* Horizontal Scroll Wrapper (The Fix) */}
        {/* We use w-full and overflow-x-auto. The min-w-[500px] inside forces the scroll */}
        <div className="overflow-x-auto w-full"> 
            
            {/* Header Row (Table Head) - Must have min-w to force scroll */}
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider font-montserrat min-w-[500px]">
              <span>Student List ({students.length})</span>
              <span className="pr-8">Score (0 - {maxScore})</span>
            </div>
            
            {/* Student List (Table Body) */}
            <div className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {students.length === 0 ? (
                 <div className="p-12 text-center text-gray-400 font-roboto">
                    <p>No students enrolled in this class yet.</p>
                    <Button variant="link" onClick={() => setIsManageOpen(true)} className="text-[#146939]">Add students now</Button>
                 </div>
              ) : (
                students.map((student) => (
                    // Row must also respect min-w
                    <div key={student.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#e6f4ea]/20 transition-colors group min-w-[500px]">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#146939] to-[#00954f] flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white group-hover:scale-105 transition-transform">
                        {student.full_name.charAt(0)}
                        </div>
                        <div>
                        <p className="font-bold text-[#17321A] font-montserrat">{student.full_name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                            <span>{student.student_id || 'No ID'}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="truncate max-w-[150px]">{student.email}</span>
                        </div>
                        </div>
                    </div>
                    
                    <div className="w-24 relative">
                        <Input 
                        type="number" 
                        min="0" 
                        max={maxScore}
                        disabled={isReleased}
                        placeholder="-"
                        value={scores[student.id] || ''}
                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                        className={cn(
                            "text-center font-mono font-bold text-lg border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] rounded-xl h-12 bg-gray-50/30 transition-all",
                            scores[student.id] !== '' ? "bg-[#e6f4ea]/50 border-[#146939]/30 text-[#146939]" : ""
                        )}
                        />
                    </div>
                    </div>
                ))
              )}
            </div>
        </div>
      </Card>

      <ManageStudentsDialog
        open={isManageOpen}
        onOpenChange={setIsManageOpen}
        classId={classId}
        className={exam.class_code}
        allStudents={allStudents}
        title="Add Students"
        actionLabel="Add"
        onDataChange={() => router.refresh()}
      />
    </div>
  )
}