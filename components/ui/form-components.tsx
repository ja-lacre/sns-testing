'use client'

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Calendar, ChevronDown } from "lucide-react"

// --- Custom Select Component ---
interface Option {
  label: string
  value: string
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[]
  placeholder?: string
  icon?: React.ReactNode
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, options, placeholder, icon, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full pl-3 pr-10 py-2 text-sm border border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] bg-gray-50/50 rounded-xl h-11 appearance-none cursor-pointer text-[#17321A] outline-none font-roboto shadow-sm transition-all",
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Icon Overlay */}
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
          {icon || <ChevronDown className="w-4 h-4" />}
        </div>
      </div>
    )
  }
)
FormSelect.displayName = "FormSelect"


// --- Custom Date Picker Component ---
interface FormDatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const FormDatePicker = forwardRef<HTMLInputElement, FormDatePickerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative group">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#146939] transition-colors pointer-events-none" />
        <input
          type="date"
          ref={ref}
          className={cn(
            "pl-9 pr-3 w-full border-gray-200 focus:border-[#00954f] focus:ring-[#00954f] bg-gray-50/50 rounded-xl h-11 font-roboto text-[#17321A] outline-none shadow-sm transition-all accent-[#146939] uppercase text-sm tracking-wide",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
FormDatePicker.displayName = "FormDatePicker"