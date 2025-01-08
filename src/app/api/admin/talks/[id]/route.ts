import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { author, title, content, email } = await request.json()
    
    if (!author || !title || !content || !email) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
        { status: 400 }
      )
    }

    await db.query(
      `UPDATE talks 
       SET author = ?, title = ?, content = ?, email = ? 
       WHERE talk_id = ?`,
      [author, title, content, email, params.id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新说说失败:', error)
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    )
  }
} 