'use client'

import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login') // çıkıştan sonra login sayfasına yönlendir
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-bold">Hoş geldin! 🎉</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Çıkış Yap
      </button>
    </div>
  )
}
