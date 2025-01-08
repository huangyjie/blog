import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// 获取管理员列表
export async function GET() {
  try {
    const [admins] = await pool.query(
      'SELECT admin_id, username, email, nickname, avatar_url, role, last_login, is_active, created_at, updated_at FROM admins'
    )
    return NextResponse.json(admins)
  } catch (error) {
    console.error('获取管理员列表失败:', error)
    return NextResponse.json({ error: '获取管理员列表失败' }, { status: 500 })
  }
}

// 添加管理员
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, email, nickname, role } = body

    // 检查用户名是否已存在
    const [existingUsers] = await pool.query('SELECT username FROM admins WHERE username = ?', [username])
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ error: '用户名已存在' }, { status: 400 })
    }

    // 直接使用明文密码
    await pool.query(
      'INSERT INTO admins (username, password, email, nickname, role) VALUES (?, ?, ?, ?, ?)',
      [username, password, email, nickname, role]
    )

    return NextResponse.json({ success: true, message: '管理员添加成功' })
  } catch (error) {
    console.error('添加管理员失败:', error)
    return NextResponse.json({ error: '添加管理员失败' }, { status: 500 })
  }
}