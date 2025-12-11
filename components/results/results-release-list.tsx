'use client'

import { AlertCircle, FileSpreadsheet } from "lucide-react"
import { ExamReleaseCard } from "./exam-release-card"

interface Exam {
  id: string
  name: string
  class_code: string
  date: string
  release_status: 'draft' | 'released'
  auto_release: boolean
  student_count: number
}

export function ResultsReleaseList({ exams }: { exams: Exam[] }) {
  const pendingExams = exams.filter(e => e.release_status === 'draft')
  const releasedExams = exams.filter(e => e.release_status === 'released')

  return (
    <div className="space-y-10">
      
      {/* Information Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
            <h4 className="font-bold text-amber-800 font-montserrat text-sm">About Auto-Release</h4>
            <p className="text-xs text-amber-700 mt-1 font-roboto leading-relaxed">
                When "Auto-release" is enabled, results will be automatically emailed to students on the scheduled exam date (or immediately if the date has passed). Manually clicking "Release" sends them immediately.
            </p>
        </div>
      </div>

      {/* Pending Release Section */}
      <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#17321A] font-montserrat flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-[#146939]" /> Ready to Release
          </h2>
          {pendingExams.length === 0 ? (
             <p className="text-gray-500 font-roboto italic">No exams currently pending release.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingExams.map(exam => (
                    <ExamReleaseCard key={exam.id} exam={exam} />
                ))}
            </div>
          )}
      </section>

      {/* Already Released Section (Optional, for history) */}
      {releasedExams.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-400 font-montserrat">Previously Released</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-75 grayscale-[30%]">
                {releasedExams.map(exam => (
                    <ExamReleaseCard key={exam.id} exam={exam} disabled />
                ))}
            </div>
        </section>
      )}

    </div>
  )
}