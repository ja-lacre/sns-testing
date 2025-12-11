'use server'

import { createClient } from '@/utils/supabase/server'

// 1. Step One: Verify Email & Extract Name
export async function verifyEmail(formData: FormData) {
  const email = formData.get('email') as string
  
  // Basic validation
  if (!email || !email.includes('@')) {
    return { error: "Please enter a valid academic email address." }
  }

  // LOGIC: Extract First Name from Email
  // Example: "john.doe@university.edu" -> "john" -> "John"
  // Example: "sarah@school.edu" -> "sarah" -> "Sarah"
  
  const localPart = email.split('@')[0]; // Get part before @
  const rawName = localPart.split('.')[0]; // Get part before the first dot (if any)
  
  // Capitalize the first letter
  const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return { success: true, name: firstName }
}

// 2. Step Two: Actual Login (Unchanged)
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: "Invalid credentials. Please try again." }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}