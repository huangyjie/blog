import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const talks = await db.query(
      "SELECT * FROM talks ORDER BY created_at DESC"
    )
    return NextResponse.json({ talks })
  } catch (error) {
    console.error('获取说说失败:', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { author, title, content, email } = await request.json()
    
    if (!author || !title || !content || !email) {
      return NextResponse.json({ error: '请填写所有必要字段' }, { status: 400 })
    }

    await db.query(
      "INSERT INTO talks (author, title, content, email) VALUES (?, ?, ?, ?)",
      [author, title, content, email]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('发表说说失败:', error)
    return NextResponse.json({ error: '发表失败' }, { status: 500 })
  }
} 