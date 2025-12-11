import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  // Double check user on server side
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen p-8 font-sans">
      <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
      <p className="mt-4">You are now logged in to the dashboard.</p>
      
      {/* Temporary Logout Button */}
      <form action="/auth/signout" method="post" className="mt-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Sign Out
        </button>
      </form>
    </div>
  )
}