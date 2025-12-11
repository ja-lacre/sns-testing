import { Users, FileWarning, GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// You can move this mock data to a separate 'data.ts' file later if you want
const stats = [
  {
    title: "Total Students",
    value: "142",
    description: "Across 4 active classes",
    icon: Users,
    color: "text-[#146939]",
    bg: "bg-[#e6f4ea]", 
  },
  {
    title: "Pending Results",
    value: "28",
    description: "From yesterday's Biology quiz",
    icon: FileWarning,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Exams Managed",
    value: "12",
    description: "3 exams scheduled this week",
    icon: GraduationCap,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
]

export function StatsOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-white group overflow-hidden relative cursor-pointer">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-[#146939] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold font-montserrat text-gray-600 uppercase tracking-wide">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bg} transition-colors group-hover:bg-[#17321A] group-hover:text-white`}>
              <stat.icon className={`h-4 w-4 ${stat.color} group-hover:text-white`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-montserrat text-[#17321A]">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1 font-roboto font-medium">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}