'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Loading from '../../../components/Loading'
import ErrorMessage from '../../../components/ErrorMessage'

export default function AdminUsersPage() {
 const router = useRouter()
 const [users, setUsers] = useState([])
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState(null)

  useEffect(() => {
    checkAccessAndFetchUsers()
  }, [])

  async function checkAccessAndFetchUsers() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // check if current user is super_admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

      if (profileError || profile.role !== 'super_admin') {
        setLoading(false)
        router.push('/')
        return
    }
      

    // fetch all users and their todo counts
    const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, role')
  
  if (profilesError) {
    console.error(profilesError)
    setError(profilesError)
    setLoading(false)
    return
  }
  const results = []
  for (const p of profiles) {
    const { count, error: countError } = await supabase
      .from('todos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', p.id)
  
    if (countError) {
      console.error(countError)
      continue
    }
  
    results.push({
      ...p,
      todo_count: count || 0,
    })
  }
    setUsers(results)
    setLoading(false)
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <table className="border-collapse w-full max-w-3xl">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">User ID</th>
            <th className="border p-2 text-left">Role</th>
            <th className="border p-2 text-center">To-Do Count</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="border p-2 text-sm">{u.id}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2 text-center">{u.todos?.[0]?.count || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
