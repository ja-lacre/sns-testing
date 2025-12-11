'use client'

import { useActionState } from 'react'
import { login } from './actions'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2, GraduationCap, LogIn } from "lucide-react"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
    return await login(formData)
  }, null)

  return (
    // CHANGE 1: Darker background (Slate-100) provides better contrast for the white card
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      
      {/* CHANGE 2: Added 'border-gray-200' for definition and a specific 'shadow-xl' */}
      <Card className="w-full max-w-[340px] sm:max-w-md bg-white border border-gray-200 shadow-xl relative overflow-hidden">
        
        {/* Optional: A very subtle top accent line to tie in the green theme */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#146939]"></div>

        <CardHeader className="space-y-2 text-center pb-6 sm:pb-8 border-b border-gray-100 pt-8">
          
          <div className="flex justify-center mb-2">
            <div className="p-3 sm:p-4 rounded-full bg-[#00954f]/10 mb-2">
              <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-[#00954f]" />
            </div>
          </div>

          <CardTitle className="text-4xl sm:text-5xl font-bold tracking-tight text-[#17321A] font-trajan">
            SNS
          </CardTitle>
          
          <CardDescription className="text-base sm:text-lg font-semibold text-[#146939] font-montserrat">
             Exam Result Notification System
          </CardDescription>
           <CardDescription className="text-xs sm:text-sm text-gray-500 font-roboto">
            Please sign in to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 sm:pt-8">
          <form action={formAction} className="space-y-4 sm:space-y-5">
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#17321A] font-bold font-roboto text-sm sm:text-base">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@example.com"
                required
                // Added a slight background to inputs to differentiate them from the card white
                className="h-12 bg-gray-50 border-gray-200 focus-visible:bg-white focus-visible:ring-[#00954f] focus-visible:border-[#00954f] font-roboto text-base transition-colors" 
              />
            </div>

            <div className="space-y-2">
               <div className="flex items-center justify-between">
                <Label htmlFor="password"className="text-[#17321A] font-bold font-roboto text-sm sm:text-base">
                  Password
                </Label>
                <a href="#" className="text-xs sm:text-sm font-medium text-[#00954f] hover:underline font-roboto">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="h-12 bg-gray-50 border-gray-200 focus-visible:bg-white focus-visible:ring-[#00954f] focus-visible:border-[#00954f] font-roboto text-base transition-colors"
              />
            </div>

            {state?.error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200 font-medium font-roboto">
                {state.error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-white text-base font-semibold shadow-lg transition-all duration-300 bg-[#146939] hover:bg-[#00954f] hover:shadow-xl font-montserrat mt-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>

          </form>
        </CardContent>
        
        <CardFooter className="justify-center pb-6 sm:pb-8 bg-gray-50/50 border-t pt-6 rounded-b-xl">
          <p className="text-xs text-gray-500 text-center font-roboto px-4">
            Secure Institutional Access. <br className="hidden sm:block"/>
            Is data incorrect? <a href="#" className="text-[#00954f] hover:underline font-medium whitespace-nowrap">Contact Registry.</a>
          </p>
        </CardFooter>

      </Card>
    </div>
  )
}