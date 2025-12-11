import { ScrollText } from "lucide-react"

interface SNSLogoProps {
  size?: "sm" | "lg"
}

export function SNSLogo({ size = "lg" }: SNSLogoProps) {
  const isLarge = size === "lg"
  
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className={`rounded-full bg-[#00954f]/10 flex items-center justify-center mb-2 ${isLarge ? "p-3 sm:p-4" : "p-2"}`}>
        <ScrollText className={`text-[#00954f] ${isLarge ? "w-8 h-8 sm:w-10 sm:h-10" : "w-6 h-6"}`} />
      </div>
      
      <h1 className={`font-bold tracking-tight text-[#146939] font-trajan ${isLarge ? "text-4xl sm:text-5xl" : "text-2xl"}`}>
        SNS
      </h1>
      
      {isLarge && (
        <p className="text-base sm:text-lg font-semibold text-[#146939] font-montserrat mt-1">
          Exam Result Notification System
        </p>
      )}
    </div>
  )
}