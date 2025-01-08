import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { message_id, is_hidden } = await request.json()
    
    await db.query(
      "UPDATE messages SET is_hidden = ? WHERE message_id = ?",
      [is_hidden, message_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('切换留言状态失败:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
} 