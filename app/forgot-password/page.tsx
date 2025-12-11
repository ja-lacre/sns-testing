'use client'

import { useState } from 'react'
import { sendResetOtp, verifyOtp, updatePassword } from './actions'
import { useRouter } from 'next/navigation'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

// Reusing your components
import { SNSLogo } from "@/components/auth/sns-logo"
import { FormInput } from "@/components/auth/form-input"
import { SubmitButton } from "@/components/auth/submit-button"
// OTP Input Component from shadcn (if available) or standard input
import { Input } from "@/components/ui/input" 

export default function ForgotPasswordPage() {
  const router = useRouter()
  
  // Steps: 1=Email, 2=OTP, 3=New Password, 4=Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  // STEP 1: SEND CODE
  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await sendResetOtp(formData)

    if (result.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      setStep(2)
      setIsPending(false)
    }
  }

  // STEP 2: VERIFY CODE
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const result = await verifyOtp(email, otp)

    if (result.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      setStep(3)
      setIsPending(false)
    }
  }

  // STEP 3: RESET PASSWORD
  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await updatePassword(formData)

    if (result.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      setStep(4)
      setIsPending(false)
      // Redirect to login after 2 seconds
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      
      <Card className="w-full max-w-[340px] sm:max-w-md bg-white border border-gray-200 shadow-xl relative overflow-hidden transition-all duration-300">
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#146939]"></div>

        {/* HEADER */}
        <CardHeader className="space-y-2 text-center pb-4 sm:pb-6 border-b border-gray-100 pt-8">
          <SNSLogo size="lg" />
          
          <div className="mt-2">
            <h2 className="text-xl font-bold text-[#17321A] font-montserrat">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Enter OTP"}
              {step === 3 && "Reset Password"}
              {step === 4 && "Success!"}
            </h2>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-roboto mt-1">
              {step === 1 && "Enter your email to receive a recovery code"}
              {step === 2 && `We sent a 6-digit code to ${email}`}
              {step === 3 && "Create a new strong password"}
              {step === 4 && "Your password has been updated"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-4 sm:pt-6">

          {/* ----- STEP 1: EMAIL ----- */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <FormInput 
                id="email"
                label="Email address"
                type="email"
                placeholder="professor.name@university.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-sm text-red-600 font-roboto">{error}</p>}
              <SubmitButton isPending={isPending} label="Send Code" />
              
              <Button 
                type="button" variant="ghost" className="w-full text-gray-500"
                onClick={() => router.push('/login')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
              </Button>
            </form>
          )}

          {/* ----- STEP 2: OTP ----- */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <label className="text-[#17321A] font-bold font-roboto text-sm">One-Time Password</label>
                <Input 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="h-12 text-center text-lg tracking-[0.5em] font-bold border-gray-200 focus-visible:ring-[#00954f]"
                  maxLength={6}
                />
              </div>
              
              {error && <p className="text-sm text-red-600 font-roboto">{error}</p>}
              
              <SubmitButton isPending={isPending} label="Verify Code" />
              
              <div className="text-center">
                 <button 
                   type="button"
                   onClick={() => setStep(1)}
                   className="text-xs text-[#00954f] hover:underline font-roboto"
                 >
                   Wrong email? Go back.
                 </button>
              </div>
            </form>
          )}

          {/* ----- STEP 3: NEW PASSWORD ----- */}
          {step === 3 && (
            <form onSubmit={handlePasswordReset} className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <FormInput 
                id="password"
                label="New Password"
                type="password"
                placeholder="••••••••"
                required
              />
              <FormInput 
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                required
              />
              
              {error && <p className="text-sm text-red-600 font-roboto">{error}</p>}
              <SubmitButton isPending={isPending} label="Reset Password" />
            </form>
          )}

          {/* ----- STEP 4: SUCCESS ----- */}
          {step === 4 && (
            <div className="text-center py-4 animate-in zoom-in duration-300">
              <div className="mx-auto w-16 h-16 bg-[#00954f]/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#00954f]" />
              </div>
              <p className="text-[#146939] font-semibold font-montserrat">
                Password changed successfully!
              </p>
              <p className="text-xs text-gray-500 mt-2 font-roboto">
                Redirecting to login...
              </p>
            </div>
          )}

        </CardContent>
        
        <CardFooter className="justify-center pb-6 bg-gray-50/50 pt-6 rounded-b-xl">
           <p className="text-xs text-gray-500 font-roboto">Secure Faculty Recovery</p>
        </CardFooter>

      </Card>
    </div>
  )
}