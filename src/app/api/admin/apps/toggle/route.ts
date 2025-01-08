import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { app_id, is_hidden } = await request.json()
    
    await db.query(
      "UPDATE apps SET is_hidden = ? WHERE app_id = ?",
      [is_hidden, app_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('切换应用状态失败:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
} 