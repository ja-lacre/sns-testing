import { createClient } from "@/utils/supabase/server"
import { ResultsReleaseList } from "@/components/results/results-release-list"
import { Send } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ResultsPage() {
  const supabase = await createClient()

  // 1. Fetch Exams arranged by date
  const { data: examsData, error } = await supabase
    .from('exams')
    .select('*')
    .order('date', { ascending: false })

  if (error) console.error("Error fetching exams:", error)

  // 2. Fetch result counts for these exams to see which ones have scores
  // We do this in a separate query for efficiency if there are many exams
  const examIds = examsData?.map(e => e.id) || []
  let examCounts: Record<string, number> = {}
  
  if (examIds.length > 0) {
    const { data: results } = await supabase
      .from('results')
      .select('exam_id')
      .in('exam_id', examIds)

    // Count results per exam
    results?.forEach(r => {
      examCounts[r.exam_id] = (examCounts[r.exam_id] || 0) + 1
    })
  }

  // Combine data
  const formattedExams = examsData?.map(exam => ({
    ...exam,
    student_count: examCounts[exam.id] || 0
  })) || []

  // Filter out exams that have 0 scores inputted
  const readyExams = formattedExams.filter(e => e.student_count > 0)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
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