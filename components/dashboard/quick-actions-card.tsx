'use client'

import { PlusCircle, Users, FileText, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function QuickActionsCard() {
  return (
    <Card className="md:col-span-3 lg:col-span-2 border border-gray-200 shadow-sm bg-white rounded-2xl h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#17321A] font-montserrat">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href="/dashboard/exams" className="block w-full">
            <Button 
                className="w-full justify-start bg-[#146939] hover:bg-[#00954f] text-white font-montserrat h-12 rounded-xl shadow-md hover:shadow-lg transition-all group"
            >
                <PlusCircle className="mr-3 h-5 w-5" />
                <span className="flex-1 text-left">Create New Exam</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
        </Link>

        <Link href="/dashboard/students" className="block w-full">
            <Button 
                variant="outline" 
                className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#17321A] hover:border-[#146939] font-montserrat h-12 rounded-xl transition-all group"
            >
                <Users className="mr-3 h-5 w-5 text-gray-500 group-hover:text-[#146939]" />
                <span className="flex-1 text-left">Add Student</span>
            </Button>
        </Link>

        <Link href="/dashboard/classes" className="block w-full">
            <Button 
                variant="outline" 
                className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#17321A] hover:border-[#146939] font-montserrat h-12 rounded-xl transition-all group"
            >
                <FileText className="mr-3 h-5 w-5 text-gray-500 group-hover:text-[#146939]" />
                <span className="flex-1 text-left">Manage Classes</span>
            </Button>
        </Link>
      </CardContent>
    </Card>
  )
}