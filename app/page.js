'use client'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'


export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <nav className="flex gap-4 text-blue-600 underline">
        <Link href="/todos">My To-Do List</Link>
        <Link href="/admin/users">Admin</Link>
      </nav>

      <h1 className="text-3xl font-bold">Welcome! 🎉</h1>
      <p className="text-gray-600">You are logged in to your account.</p>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  )
}