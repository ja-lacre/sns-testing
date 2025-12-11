import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ComponentProps } from "react"

interface FormInputProps extends ComponentProps<"input"> {
  label: string
  id: string
}

export function FormInput({ label, id, className, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className="text-[#17321A] font-bold font-roboto text-sm sm:text-base"
      >
        {label}
      </Label>
      <Input
        id={id}
        name={id}
        className="h-12 bg-gray-50 border-gray-200 focus-visible:bg-white focus-visible:ring-[#00954f] focus-visible:border-[#00954f] font-roboto text-base transition-colors"
        {...props}
      />
    </div>
  )
}