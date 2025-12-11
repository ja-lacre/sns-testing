import { createClient } from "@/utils/supabase/server"
import { ResultsManager } from "@/components/results/results-manager"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ResultsPage() {
  const supabase = await createClient()
  const { data: exams } = await supabase.from('exams').select('*').order('date', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#17321A] font-montserrat tracking-tight">Send Results</h1>
          <p className="text-gray-500 font-roboto mt-2">Grade papers and distribute scores to students.</p>
        </div>
        <Button variant="outline" className="border-[#146939] text-[#146939] hover:bg-[#e6f4ea] font-montserrat h-11">
          <Send className="mr-2 h-4 w-4" /> Bulk Release
        </Button>
      </div>

      <ResultsManager exams={exams || []} />
    </div>
  )
}