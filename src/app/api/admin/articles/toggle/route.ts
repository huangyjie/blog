import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { id } = await request.json()

    // 切换可见性
    await db.query(
      `UPDATE articles 
       SET is_visible = NOT is_visible 
       WHERE id = ?`,
      [id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('切换文章可见性失败:', error)
    return NextResponse.json(
      { error: '操作失败' },
      { status: 500 }
    )
  }
} 