'use client'

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function TimeWidget() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Avoid hydration mismatch by rendering nothing until mounted
  if (!time) return null

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-[200px] justify-between transition-all hover:border-[#00954f]/30">
      <div className="p-3 bg-[#e6f4ea] rounded-full text-[#146939]">
        <Clock className="h-5 w-5" />
      </div>
      <div className="flex flex-col items-end text-right">
        <div className="text-3xl font-bold text-[#17321A] font-montserrat tabular-nums tracking-tight">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
        <div className="text-sm font-medium text-[#00954f] font-roboto uppercase tracking-wider">
          {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  )
}