import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = await createClient()

  // Check if a user session exists
  const { data: { user } } = await supabase.auth.getUser()

  // Logic: If user exists, go to Dashboard. Otherwise, go to Login.
  if (user) {
    return redirect("/dashboard")
  } else {
    return redirect("/login")
  }
}