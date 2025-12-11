'use client'

import { useEffect, useState } from "react"
import { UserCircle, Menu, LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { cn } from "@/lib/utils"
import { SignOutButton } from "@/components/dashboard/sign-out-button" // Import the component

interface HeaderProps {
  onToggle: () => void
  isSidebarOpen: boolean
}

export function Header({ onToggle, isSidebarOpen }: HeaderProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email ?? null)
      }
    }
    getUser()
  }, [supabase])

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
      
      <div className="flex items-center gap-3">
        {/* Unified Hamburger Menu for Mobile & Desktop */}
        <button 
          onClick={onToggle}
          className={cn(
            "p-2 -ml-2 rounded-md transition-all duration-200",
            "text-gray-600 hover:text-[#146939] hover:bg-[#e6f4ea] active:bg-[#d1e7dd]",
            // Optional: Highlight if sidebar is open
            isSidebarOpen && "bg-[#e6f4ea] text-[#146939]"
          )}
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Right Side: User Info & Sign Out */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 sm:pl-4 sm:border-l sm:border-gray-100">
          
          <div className="text-right flex flex-col items-end">
            <p className="text-[10px] sm:text-sm font-semibold text-[#17321A] font-montserrat leading-tight">
              Logged in as:
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 font-roboto truncate max-w-[120px] sm:max-w-[200px]">
              {userEmail || 'Loading...'}
            </p>
          </div>
          
          <UserCircle className="w-8 h-8 sm:w-9 sm:h-9 text-[#00954f]" />

          {/* Replaced manual button with SignOutButton component */}
          <SignOutButton 
            className="flex items-center justify-center p-0 w-auto h-auto bg-transparent hover:bg-red-50 text-red-500 hover:text-red-700 rounded-md transition-colors h-8 w-8 sm:h-9 sm:w-9"
          >
             <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </SignOutButton>

        </div>
      </div>
    </header>
  )
}