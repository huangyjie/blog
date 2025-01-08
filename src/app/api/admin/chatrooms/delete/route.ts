import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { room_id } = await request.json()
    
    // 先删除聊天室的所有消息
    await db.query(
      "DELETE FROM chat_messages WHERE room_id = ?",
      [room_id]
    )

    // 删除聊天室
    await db.query(
      "DELETE FROM chat_rooms WHERE room_id = ?",
      [room_id]
    )

    // 重置自增ID
    await db.query("ALTER TABLE chat_rooms AUTO_INCREMENT = 1")
    await db.query("ALTER TABLE chat_messages AUTO_INCREMENT = 1")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除聊天室失败:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
} 