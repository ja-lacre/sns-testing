'use client'

import { useState } from "react"
import { PlusCircle, BookOpen, Users, ArrowRight, MoreVertical, Edit, UserPlus, Archive, RefreshCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { ClassFormDialog } from "./class-form-dialog"
import { ManageStudentsDialog } from "./manage-students-dialog"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ClassItem {
  id: string
  name: string
  code: string
  status: string
  student_count?: number
}

interface Student {
  id: string
  full_name: string
  email: string
}

interface ClassesPageContentProps {
  classes: ClassItem[]
  allStudents: Student[]
}

export function ClassesPageContent({ classes, allStudents }: ClassesPageContentProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null)
  const [managingClass, setManagingClass] = useState<ClassItem | null>(null)
  
  // New State: View Filter
  const [view, setView] = useState<'active' | 'archived'>('active')
  
  const supabase = createClient()
  const router = useRouter()

  // Filter classes based on the current view
  const displayedClasses = classes.filter(cls => cls.status === view)

  const toggleStatus = async (classId: string, newStatus: 'active' | 'archived') => {
    const action = newStatus === 'archived' ? 'archive' : 'restore'
    if (confirm(`Are you sure you want to ${action} this class?`)) {
      const { error } = await supabase
        .from('classes')
        .update({ status: newStatus })
        .eq('id', classId)
      
      if (!error) {
        router.refresh()
      } else {
        console.error(`Error ${action}ing class:`, error)
      }
    }
  }

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
        
        <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-[#146939] hover:bg-[#00954f] text-white font-montserrat shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-12 px-6 rounded-xl flex items-center gap-2 cursor-pointer"
        >
            <PlusCircle className="h-5 w-5" />
            Create Class
        </Button>
      </div>

      {/* --- View Toggles (Active / Archived) --- */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          onClick={() => setView('active')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 font-montserrat",
            view === 'active' 
              ? "bg-white text-[#146939] shadow-sm" 
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          )}
        >
          Active Classes
        </button>
        <button
          onClick={() => setView('archived')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 font-montserrat",
            view === 'archived' 
              ? "bg-white text-[#146939] shadow-sm" 
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          )}
        >
          Archived ({classes.filter(c => c.status === 'archived').length})
        </button>
      </div>

      {/* --- Classes Grid --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedClasses.length === 0 ? (
           <div className="col-span-full py-12 text-center text-gray-500 font-roboto border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
             <p>No {view} classes found.</p>
           </div>
        ) : (
          displayedClasses.map((cls) => (
            <Card 
              key={cls.id} 
              className={cn(
                "group relative border shadow-sm hover:shadow-xl transition-all duration-300 ease-out bg-white overflow-hidden hover:-translate-y-2 flex flex-col justify-between",
                view === 'archived' ? "border-gray-200 opacity-90" : "border-gray-100"
              )}
            >
              {/* Top Line: Green for Active, Gray for Archived */}
              <div className={cn(
                "absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                view === 'active' ? "bg-gradient-to-r from-[#146939] to-[#00954f]" : "bg-gray-400"
              )}></div>

              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-[#17321A] font-montserrat line-clamp-1" title={cls.name}>
                    {cls.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#e6f4ea] text-[#146939] font-roboto border border-[#146939]/10">
                      {cls.code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wider ${
                      cls.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {cls.status}
                    </span>
                  </div>
                </div>
                
                {/* Kebab Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-[#17321A] hover:bg-[#e6f4ea] transition-colors cursor-pointer">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 border-gray-100 shadow-lg animate-in slide-in-from-top-1">
                    
                    <DropdownMenuItem 
                      onClick={() => setEditingClass(cls)}
                      className="cursor-pointer focus:bg-[#e6f4ea] focus:text-[#146939] font-roboto"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit Class
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => setManagingClass(cls)}
                      className="cursor-pointer focus:bg-[#e6f4ea] focus:text-[#146939] font-roboto"
                    >
                      <UserPlus className="mr-2 h-4 w-4" /> Manage Students
                    </DropdownMenuItem>
                    
                    {view === 'active' ? (
                      <DropdownMenuItem 
                        onClick={() => toggleStatus(cls.id, 'archived')}
                        className="cursor-pointer text-amber-600 focus:bg-amber-50 focus:text-amber-700 font-roboto"
                      >
                        <Archive className="mr-2 h-4 w-4" /> Archive
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem 
                        onClick={() => toggleStatus(cls.id, 'active')}
                        className="cursor-pointer text-[#146939] focus:bg-[#e6f4ea] font-roboto"
                      >
                        <RefreshCcw className="mr-2 h-4 w-4" /> Restore
                      </DropdownMenuItem>
                    )}
                  
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent className="py-4">
                <div className="flex items-center text-sm text-gray-500 font-roboto">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                    <Users className="h-4 w-4 text-[#00954f]" />
                    <span>{cls.student_count || 0} Students</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0 pb-4 border-t border-gray-50 mt-4 bg-gray-50/30">
                <Link href={`/dashboard/classes/${cls.id}`} className="w-full">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-[#146939] hover:text-[#00954f] hover:bg-[#e6f4ea] mt-4 font-montserrat font-semibold group/btn cursor-pointer"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
        
        {/* Create Card (Only show in Active View) */}
        {view === 'active' && (
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex flex-col items-center justify-center gap-4 h-full min-h-[220px] rounded-xl border-2 border-dashed border-gray-200 hover:border-[#00954f] hover:bg-[#e6f4ea]/30 transition-all duration-300 group cursor-pointer text-gray-400 hover:text-[#00954f]"
          >
            <div className="p-4 rounded-full bg-gray-50 group-hover:bg-[#e6f4ea] transition-colors">
              <BookOpen className="h-8 w-8 text-gray-300 group-hover:text-[#00954f] transition-colors" />
            </div>
            <div className="text-center">
              <span className="block font-bold font-montserrat text-lg">Create New Class</span>
              <span className="text-sm font-roboto opacity-70">Add a new course to your schedule</span>
            </div>
          </button>
        )}
      </div>

      {/* Dialogs */}
      <ClassFormDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
      />

      <ClassFormDialog 
        open={!!editingClass} 
        onOpenChange={(open) => !open && setEditingClass(null)} 
        classToEdit={editingClass}
      />

      {managingClass && (
        <ManageStudentsDialog
            open={!!managingClass}
            onOpenChange={(open) => !open && setManagingClass(null)}
            classId={managingClass.id}
            className={managingClass.name}
            allStudents={allStudents}
        />
      )}
      
    </div>
  )
}