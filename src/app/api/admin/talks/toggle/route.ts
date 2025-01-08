import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { talk_id, is_hidden } = await request.json()
    
    await db.query(
      "UPDATE talks SET is_hidden = ? WHERE talk_id = ?",
      [is_hidden, talk_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('切换说说状态失败:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
} 