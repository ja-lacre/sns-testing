'use client'

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Sidebar is CLOSED by default on all screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="min-h-screen bg-slate-50 flex font-roboto">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          // Adjust margin: 0 when closed, 64 (16rem) when open
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        )}
      >
        <Header onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}