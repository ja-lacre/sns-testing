'use client'

import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, BookOpen, FileText, BarChart2, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignOutButton } from "@/components/dashboard/sign-out-button"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (value: boolean | ((prev: boolean) => boolean)) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/students", label: "Students", icon: Users },
    { href: "/dashboard/classes", label: "Classes", icon: BookOpen },
    { href: "/dashboard/exams", label: "Exams", icon: FileText },
    { href: "/dashboard/results", label: "Send Results", icon: BarChart2 },
  ]

  return (
    <>
      {/* --- Mobile Backdrop (Blur Effect) --- */}
      {/* This only shows on mobile (lg:hidden) when the sidebar is open */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)} // Close sidebar when tapping the blurred area
      />

      {/* --- Sidebar Aside --- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-[#17321A] text-white transition-all duration-300 ease-in-out shadow-xl flex flex-col",
          // Mobile: -translate-x-full (hidden) when closed. Desktop: Always visible (width changes)
          isOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-center border-b border-[#146939]/30 gap-2 overflow-hidden">
          {/* Logo Icon */}
          <LayoutDashboard className="h-6 w-6 text-[#4ade80] shrink-0" />
          
          {/* Logo Text - "SNS" (Hidden in mini mode) */}
          <div className={cn(
            "font-montserrat font-bold text-xl transition-all duration-300 whitespace-nowrap",
            isOpen ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
          )}>
            SNS
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  // Auto-close on mobile when a link is clicked
                  if (window.innerWidth < 1024) {
                     setIsOpen(false) 
                  }
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-[#146939] text-white shadow-md" 
                    : "text-gray-300 hover:bg-[#146939]/50 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0 transition-transform", !isOpen && "mx-auto")} />
                
                <span className={cn(
                  "font-montserrat font-medium whitespace-nowrap transition-all duration-300",
                  isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute left-14 hidden lg:block pointer-events-none"
                )}>
                  {link.label}
                </span>

                {/* Tooltip for Mini Sidebar (Desktop only) */}
                {!isOpen && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap hidden lg:block">
                    {link.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer / Sign Out */}
        <div className="p-4 border-t border-[#146939]/30">
           <SignOutButton className={cn(
               "text-gray-300 hover:bg-[#146939]/50 hover:text-white justify-start w-full",
               !isOpen && "justify-center px-0"
           )}>
               {!isOpen ? <LogOutIconOnly /> : null}
           </SignOutButton>
        </div>
      </aside>
    </>
  )
}

// Icon wrapper for mini-state sign out
function LogOutIconOnly() {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" height="20" 
            viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="2" 
            strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
    )
}