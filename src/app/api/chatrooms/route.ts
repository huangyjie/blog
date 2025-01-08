import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const rooms = await db.query(
      `SELECT * FROM chat_rooms 
       WHERE is_active = true 
       ORDER BY created_at DESC`
    )
    return NextResponse.json({ rooms })
  } catch (error) {
    console.error('获取聊天室列表失败:', error)
    return NextResponse.json(
      { error: '获取聊天室列表失败' },
      { status: 500 }
    )
  }
} 