import { createClient } from "@/utils/supabase/server"
import { StudentsTable } from "@/components/students/students-table"

export const dynamic = 'force-dynamic'

export default async function StudentsPage() {
  const supabase = await createClient()

  // 1. Fetch Students with Enrolled Classes
  // We use a deep select to get the class codes via the enrollments table
  const { data: students, error } = await supabase
    .from('students')
    .select(`
      *,
      enrollments (
        class: classes (
          code
        )
      )
    `)
    .order('full_name', { ascending: true })

  if (error) {
    console.error("Error fetching students:", error)
  }

  // 2. Fetch Active Classes (for the 'Add Student' dropdown)
  const { data: classes } = await supabase
    .from('classes')
    .select('id, name, code')
    .eq('status', 'active')
    .order('name')

  // Transform data to flatten the structure for the table
  const formattedStudents = students?.map((student: any) => ({
    ...student,
    // Extract just the codes into an array of strings
    enrolled_classes: student.enrollments.map((e: any) => e.class?.code).filter(Boolean)
  })) || []

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#17321A] font-montserrat tracking-tight">
            Students
          </h1>
          <p className="text-gray-500 font-roboto mt-3 text-lg">
            Manage student directory and enrollments.
          </p>
        </div>
      </div>

      <StudentsTable 
        students={formattedStudents} 
        availableClasses={classes || []}
      />
    </div>
  )
}