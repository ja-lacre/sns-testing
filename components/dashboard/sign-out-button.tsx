'use client'

import { useState } from "react"
import { LogOut, X, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login') 
  }

  return (
    <>
      {/* The Sidebar Button */}
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:bg-gray-50 hover:text-[#17321A] transition-all rounded-xl group font-montserrat font-medium text-sm cursor-pointer"
      >
        <LogOut className="h-5 w-5 group-hover:text-[#146939] transition-colors" />
        Sign Out
      </button>

      {/* The Confirmation Popup */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 scale-100">
            
            {/* Top Accent Line (Amber for Log Out action) */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-500"></div>

            {/* Close Button */}
            <button 
                onClick={() => setOpen(false)}
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
                        onClick={() => setOpen(false)}
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
        </div>
      )}
    </>
  )
}