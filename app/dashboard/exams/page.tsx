import { createClient } from "@/utils/supabase/server"
import { ExamsPageContent } from "@/components/exams/exams-page-content"

export const dynamic = 'force-dynamic'

export default async function ExamsPage() {
  const supabase = await createClient()

  // 1. Fetch Exams
  const { data: exams, error } = await supabase
    .from('exams')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error("Error fetching exams:", error)
  }

  // 2. Fetch Active Classes (for the Create Exam dropdown)
  const { data: classes } = await supabase
    .from('classes')
    .select('id, name, code')
    .eq('status', 'active')
    .order('name')

  return (
    <ExamsPageContent 
      exams={exams || []} 
      availableClasses={classes || []}
    />
  )
}