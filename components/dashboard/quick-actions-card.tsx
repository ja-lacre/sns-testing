import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, CheckCircle, ArrowRight } from "lucide-react"

export function QuickActionsCard() {
  return (
    <Card className="md:col-span-3 lg:col-span-2 bg-[#17321A] text-white border-none shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-[#00954f] rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-[#146939] rounded-full opacity-30 blur-2xl"></div>
      
      <CardHeader className="relative z-10">
        <CardTitle className="font-montserrat text-xl font-bold tracking-wide">Quick Actions</CardTitle>
        <CardDescription className="text-gray-300 font-roboto text-xs border-l-2 border-[#00954f] pl-2 mt-1">Manage your workflow efficiently.</CardDescription>
      </CardHeader>
      
      <CardContent className="grid gap-4 relative z-10">
         <Link href="/dashboard/exams/new" className="w-full">
            <Button className="w-full justify-between bg-white hover:bg-gray-50 text-[#17321A] font-bold font-montserrat h-12 shadow-sm group cursor-pointer">
                Create New Exam 
                <PlusCircle className="h-5 w-5 text-[#00954f] group-hover:scale-110 transition-transform" />
            </Button>
         </Link>
         
         <Link href="/dashboard/results" className="w-full">
            <Button variant="outline" className="w-full justify-between bg-transparent border-gray-600 text-white hover:bg-[#146939] hover:text-white hover:border-[#146939] font-montserrat h-12 cursor-pointer">
                Send Scores 
                <CheckCircle className="h-5 w-5 opacity-70" />
            </Button>
         </Link>

         <Link href="/dashboard/reports" className="w-full">
            <Button variant="ghost" className="w-full justify-start px-0 text-gray-300 hover:text-white hover:bg-transparent font-roboto text-xs uppercase tracking-wider cursor-pointer">
                View Reports <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
         </Link>
      </CardContent>

      <div className="relative z-10 p-6 pt-0">
         <div className="p-3 rounded-lg bg-[#146939]/50 backdrop-blur-sm border border-[#146939]">
            <h4 className="font-bold text-xs mb-1 font-montserrat text-[#00954f] flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00954f] mr-2"></span>
                Tip of the day
            </h4>
            <p className="text-[10px] text-gray-200 font-roboto leading-relaxed opacity-90">
                Bulk-import student scores using CSV format in the Students tab to save time.
            </p>
         </div>
      </div>
    </Card>
  )
}