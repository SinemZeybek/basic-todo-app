'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleUpdate(e) {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) setMessage(error.message)
    else {
      setMessage('Password updated successfully! Redirecting...')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold mb-4">Update Password</h1>

      <form onSubmit={handleUpdate} className="flex flex-col gap-3 w-72">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Update Password
        </button>
      </form>

      {message && <p className="text-gray-700 mt-2">{message}</p>}
    </div>
  )
}
