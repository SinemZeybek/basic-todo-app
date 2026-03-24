import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'
import { validateTodoPayload } from '../../../utils/todoEndpointLogic'

// GET - Fetch todos for logged-in user
export async function GET(request) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET /api/todos]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add a new todo
export async function POST(request) {
  try {
    const body = await request.json()

    // Validate the payload using shared validation utility
    const validation = validateTodoPayload(body)
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { title } = body

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title: title.trim(), user_id: user.id }])
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data[0])
  } catch (err) {
    console.error('[POST /api/todos]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Toggle completion
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { id, is_complete } = body

    if (!id || typeof is_complete !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid payload: id and is_complete (boolean) are required' },
        { status: 400 }
      )
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('todos')
      .update({ is_complete })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data[0])
  } catch (err) {
    console.error('[PATCH /api/todos]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Remove todo
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing required parameter: id' }, { status: 400 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/todos]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
