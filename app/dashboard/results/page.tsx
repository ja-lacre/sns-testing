import { createClient } from "@/utils/supabase/server"
import { ResultsReleaseList } from "@/components/results/results-release-list"
import { Send } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ResultsPage() {
  const supabase = await createClient()

  // 1. Fetch Exams
  const { data: examsData, error } = await supabase
    .from('exams')
    .select('*')
    .order('date', { ascending: false })

  if (error) console.error("Error fetching exams:", error)

  // 2. Calculate Counts (Graded vs Total Enrolled)
  const formattedExams = await Promise.all(
    (examsData || []).map(async (exam) => {
      
      // Get Class ID
      const { data: classData } = await supabase
        .from('classes')
        .select('id')
        .eq('code', exam.class_code)
        .single()

      if (!classData) return { ...exam, student_count: 0, total_students: 0 }

      // A. Get List of CURRENTLY Enrolled Student IDs
      const { data: enrolledStudents } = await supabase
        .from('enrollments')
        .select('student_id')
        .eq('class_id', classData.id)

      const enrolledIds = enrolledStudents?.map(e => e.student_id) || []
      const totalEnrolled = enrolledIds.length

      // B. Get Results ONLY for currently enrolled students
      // We assume if no enrolled students, count is 0
      let validGradedCount = 0
      
      if (totalEnrolled > 0) {
        const { count } = await supabase
          .from('results')
          .select('*', { count: 'exact', head: true })
          .eq('exam_id', exam.id)
          .in('student_id', enrolledIds) // CRITICAL FIX: Only count if student is still enrolled
        
        validGradedCount = count || 0
      }

      return {
        ...exam,
        student_count: validGradedCount, 
        total_students: totalEnrolled
      }
    })
  )

  // Only show exams that have at least one grade input
  const readyExams = formattedExams.filter(e => e.student_count > 0)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#17321A] font-montserrat tracking-tight">
            Send Results
          </h1>
          <p className="text-gray-500 font-roboto mt-3 text-lg max-w-md leading-relaxed">
            Review and release exam scores to students.
          </p>
        </div>
        <div className="p-3 bg-[#e6f4ea] rounded-2xl text-[#146939] flex items-center gap-3 shadow-sm border border-[#146939]/10">
            <Send className="h-6 w-6" />
            <span className="font-montserrat font-bold">
                {readyExams.filter(e => e.release_status === 'draft').length} Pending Release
            </span>
        </div>
      </div>

      <ResultsReleaseList exams={readyExams} />
    </div>
  )
}