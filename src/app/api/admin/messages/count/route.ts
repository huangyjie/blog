import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const result = await db.query(
      'SELECT COUNT(*) as count FROM messages'
    )
    
    const count = result[0].count
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('获取留言数量失败:', error)
    return NextResponse.json(
      { error: '获取留言数量失败' },
      { status: 500 }
    )
  }
}