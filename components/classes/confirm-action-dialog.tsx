'use client'

import { useState, useEffect } from "react"
import { RefreshCcw, Archive, X, Loader2, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConfirmActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  actionLabel: string
  onConfirm: () => Promise<void>
  variant?: 'danger' | 'warning' | 'default' // Added 'warning' to distinguish Amber from Red
}

export function ConfirmActionDialog({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  actionLabel, 
  onConfirm,
  variant = 'default'
}: ConfirmActionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setIsMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
      })
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => setIsMounted(false), 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
    onOpenChange(false)
  }

  if (!isMounted) return null

  // Determine colors based on variant
  const getColors = () => {
    switch (variant) {
      case 'danger': // Red (Remove)
        return {
          gradient: "from-red-600 to-red-500",
          iconBg: "bg-red-50 text-red-600",
          button: "bg-red-600 hover:bg-red-700",
          icon: <Trash2 className="h-6 w-6" />
        }
      case 'warning': // Amber (Archive)
        return {
          gradient: "from-amber-600 to-amber-500",
          iconBg: "bg-amber-50 text-amber-600",
          button: "bg-amber-600 hover:bg-amber-700",
          icon: <Archive className="h-6 w-6" />
        }
      default: // Green (Restore/Default)
        return {
          gradient: "from-[#146939] to-[#00954f]",
          iconBg: "bg-[#e6f4ea] text-[#146939]",
          button: "bg-[#146939] hover:bg-[#00954f]",
          icon: <RefreshCcw className="h-6 w-6" />
        }
    }
  }

  const styles = getColors()

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div 
        className={cn(
          "bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-300 ease-out transform",
          isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
        )}
      >
        {/* Top Accent Line */}
        <div className={cn("absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r", styles.gradient)}></div>

        {/* Close Button */}
        <button 
          onClick={() => onOpenChange(false)} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 pt-8 text-center flex flex-col items-center">
          <div className={cn("h-12 w-12 rounded-full flex items-center justify-center mb-4", styles.iconBg)}>
            {styles.icon}
          </div>

          <h3 className="text-xl font-bold font-montserrat text-[#17321A]">{title}</h3>
          <p className="text-sm text-gray-500 font-roboto mt-2 leading-relaxed">
            {description}
          </p>

          <div className="flex w-full gap-3 mt-8">
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="flex-1 text-gray-500 hover:text-[#17321A] hover:bg-gray-100 font-montserrat h-10 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                "flex-1 text-white font-montserrat h-10 shadow-md hover:shadow-lg transition-all rounded-xl cursor-pointer",
                styles.button
              )}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : actionLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}