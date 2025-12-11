'use client'

import { useState } from "react"
import { ArrowLeft, Save, Send, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

interface StudentScore {
  id: string
  student_id: string
  full_name: string
  score: string | number
}

interface Exam {
  id: string
  name: string
  class_code: string
  date: string
}

export function InputScoresContent({ exam, students }: { exam: Exam, students: StudentScore[] }) {
  const [scores, setScores] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    students.forEach(s => {
      initial[s.id] = s.score.toString()
    })
    return initial
  })
  const [saving, setSaving] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const handleScoreChange = (studentId: string, val: string) => {
    setScores(prev => ({ ...prev, [studentId]: val }))
  }

  const handleSave = async () => {
    setSaving(true)
    
    const upserts = Object.entries(scores).map(([studentId, score]) => ({
      exam_id: exam.id,
      student_id: studentId,
      score: score === '' ? null : parseInt(score),
      status: 'pending' 
    }))

    // Use upsert to update existing or insert new
    // Note: requires a unique constraint on (exam_id, student_id) in DB for conflict resolution
    // Or we manually check. For simplicity, we delete old and insert new, or just insert
    // Ideally, create a unique index: create unique index idx_results_exam_student on results(exam_id, student_id);
    
    // We'll delete for this exam first to be safe (simple approach) or use proper upsert
    // Let's assume unique constraint exists or we handle it.
    // For now, let's just insert and ignore conflicts or delete prior.
    
    await supabase.from('results').delete().eq('exam_id', exam.id)
    const { error } = await supabase.from('results').insert(upserts)

    setSaving(false)
    if (error) console.error(error)
    else router.refresh()
  }

  return (
    <div className="space-y-8 animate-in fade-in pb-10 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <Link href="/dashboard/results" className="inline-flex items-center text-sm text-gray-500 hover:text-[#146939] mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Results
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-[#17321A] font-montserrat">{exam.name}</h1>
            <p className="text-gray-500 font-roboto mt-1">Input scores for {exam.class_code}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="bg-[#146939] hover:bg-[#00954f] text-white rounded-xl h-11 px-6 shadow-md">
              <Save className="mr-2 h-4 w-4" /> 
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
          </div>
        </div>
      </div>

      <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white">
        <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100 flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider font-montserrat">
          <span>Student</span>
          <span className="pr-12">Score (0-100)</span>
        </div>
        <div className="divide-y divide-gray-50">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#e6f4ea]/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#146939] to-[#00954f] flex items-center justify-center text-white font-bold text-sm">
                  {student.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#17321A] font-montserrat">{student.full_name}</p>
                  <p className="text-xs text-gray-500 font-mono">{student.student_id}</p>
                </div>
              </div>
              
              <div className="w-24">
                <Input 
                  type="number" 
                  min="0" 
                  max="100"
                  value={scores[student.id] || ''}
                  onChange={(e) => handleScoreChange(student.id, e.target.value)}
                  className="text-center font-mono font-bold text-lg border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] rounded-xl h-12"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}