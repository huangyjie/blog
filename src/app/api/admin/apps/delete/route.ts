import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { app_id } = await request.json()
    
    await db.query(
      "DELETE FROM apps WHERE app_id = ?",
      [app_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除应用失败:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
} 