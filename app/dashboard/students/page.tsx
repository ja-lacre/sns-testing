import { createClient } from "@/utils/supabase/server"
import { StudentsTable } from "@/components/students/students-table"

export const dynamic = 'force-dynamic'

export default async function StudentsPage() {
  const supabase = await createClient()

  // 1. Fetch Students
  const { data: studentsData } = await supabase
    .from('students')
    .select('*, enrollments(class_id)')
    .order('full_name')

  // 2. Fetch Classes
  const { data: classesData } = await supabase
    .from('classes')
    .select('id, name, code')
    .eq('status', 'active')

  // 3. Transform Data
  const classMap = new Map(classesData?.map(c => [c.id, c.code]))

  const formattedStudents = studentsData?.map(student => ({
    ...student,
    enrolled_classes: student.enrollments
      .map((e: any) => classMap.get(e.class_id))
      .filter(Boolean) 
  })) || []

  return (
    // Added overflow-hidden to prevent page-wide scrolling
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 w-full overflow-hidden">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#17321A] font-montserrat tracking-tight">Students</h1>
          <p className="text-gray-500 font-roboto mt-3 text-lg">Manage your student directory and enrollments.</p>
        </div>
      </div>

      <StudentsTable 
        students={formattedStudents} 
        availableClasses={classesData || []} 
      />
    </div>
  )
}