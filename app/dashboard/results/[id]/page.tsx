import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { InputScoresContent } from "@/components/results/input-scores-content"

export const dynamic = 'force-dynamic'

export default async function InputScoresPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch Exam
  const { data: exam } = await supabase.from('exams').select('*, total_score').eq('id', id).single()
  if (!exam) return notFound()

  // 2. Fetch Class ID
  const { data: classData } = await supabase.from('classes').select('id').eq('code', exam.class_code).single()
  if (!classData) return notFound()

  // 3. Fetch Enrolled Students
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`student:students(id, full_name, student_id, email)`)
    .eq('class_id', classData.id)
    .order('student(full_name)')

  // 4. Fetch Existing Scores
  const { data: existingResults } = await supabase
    .from('results')
    .select('student_id, score')
    .eq('exam_id', id)

  // 5. Fetch ALL Students (for the Add/Manage dialog)
  const { data: allStudents } = await supabase
    .from('students')
    .select('id, full_name, email')
    .order('full_name')

  const studentsWithScores = enrollments?.map((e: any) => {
    const scoreRecord = existingResults?.find(r => r.student_id === e.student.id)
    return {
      ...e.student,
      score: scoreRecord ? scoreRecord.score : ''
    }
  }) || []

  return (
    // FIX: Added w-full and overflow-x-hidden to the main container
    <div className="w-full overflow-x-hidden">
        <InputScoresContent 
            exam={exam} 
            students={studentsWithScores} 
            allStudents={allStudents || []}
            classId={classData.id}
        />
    </div>
  )
}