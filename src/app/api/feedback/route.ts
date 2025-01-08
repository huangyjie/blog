import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, message } = await request.json()
    
    if (!email || !message) {
      return NextResponse.json({ error: '请填写所有必要字段' }, { status: 400 })
    }

    await db.query(
      "INSERT INTO feedback (email, message) VALUES (?, ?)",
      [email, message]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('保存反馈失败:', error)
    return NextResponse.json({ error: '提交失败' }, { status: 500 })
  }
} 