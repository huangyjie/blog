import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { pool } from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    
    // 查询数据库时确保获取角色信息
    const [rows]: any = await pool.query(
      'SELECT admin_id, username, role FROM admins WHERE username = ? AND password = ? AND is_active = 1',
      [username, password]
    )

    if (!rows || rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '用户名或密码错误' 
      })
    }

    const admin = rows[0]
    
    // 生成 JWT token 时包含角色信息
    const token = jwt.sign(
      { 
        id: admin.admin_id,
        username: admin.username,
        role: admin.role 
      },
      process.env.JWT_SECRET || 'your-secret-key-123456',
      { expiresIn: '7d' }
    )

    // 更新数据库中的 token
    await pool.query(
      'UPDATE admins SET last_login = NOW(), token = ? WHERE admin_id = ?',
      [token, admin.admin_id]
    )

    const response = NextResponse.json({ 
      success: true,
      admin: {
        username: admin.username,
        role: admin.role
      }
    })

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60
    })

    return response

  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json({ 
      success: false,
      error: '登录失败,请稍后重试'
    })
  }
} 