'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export interface Exam {
  id: string;
  name: string;
  class_code: string;
  date: string;
  release_status: string; // Updated from status to match new schema
}

interface RecentExamsCardProps {
  exams: Exam[];
}

export function RecentExamsCard({ exams }: RecentExamsCardProps) {
  return (
    <Card className="md:col-span-4 lg:col-span-5 border border-gray-200 shadow-sm bg-white rounded-2xl">
      <CardHeader className="border-b border-gray-50 pb-4">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-xl font-bold text-[#17321A] font-montserrat">Recent Exams</CardTitle>
                <CardDescription className="font-roboto text-gray-500 mt-1">Latest exam papers created or modified.</CardDescription>
            </div>
            <Link href="/dashboard/exams">
                <Button variant="ghost" className="text-[#00954f] hover:text-[#17321A] hover:bg-[#e6f4ea] font-montserrat text-xs font-semibold cursor-pointer rounded-xl">
                    View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
            </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {exams.length === 0 ? (
            <div className="text-center py-8">
                <p className="text-sm text-gray-500 font-roboto">No recent exams found.</p>
                <Link href="/dashboard/exams" className="text-xs text-[#146939] font-bold hover:underline mt-2 inline-block">Create your first exam</Link>
            </div>
          ) : (
            exams.map((exam) => (
              <Link key={exam.id} href={`/dashboard/results/${exam.id}`}>
                  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-[#00954f]/30 hover:bg-white hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#17321A] font-bold font-montserrat shadow-sm group-hover:border-[#00954f] group-hover:text-[#00954f] transition-colors text-sm">
                          {exam.class_code.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#17321A] font-montserrat group-hover:text-[#00954f] transition-colors">
                          {exam.name}
                        </p>
                        <p className="text-xs text-gray-500 font-roboto mt-0.5">
                          {exam.class_code} • <span className="font-medium">{new Date(exam.date).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full font-semibold font-roboto border ${
                      exam.release_status === 'released' 
                        ? 'bg-[#e6f4ea] text-[#146939] border-[#146939]/10' 
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      {exam.release_status === 'released' ? 'Released' : 'Draft'}
                    </div>
                  </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}