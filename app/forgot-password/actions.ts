'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// 1. Send OTP to Email
export async function sendResetOtp(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  // We use signInWithOtp which sends a code to the email
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // This ensures we get a code, not just a link
      shouldCreateUser: false, 
    }
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// 2. Verify OTP
export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient()

  // Verify the 6-digit code
  const { error, data } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    return { error: "Invalid code. Please try again." }
  }

  // If successful, Supabase automatically logs the user in via session
  return { success: true }
}

// 3. Update Password
export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." }
  }

  // Since verifyOtp logged us in, we can now simply update the user
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}