'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export function TimeWidget() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!time) return null

  return (
    <div className="bg-gradient-to-b from-[#146939] to-[#17321A] rounded-xl p-6 text-white shadow-lg flex items-center justify-between relative overflow-hidden min-w-[260px] transition-all hover:shadow-xl">
      {/* Background Decoration */}
      <Clock className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
      
      <div className="relative z-10">
        <h2 className="text-sm font-medium text-white/80 font-roboto uppercase tracking-wider">
          Current Session
        </h2>
        <div className="mt-1">
          <p className="text-3xl sm:text-4xl font-bold font-montserrat tabular-nums tracking-tight">
            {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
          </p>
          <p className="text-white/90 font-medium font-roboto mt-1 text-sm">
            {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}