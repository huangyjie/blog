import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { talk_id } = await request.json()
    
    await db.query(
      "DELETE FROM talks WHERE talk_id = ?",
      [talk_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除说说失败:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
} 