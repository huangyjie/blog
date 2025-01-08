import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// 获取反馈列表
export async function GET() {
  try {
    const feedbacks = await query(
      'SELECT * FROM feedback ORDER BY created_at DESC'
    )
    return NextResponse.json(feedbacks)
  } catch (error) {
    console.error('获取反馈失败:', error)
    return NextResponse.json(
      { error: '获取反馈失败' },
      { status: 500 }
    )
  }
}

// 删除反馈
export async function DELETE(request: Request) {
  try {
    const { feedback_id } = await request.json()

    if (!feedback_id) {
      return NextResponse.json(
        { error: '反馈ID不能为空' },
        { status: 400 }
      )
    }

    await query(
      'DELETE FROM feedback WHERE feedback_id = ?',
      [feedback_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除反馈失败:', error)
    return NextResponse.json(
      { error: '删除反馈失败' },
      { status: 500 }
    )
  }
}

// 提交反馈
export async function POST(request: Request) {
  try {
    const { email, message } = await request.json()

    if (!email || !message) {
      return NextResponse.json(
        { error: '邮箱和反馈内容不能为空' },
        { status: 400 }
      )
    }

    const result = await query(
      'INSERT INTO feedback (email, message) VALUES (?, ?)',
      [email, message]
    ) as any

    return NextResponse.json({
      feedback_id: result.insertId,
      email,
      message,
      created_at: new Date(),
      is_read: false
    })
  } catch (error) {
    console.error('提交反馈失败:', error)
    return NextResponse.json(
      { error: '提交反馈失败' },
      { status: 500 }
    )
  }
} 