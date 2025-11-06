'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleReset(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/update-password',
    })

    if (error) setError(error.message)
    else setMessage('Password reset email sent. Please check your inbox.')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

      <form onSubmit={handleReset} className="flex flex-col gap-3 w-72">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Send Reset Email
        </button>
      </form>

      {message && <p className="text-green-600 mt-2">{message}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}

      <Link href="/login" className="mt-6 text-blue-600 hover:underline text-sm">
        ← Back to Login
      </Link>
    </div>
  )
}
