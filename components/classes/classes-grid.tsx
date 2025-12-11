'use client'

import { useState } from "react"
import { BookOpen, Users, ArrowRight, MoreVertical, Calendar, Trash2, Edit, UserPlus, Archive } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { CreateClassDialog } from "./create-class-dialog"

interface ClassItem {
  id: string
  name: string
  code: string
  status: string
  student_count?: number
}

interface ClassesGridProps {
  classes: ClassItem[]
}

export function ClassesGrid({ classes }: ClassesGridProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card 
            key={cls.id} 
            className="group relative border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ease-out bg-white overflow-hidden hover:-translate-y-2 flex flex-col justify-between"
          >
            {/* Top Green Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#146939] to-[#00954f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

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
              
              {/* Themed Kebab Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-[#17321A] hover:bg-[#e6f4ea] transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 border-gray-100 shadow-lg animate-in slide-in-from-top-1">
                  <DropdownMenuItem className="cursor-pointer focus:bg-[#e6f4ea] focus:text-[#146939] font-roboto">
                    <Edit className="mr-2 h-4 w-4" /> Edit Class
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-[#e6f4ea] focus:text-[#146939] font-roboto">
                    <UserPlus className="mr-2 h-4 w-4" /> Manage Students
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-amber-600 focus:bg-amber-50 focus:text-amber-700 font-roboto">
                    <Archive className="mr-2 h-4 w-4" /> Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent className="py-4">
              <div className="flex items-center justify-between text-sm text-gray-500 font-roboto">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#00954f]" />
                  <span>{cls.student_count || 0} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Fall 2024</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0 pb-4 border-t border-gray-50 mt-4 bg-gray-50/30">
              <Link href={`/dashboard/classes/${cls.id}`} className="w-full">
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-[#146939] hover:text-[#00954f] hover:bg-[#e6f4ea] mt-4 font-montserrat font-semibold group/btn"
                >
                  View Details
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        
        {/* "Create New Class" Card */}
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
      </div>

      {/* Render the Create Modal */}
      <CreateClassDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  )
}