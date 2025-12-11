'use client'

import { FileSpreadsheet } from "lucide-react"
import { ExamReleaseCard } from "./exam-release-card"

interface Exam {
  id: string
  name: string
  class_code: string
  date: string
  release_status: 'draft' | 'released'
  student_count: number
}

export function ResultsReleaseList({ exams }: { exams: Exam[] }) {
  const pendingExams = exams.filter(e => e.release_status === 'draft')
  const releasedExams = exams.filter(e => e.release_status === 'released')

  return (
    <div className="space-y-10">
      
      {/* Pending Release Section */}
      <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#17321A] font-montserrat flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-[#146939]" /> Ready to Release
          </h2>
          {pendingExams.length === 0 ? (
             <div className="p-12 text-center text-gray-500 font-roboto border-2 border-dashed border-gray-100 rounded-2xl">
                <p>No exams currently pending release.</p>
             </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingExams.map(exam => (
                    <ExamReleaseCard key={exam.id} exam={exam} />
                ))}
            </div>
          )}
      </section>

      {/* Already Released Section */}
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