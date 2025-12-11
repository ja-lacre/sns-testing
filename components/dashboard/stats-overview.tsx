import { Users, FileWarning, BookOpenCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    color: "text-[#00954f]",
    bg: "bg-[#e6f4ea]",
  },
  {
    title: "Exams Managed",
    value: "12",
    description: "3 exams scheduled this week",
    icon: BookOpenCheck,
    color: "text-[#17321A]",
    bg: "bg-[#e6f4ea]",
  },
]

export function StatsOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          // Updated hover classes: -translate-y-2 and hover:shadow-xl
          className="border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ease-out bg-white group overflow-hidden relative cursor-pointer hover:-translate-y-2"
        >
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-[#146939] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold font-montserrat text-[#17321A] uppercase tracking-wide">
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