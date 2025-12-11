'use client'

import { useState } from "react"
import { Search, MoreVertical, Trash2, Edit, UserPlus, ChevronLeft, ChevronRight, FileUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StudentFormDialog } from "./student-form-dialog"
import { ImportStudentsDialog } from "./import-students-dialog"
import { ConfirmActionDialog } from "@/components/classes/confirm-action-dialog"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast-notification"

interface Student {
  id: string
  student_id: string | null
  full_name: string
  email: string | null
  enrolled_at: string
  enrolled_classes: string[]
}

interface ClassItem {
  id: string
  name: string
  code: string
}

interface StudentsTableProps {
  students: Student[]
  availableClasses: ClassItem[]
}

const ITEMS_PER_PAGE = 20

export function StudentsTable({ students, availableClasses }: StudentsTableProps) {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)

  const router = useRouter()
  const supabase = createClient()
  const { addToast } = useToast()

  const handleAddClick = () => {
    setStudentToEdit(null)
    setIsFormOpen(true)
  }

  const handleEditClick = (student: Student) => {
    setStudentToEdit(student)
    setIsFormOpen(true)
  }

  const handleRemoveStudent = async () => {
    if (!studentToDelete) return
    
    await supabase.from('enrollments').delete().eq('student_id', studentToDelete.id)
    await supabase.from('results').delete().eq('student_id', studentToDelete.id)
    const { error } = await supabase.from('students').delete().eq('id', studentToDelete.id)

    if (error) {
        console.error("Error removing student:", error)
        addToast("Failed to delete student.", "error")
    } else {
        addToast("Student removed successfully.", "success")
        router.refresh()
    }
  }

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <div className="space-y-6 w-full">
      
      {/* --- Header Controls --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by name, email, or ID..." 
            className="pl-10 border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] h-11 rounded-xl bg-white w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 w-full lg:w-auto">
          <Button 
            onClick={() => setIsImportOpen(true)}
            variant="outline"
            className="w-full sm:w-auto border-[#146939] text-[#146939] hover:bg-[#e6f4ea] font-montserrat h-11 rounded-xl cursor-pointer px-4 justify-center"
          >
            <FileUp className="mr-2 h-5 w-5" /> Import
          </Button>

          <Button 
            onClick={handleAddClick}
            className="w-full sm:w-auto bg-[#146939] hover:bg-[#00954f] text-white font-montserrat h-11 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all rounded-xl cursor-pointer px-6 justify-center"
          >
            <UserPlus className="mr-2 h-5 w-5" /> Add Student
          </Button>
        </div>
      </div>

      {/* --- Table Container --- */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col w-full overflow-hidden">
        
        {/* CRITICAL FIX FOR MOBILE:
            max-w-[calc(100vw-2.5rem)] ensures this div never exceeds the viewport width minus padding.
            This forces the horizontal scrollbar to appear on the DIV, not the page.
        */}
        <div className="overflow-x-auto w-full max-w-[calc(100vw-2.5rem)] md:max-w-full">
          <table className="w-full text-sm text-left whitespace-nowrap"> 
            {/* whitespace-nowrap prevents text from breaking and forcing vertical height issues */}
            <thead className="bg-gray-50/50 text-gray-500 font-montserrat uppercase text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-[#17321A]">Student ID</th>
                <th className="px-6 py-4 font-bold text-[#17321A]">Name</th>
                <th className="px-6 py-4 font-bold text-[#17321A]">Email</th>
                <th className="px-6 py-4 font-bold text-[#17321A]">Classes</th>
                <th className="px-6 py-4 font-bold text-[#17321A]">Enrolled Date</th>
                <th className="px-6 py-4 font-bold text-[#17321A] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-roboto">
                    <div className="flex flex-col items-center gap-2">
                       <Search className="h-8 w-8 text-gray-300" />
                       <p>No students found matching your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="group hover:bg-[#e6f4ea]/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                       <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                         {student.student_id || 'N/A'}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#146939] to-[#00954f] flex items-center justify-center text-white font-bold font-montserrat text-xs shadow-sm shrink-0">
                           {student.full_name.charAt(0)}
                        </div>
                        <span className="font-semibold text-[#17321A] font-montserrat">{student.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-roboto">
                      {student.email || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px] overflow-hidden text-ellipsis">
                        {student.enrolled_classes.length > 0 ? (
                          student.enrolled_classes.slice(0, 2).map((code, i) => (
                            <span key={i} className="text-[10px] font-bold px-1.5 py-0.5 bg-[#e6f4ea] text-[#146939] rounded border border-[#146939]/10">
                              {code}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">None</span>
                        )}
                        {student.enrolled_classes.length > 2 && (
                          <span className="text-[10px] text-gray-500 pl-1">
                            +{student.enrolled_classes.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-roboto">
                      {new Date(student.enrolled_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-[#146939] hover:bg-[#e6f4ea] rounded-lg transition-colors cursor-pointer">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-lg p-1">
                          <DropdownMenuItem 
                            onClick={() => handleEditClick(student)}
                            className="cursor-pointer font-roboto text-gray-600 focus:text-[#146939] focus:bg-[#e6f4ea] rounded-lg"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                          </DropdownMenuItem>
                          <div className="h-px bg-gray-50 my-1"></div>
                          <DropdownMenuItem 
                            onClick={() => setStudentToDelete(student)}
                            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 font-roboto rounded-lg"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Footer --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30 gap-4">
          <p className="text-xs text-gray-500 font-roboto text-center sm:text-left">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length} students
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 rounded-lg border-gray-200 cursor-pointer disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium text-gray-700 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 rounded-lg border-gray-200 cursor-pointer disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <StudentFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        availableClasses={availableClasses}
        studentToEdit={studentToEdit}
      />

      <ImportStudentsDialog 
        open={isImportOpen} 
        onOpenChange={setIsImportOpen} 
      />

      <ConfirmActionDialog
        open={!!studentToDelete}
        onOpenChange={(open) => !open && setStudentToDelete(null)}
        title="Remove Student"
        description={`Are you sure you want to permanently remove ${studentToDelete?.full_name}?`}
        actionLabel="Remove Student"
        variant="danger"
        onConfirm={handleRemoveStudent}
      />
    </div>
  )
}