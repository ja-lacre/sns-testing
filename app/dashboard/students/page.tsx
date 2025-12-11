import { createClient } from "@/utils/supabase/server"
import { StudentsTable } from "@/components/students/students-table"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function StudentsPage() {
  const supabase = await createClient()
  const { data: students } = await supabase.from('students').select('*').order('full_name')

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#17321A] font-montserrat tracking-tight">Students</h1>
          <p className="text-gray-500 font-roboto mt-2">Manage enrollment and student profiles.</p>
        </div>
        <Button className="bg-[#146939] hover:bg-[#00954f] text-white font-montserrat h-11 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <UserPlus className="mr-2 h-5 w-5" /> Add Student
        </Button>
      </div>

      <StudentsTable students={students || []} />
    </div>
  )
}