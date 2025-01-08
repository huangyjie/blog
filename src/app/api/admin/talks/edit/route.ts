import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    // 验证管理员权限
    const cookieStore = cookies()
    const token = cookieStore.get('admin_token')
    
    if (!token) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    try {
      verify(token.value, process.env.JWT_SECRET || '')
    } catch (error) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 获取请求数据
    const { talk_id, author, title, content, email } = await request.json()

    // 更新数据库
    const result = await query(
      'UPDATE talks SET author = ?, title = ?, content = ?, email = ? WHERE talk_id = ?',
      [author, title, content, email, talk_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('编辑说说失败:', error)
    return NextResponse.json({ error: '编辑失败' }, { status: 500 })
  }
} 