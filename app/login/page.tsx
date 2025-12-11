'use client'

import { useActionState } from 'react'
import { login } from './actions'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

// Import our new reusable components
import { SNSLogo } from "@/components/auth/sns-logo"
import { FormInput } from "@/components/auth/form-input"
import { SubmitButton } from "@/components/auth/submit-button"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
    return await login(formData)
  }, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      
      <Card className="w-full max-w-[340px] sm:max-w-md bg-white border border-gray-200 shadow-xl relative overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#146939]"></div>

        <CardHeader className="space-y-2 text-center pb-6 sm:pb-8 border-b border-gray-100 pt-8">
          <SNSLogo size="lg" />
          <CardDescription className="text-xs sm:text-sm text-gray-500 font-roboto mt-2">
            Please sign in to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 sm:pt-8">
          <form action={formAction} className="space-y-4 sm:space-y-5">
            
            <FormInput 
              id="email"
              label="Email address"
              type="email"
              placeholder="student@example.com"
              required
            />

            <div className="space-y-2">
               {/* We keep the password wrapper manual because of the 'Forgot Password' link */}
               <div className="flex items-center justify-between">
                 <label htmlFor="password" className="text-[#17321A] font-bold font-roboto text-sm sm:text-base">
                   Password
                 </label>
                <a href="#" className="text-xs sm:text-sm font-medium text-[#00954f] hover:underline font-roboto">
                  Forgot password?
                </a>
              </div>
              
              {/* Reuse the input styling logic directly if needed, or just use the component without label */}
              <FormInput 
                 id="password"
                 label="" // Empty label trick or just manually use the Input component
                 type="password"
                 placeholder="••••••••"
                 required
                 className="-mt-2" // slight adjustment since we handled label above
              />
            </div>

            {state?.error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200 font-medium font-roboto">
                {state.error}
              </div>
            )}

            <SubmitButton isPending={isPending} />

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