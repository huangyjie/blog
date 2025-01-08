import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// 获取聊天室消息
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const messages = await db.query(
      `SELECT * FROM chat_messages 
       WHERE room_id = ? 
       ORDER BY created_at ASC 
       LIMIT 100`,
      [params.id]
    )
    return NextResponse.json({ messages })
  } catch (error) {
    console.error('获取消息失败:', error)
    return NextResponse.json(
      { error: '获取消息失败' },
      { status: 500 }
    )
  }
}

// 发送新消息
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { sender_name, content, type = 'text' } = await request.json()

    if (!sender_name || !content) {
      return NextResponse.json(
        { error: '发送者和内容不能为空' },
        { status: 400 }
      )
    }

    // 检查聊天室是否存在且开启
    const [room] = await db.query(
      "SELECT room_id FROM chat_rooms WHERE room_id = ? AND is_active = true",
      [params.id]
    ) as any[]

    if (!room) {
      return NextResponse.json(
        { error: '聊天室不存在或已关闭' },
        { status: 404 }
      )
    }

    // 插入消息
    const result = await db.query(
      `INSERT INTO chat_messages (room_id, sender_name, content, type) 
       VALUES (?, ?, ?, ?)`,
      [params.id, sender_name, content, type]
    ) as any

    console.log('消息插入结果:', result)

    // 返回新消息
    const [newMessage] = await db.query(
      "SELECT * FROM chat_messages WHERE message_id = ?",
      [result.insertId]
    ) as any[]

    return NextResponse.json({
      success: true,
      message: newMessage
    })
  } catch (error) {
    console.error('发送消息失败:', error)
    return NextResponse.json(
      { error: '发送消息失败' },
      { status: 500 }
    )
  }
} 