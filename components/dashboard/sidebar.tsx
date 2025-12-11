'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, GraduationCap, FileSpreadsheet, LogOut, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Classes", href: "/dashboard/classes", icon: BookOpen },
  { label: "Students", href: "/dashboard/students", icon: Users },
  { label: "Exams", href: "/dashboard/exams", icon: GraduationCap },
  { label: "Send Results", href: "/dashboard/results", icon: FileSpreadsheet },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
    
    router.push("/login")
    router.refresh()
  }

  return (
    <>
      {/* Backdrop for Mobile Only */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-[#146939] to-[#17321A] text-white transition-transform duration-300 ease-in-out flex flex-col shadow-2xl border-r border-[#146939]",
          // Slide completely in or out based on isOpen state
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        
        {/* --- Header Section --- */}
        <div className="p-8 border-b border-[#146939]/50 flex flex-col items-center justify-center relative overflow-hidden group">
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#00954f] rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-700"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="p-3 bg-[#146939]/30 rounded-2xl border border-[#146939] shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <LayoutDashboard className="h-8 w-8 text-[#00954f]" />
              </div>
              <div className="text-center">
                  <h1 className="font-trajan text-3xl font-bold tracking-[0.15em] text-white leading-tight">
                      SNS
                  </h1>
                  <p className="text-[10px] text-[#00954f] font-montserrat uppercase tracking-[0.25em] font-bold mt-1">
                      Teacher Portal
                  </p>
              </div>
          </div>
        </div>

        {/* --- Navigation --- */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                // Auto-close on mobile when clicking a link
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onClose()
                  }
                }}
                className={cn(
                  "flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 group font-montserrat relative cursor-pointer overflow-hidden",
                  // Hover Effects: Float up slightly and move right
                  "hover:-translate-y-0.5 hover:translate-x-1 hover:shadow-lg",
                  isActive 
                    ? "bg-gradient-to-r from-[#00954f] to-[#146939] text-white shadow-md shadow-[#00954f]/20" 
                    : "text-gray-400 hover:bg-[#146939]/40 hover:text-white"
                )}
              >
                {/* Active Indicator Line */}
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/30 rounded-r-full" />
                )}

                <item.icon className={cn(
                    "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110", 
                    isActive ? "text-white" : "text-gray-500 group-hover:text-[#00954f]"
                )} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* --- Footer / Sign Out --- */}
        <div className="p-4 border-t border-[#146939]/50 bg-[#146939]/10">
          <button 
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-xl transition-all duration-300 group font-montserrat cursor-pointer hover:shadow-inner"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Sign Out</span>
          </button>
          <p className="text-[10px] text-white text-center mt-3 font-roboto opacity-60">
              © 2025 CSci 153 Project - Jonhei Akiu Lacre
          </p>
        </div>
      </aside>
    </>
  )
}