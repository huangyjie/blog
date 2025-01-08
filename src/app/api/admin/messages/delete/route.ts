import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { message_id } = await request.json()
    
    await db.query(
      "DELETE FROM messages WHERE message_id = ?",
      [message_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除留言失败:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
} 