import { createClient } from "@/utils/supabase/server"
import { ClassesGrid } from "@/components/classes/classes-grid"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

// Force dynamic so we get the latest data every refresh
export const dynamic = 'force-dynamic'

export default async function ClassesPage() {
  const supabase = await createClient()

  // Fetch classes with a count of students
  // Note: This requires the 'enrollments' table to work perfectly. 
  // If you haven't run the SQL above, it will just return 0 for the count.
  const { data: classesData, error } = await supabase
    .from('classes')
    .select(`
      *,
      enrollments: enrollments(count)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching classes:", error)
  }

  // Format data for the grid component
  const formattedClasses = classesData?.map((cls: any) => ({
    ...cls,
    // Supabase returns count inside an array/object structure for joins
    student_count: cls.enrollments?.[0]?.count || 0 
  })) || []

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#17321A] font-montserrat tracking-tight">
            My Classes
          </h1>
          <p className="text-gray-500 font-roboto mt-3 text-lg max-w-md leading-relaxed">
            Manage your active courses, students, and curriculum.
          </p>
        </div>
        
        {/* Primary Action Button */}
        <Button className="bg-[#146939] hover:bg-[#00954f] text-white font-montserrat shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-12 px-6 rounded-xl flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Create Class
        </Button>
      </div>

      {/* --- Classes Grid --- */}
      <ClassesGrid classes={formattedClasses} />
      
    </div>
  )
}