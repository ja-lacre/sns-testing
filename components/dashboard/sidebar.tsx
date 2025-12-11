'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, GraduationCap, FileSpreadsheet, LogOut, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client" // Import Supabase client

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Classes", href: "/dashboard/classes", icon: BookOpen },
  { label: "Students", href: "/dashboard/students", icon: Users },
  { label: "Exams", href: "/dashboard/exams", icon: GraduationCap },
  { label: "Send Results", href: "/dashboard/results", icon: FileSpreadsheet },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Handler for signing out
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
    
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full md:translate-x-0 bg-[#17321A] text-white transition-transform duration-300 flex flex-col">
      <div className="p-6 border-b border-[#146939] flex flex-col items-center">
        <h1 className="font-trajan text-2xl font-bold tracking-[0.2em] text-white">SNS</h1>
        <p className="text-[10px] text-[#00954f] font-montserrat uppercase tracking-[0.2em] font-semibold mt-1">
          Teacher Portal
        </p>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              // Added 'cursor-pointer' here
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group font-montserrat cursor-pointer",
                isActive 
                  ? "bg-[#00954f] text-white shadow-md" 
                  : "text-gray-300 hover:bg-[#146939] hover:text-white"
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#146939]">
        <button 
          onClick={handleSignOut}
          // Added 'cursor-pointer' here
          className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-900/30 hover:text-red-200 rounded-lg transition-colors font-montserrat cursor-pointer"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}