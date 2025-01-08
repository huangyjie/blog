import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { room_id, is_active } = await request.json()
    
    await db.query(
      "UPDATE chat_rooms SET is_active = ? WHERE room_id = ?",
      [is_active, room_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('切换聊天室状态失败:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
} 