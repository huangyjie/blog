import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const messages = await db.query(
      `SELECT * FROM messages 
       ORDER BY created_at DESC`
    )
    return NextResponse.json({ messages })
  } catch (error) {
    console.error('获取留言失败:', error)
    return NextResponse.json(
      { error: '获取留言失败' },
      { status: 500 }
    )
  }
} 