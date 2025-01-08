import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { escapeHtml, isValidEmail, validateContent } from '@/lib/security'

// 获取留言列表
export async function GET() {
  try {
    const messages = await db.query(
      `SELECT * FROM messages 
       WHERE is_hidden = 0 
       ORDER BY created_at DESC 
       LIMIT 100`  // 限制返回数量
    )
    return NextResponse.json({ messages })
  } catch (error) {
    console.error('获取留言失败:', error)
    if ((error as any).code === 'ER_NO_SUCH_TABLE') {
      return NextResponse.json({ messages: [] })
    }
    return NextResponse.json(
      { error: '获取留言失败' },
      { status: 500 }
    )
  }
}

// 发表新留言
export async function POST(request: Request) {
  try {
    const { nickname, email, content } = await request.json()

    // 基本字段验证
    if (!nickname || !email || !content) {
      return NextResponse.json(
        { error: '请填写所有必要字段' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      )
    }

    // 验证昵称
    const nicknameValidation = validateContent('nickname', nickname)
    if (!nicknameValidation.isValid) {
      return NextResponse.json(
        { error: nicknameValidation.message },
        { status: 400 }
      )
    }

    // 验证内容
    const contentValidation = validateContent('content', content)
    if (!contentValidation.isValid) {
      return NextResponse.json(
        { error: contentValidation.message },
        { status: 400 }
      )
    }

    // 过滤 XSS
    const safeNickname = escapeHtml(nickname.trim())
    const safeContent = escapeHtml(content.trim())
    const safeEmail = email.trim().toLowerCase()

    // 检查发言频率限制
    const [recentMessages] = await db.query(
      `SELECT COUNT(*) as count FROM messages 
       WHERE email = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)`,
      [safeEmail]
    ) as any[]

    if (recentMessages.count > 0) {
      return NextResponse.json(
        { error: '发言太频繁，请稍后再试' },
        { status: 429 }
      )
    }

    // 使用参数化查询防止 SQL 注入
    const result = await db.query(
      'INSERT INTO messages (nickname, email, content) VALUES (?, ?, ?)',
      [safeNickname, safeEmail, safeContent]
    ) as any

    return NextResponse.json({
      success: true,
      message: {
        message_id: result.insertId,
        nickname: safeNickname,
        content: safeContent,
        created_at: new Date()
      }
    })
  } catch (error) {
    console.error('发表留言失败:', error)
    return NextResponse.json(
      { error: '发表留言失败' },
      { status: 500 }
    )
  }
} 