import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const recentExams = [
  { name: "Chemistry Midterm", class: "CHEM-101", date: "Oct 24, 2024", status: "Published" },
  { name: "Biology Pop Quiz", class: "BIO-202", date: "Oct 26, 2024", status: "Draft" },
  { name: "Physics Final", class: "PHY-303", date: "Nov 02, 2024", status: "Scheduled" },
]

export function RecentExamsCard() {
  return (
    <Card className="md:col-span-4 lg:col-span-5 border border-gray-200 shadow-sm bg-white">
      <CardHeader className="border-b border-gray-50 pb-4">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-xl font-bold text-[#17321A] font-montserrat">Recent Exams</CardTitle>
                <CardDescription className="font-roboto text-gray-500 mt-1">Latest exam papers created or modified.</CardDescription>
            </div>
            <Button variant="ghost" className="text-[#00954f] hover:text-[#17321A] hover:bg-[#e6f4ea] font-montserrat text-xs font-semibold cursor-pointer">
                View All
            </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {recentExams.map((exam, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-[#00954f]/30 hover:bg-white hover:shadow-sm transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#17321A] font-bold font-montserrat shadow-sm group-hover:border-[#00954f] group-hover:text-[#00954f] transition-colors">
                    {exam.class.substring(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#17321A] font-montserrat group-hover:text-[#00954f] transition-colors">
                    {exam.name}
                  </p>
                  <p className="text-xs text-gray-500 font-roboto mt-0.5">
                    {exam.class} • <span className="font-medium">{exam.date}</span>
                  </p>
                </div>
              </div>
              <div className={`text-xs px-3 py-1 rounded-full font-semibold font-roboto ${
                exam.status === 'Published' ? 'bg-[#e6f4ea] text-[#146939]' :
                exam.status === 'Draft' ? 'bg-gray-200 text-gray-600' :
                'bg-blue-50 text-blue-700'
              }`}>
                {exam.status}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}