'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function TodosPage() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    setLoading(true)
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError({ message: 'Please log in to view your to-do list.' })
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) setError(error)
    else setTodos(data)

    setLoading(false)
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">My To-Do List</h1>

      {/* Add New To-Do */}
      <form onSubmit={async (e) => {
        e.preventDefault()
        if (!newTodo.trim()) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return setError({ message: 'You must be logged in.' })

        const { error } = await supabase
          .from('todos')
          .insert([{ title: newTodo, user_id: user.id }])
        if (error) setError(error)
        else {
          setNewTodo('')
          fetchTodos()
        }
      }} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      {/* List To-Dos */}
      <ul className="w-full max-w-md">
        {todos.length === 0 && <p>No tasks yet.</p>}
        {todos.map((todo) => (
          <li key={todo.id} className="flex justify-between items-center border-b py-2">
            <span
              onClick={async () => {
                const { error } = await supabase
                  .from('todos')
                  .update({ is_complete: !todo.is_complete })
                  .eq('id', todo.id)
                if (error) setError(error)
                else fetchTodos()
              }}
              className={`cursor-pointer ${todo.is_complete ? 'line-through text-gray-500' : ''}`}
            >
              {todo.title}
            </span>
            <button
              onClick={async () => {
                const { error } = await supabase
                  .from('todos')
                  .delete()
                  .eq('id', todo.id)
                if (error) setError(error)
                else fetchTodos()
              }}
              className="text-red-500 hover:underline text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
