import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { message_id, sender_name } = await request.json()

    // 验证消息存在且是发送者本人
    const [message] = await db.query(
      `SELECT * FROM chat_messages 
       WHERE message_id = ? AND room_id = ? AND sender_name = ?`,
      [message_id, params.id, sender_name]
    ) as any[]

    if (!message) {
      return NextResponse.json(
        { error: '无权撤回此消息' },
        { status: 403 }
      )
    }

    // 删除消息
    await db.query(
      "DELETE FROM chat_messages WHERE message_id = ?",
      [message_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('撤回消息失败:', error)
    return NextResponse.json(
      { error: '撤回失败' },
      { status: 500 }
    )
  }
} 