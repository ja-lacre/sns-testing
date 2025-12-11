import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { InputScoresContent } from "@/components/results/input-scores-content"

export const dynamic = 'force-dynamic'

export default async function InputScoresPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch Exam Details
  const { data: exam } = await supabase
    .from('exams')
    .select('*')
    .eq('id', id)
    .single()

  if (!exam) return notFound()

  // 2. Fetch Class ID via code
  const { data: classData } = await supabase
    .from('classes')
    .select('id')
    .eq('code', exam.class_code)
    .single()

  if (!classData) return notFound()

  // 3. Fetch Students enrolled in that class
  // Join with results table to get existing scores if any
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      student:students(id, full_name, student_id)
    `)
    .eq('class_id', classData.id)
    .order('student(full_name)')

  // 4. Fetch existing results for this exam
  const { data: existingResults } = await supabase
    .from('results')
    .select('student_id, score')
    .eq('exam_id', id)

  // Map scores to students
  const studentsWithScores = enrollments?.map((e: any) => {
    const scoreRecord = existingResults?.find(r => r.student_id === e.student.id)
    return {
      ...e.student,
      score: scoreRecord ? scoreRecord.score : ''
    }
  }) || []

  return (
    <InputScoresContent 
      exam={exam}
      students={studentsWithScores}
    />
  )
}