'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error(error)
        router.push('/')
        return
      }

      if (data.role !== 'super_admin') {
        router.push('/')
      } else {
        setRole('super_admin')
      }

      setLoading(false)
    }

    checkRole()
  }, [router])

  if (loading) return <p>Loading...</p>
  if (role !== 'super_admin') return null

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <p>Only administrators can access this page.</p>
    </div>
  )
}

