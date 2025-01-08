import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [room] = await db.query(
      `SELECT * FROM chat_rooms 
       WHERE room_id = ? AND is_active = true`,
      [params.id]
    ) as any[]

    if (!room) {
      return NextResponse.json(
        { error: '聊天室不存在或已关闭' },
        { status: 404 }
      )
    }

    return NextResponse.json({ room })
  } catch (error) {
    console.error('获取聊天室失败:', error)
    return NextResponse.json(
      { error: '获取聊天室失败' },
      { status: 500 }
    )
  }
} 