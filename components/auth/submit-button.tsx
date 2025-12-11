import { Button } from "@/components/ui/button"
import { Loader2, LogIn } from "lucide-react"
import { ComponentProps } from "react"

interface SubmitButtonProps extends ComponentProps<typeof Button> {
  isPending: boolean
  label?: string
}

export function SubmitButton({ isPending, label = "Sign In", className, ...props }: SubmitButtonProps) {
  return (
    <Button 
      type="submit" 
      disabled={isPending}
      className="w-full h-12 text-white text-base font-semibold shadow-lg transition-all duration-300 bg-[#146939] hover:bg-[#00954f] hover:shadow-xl font-montserrat mt-2"
      {...props}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-5 w-5" />
          {label}
        </>
      )}
    </Button>
  )
}