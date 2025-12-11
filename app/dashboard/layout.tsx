'use client'

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // 1. Load preference from Local Storage on mount
  useEffect(() => {
    setIsMounted(true)
    const savedState = localStorage.getItem("sidebarOpen")
    if (savedState !== null) {
      setIsSidebarOpen(JSON.parse(savedState))
    }
  }, [])

  // 2. Save preference whenever it changes
  const setSidebarState = (value: boolean | ((prev: boolean) => boolean)) => {
    setIsSidebarOpen((prev) => {
      const newState = typeof value === 'function' ? value(prev) : value
      localStorage.setItem("sidebarOpen", JSON.stringify(newState))
      return newState
    })
  }

  const toggleSidebar = () => setSidebarState((prev) => !prev)

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarState} 
      />

      {/* Main Content Area (Header is inside here) */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        <Header onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}