import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { category_id, is_hidden } = await request.json()
    
    await db.query(
      "UPDATE app_categories SET is_hidden = ? WHERE category_id = ?",
      [is_hidden, category_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('切换分类状态失败:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
} 