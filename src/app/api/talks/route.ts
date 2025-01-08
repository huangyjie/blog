import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const talks = await db.query(
      "SELECT * FROM talks WHERE is_hidden = 0 ORDER BY created_at DESC"
    )
    return NextResponse.json(talks)
  } catch (error) {
    console.error('获取说说失败:', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
} 