import { createClient } from "@/utils/supabase/server"
import { ExamsList } from "@/components/exams/exams-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ExamsPage() {
  const supabase = await createClient()
  const { data: exams } = await supabase.from('exams').select('*').order('date', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#17321A] font-montserrat tracking-tight">Exams</h1>
          <p className="text-gray-500 font-roboto mt-2">Create and schedule assessments.</p>
        </div>
        <Button className="bg-[#146939] hover:bg-[#00954f] text-white font-montserrat h-11 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <PlusCircle className="mr-2 h-5 w-5" /> Create Exam
        </Button>
      </div>

      <ExamsList exams={exams || []} />
    </div>
  )
}