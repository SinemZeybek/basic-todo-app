'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSignup(e) {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Kayıt başarılı! Lütfen e-postanı kontrol et.')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Kayıt Ol</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-3 w-64">
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Kayıt Ol
        </button>
      </form>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  )
}
