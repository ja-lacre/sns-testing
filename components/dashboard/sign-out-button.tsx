'use client'

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { LogOut, X, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SignOutButtonProps {
  className?: string
  children?: React.ReactNode
}

export function SignOutButton({ className, children }: SignOutButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Animation handling for the portal
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setIsVisible(true))
    } else {
      setIsVisible(false)
    }
  }, [open])

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login') 
  }

  // Handle closing with animation delay
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => setOpen(false), 500) // Match duration
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:bg-gray-50 hover:text-[#17321A] transition-all rounded-xl group font-montserrat font-medium text-sm cursor-pointer",
          className
        )}
      >
        {children || (
          <>
            <LogOut className="h-5 w-5 group-hover:text-[#146939] transition-colors" />
            Sign Out
          </>
        )}
      </button>

      {open && mounted && createPortal(
        <div className={cn(
            "fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out",
            isVisible ? "opacity-100" : "opacity-0"
        )}>
          <div className={cn(
              "bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform mx-4",
              isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-90 translate-y-8 opacity-0"
          )}>
            
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-500"></div>

            <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
            >
                <X className="h-4 w-4" />
            </button>

            <div className="p-6 pt-8 text-center flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                    <LogOut className="h-6 w-6 ml-1" />
                </div>

                <h3 className="text-xl font-bold font-montserrat text-[#17321A]">Sign Out</h3>
                <p className="text-sm text-gray-500 font-roboto mt-2">
                    Are you sure you want to sign out of your account?
                </p>

                <div className="flex w-full gap-3 mt-8">
                    <Button 
                        variant="ghost" 
                        onClick={handleClose}
                        className="flex-1 font-montserrat h-10 rounded-xl text-gray-600 hover:text-[#17321A] hover:bg-gray-100 cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSignOut}
                        disabled={loading}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-montserrat h-10 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Out"}
                    </Button>
                </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}