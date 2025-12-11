'use client'

import { FileSpreadsheet, Send, ChevronRight, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ResultsManager({ exams }: { exams: any[] }) {
  // Filter for exams that are completed but may need result sending
  const pendingGrading = exams.filter(e => e.status !== 'Draft')

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {pendingGrading.map((exam) => (
          <Card key={exam.id} className="group hover:border-[#00954f] transition-colors cursor-pointer border-gray-200 shadow-sm">
            <CardContent className="p-0 flex items-center">
              <div className="p-6 bg-gray-50 border-r border-gray-100 group-hover:bg-[#e6f4ea] transition-colors w-20 flex justify-center">
                 <FileSpreadsheet className="h-6 w-6 text-gray-400 group-hover:text-[#00954f]" />
              </div>
              <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                   <h3 className="text-lg font-bold text-[#17321A] font-montserrat">{exam.name}</h3>
                   <p className="text-sm text-gray-500 font-roboto">{exam.class_code} • Conducted on {new Date(exam.date).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Status Indicator */}
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-[#146939] bg-[#e6f4ea] px-2 py-0.5 rounded">
                        Needs Review
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1">28 Pending Scores</span>
                  </div>

                  <Button className="bg-[#17321A] hover:bg-[#146939] text-white font-montserrat h-10 px-6">
                    Input Scores <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
            <h4 className="font-bold text-amber-800 font-montserrat text-sm">Automated Release</h4>
            <p className="text-xs text-amber-700 mt-1 font-roboto">
                Results marked as "Auto-Release" will be sent to students via email automatically at 5:00 PM today.
            </p>
        </div>
      </div>
    </div>
  )
}