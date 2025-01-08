import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { headers } from 'next/headers'
import mysql from 'mysql2/promise'

// 创建数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'app_download_center'
}

export async function GET(request: Request) {
  let connection;
  try {
    const token = cookies().get('admin_token')?.value
    if (!token) {
      return NextResponse.json({ authenticated: false })
    }

    // 获取真实 IP 地址
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIP = headersList.get('x-real-ip')
    const cfIP = headersList.get('cf-connecting-ip')
    const clientIP = request.headers.get('x-real-ip')
    
    // 按优先级尝试不同的方式获取 IP
    let ip = forwardedFor?.split(',')[0].trim() || 
             realIP || 
             cfIP || 
             clientIP || 
             request.headers.get('x-forwarded-for') || 
             headersList.get('host')?.split(':')[0] ||
             '127.0.0.1'

    // 如果是本地地址，使用备用 IP
    if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
      ip = process.env.TEST_IP || '127.0.0.1'
    }

    connection = await mysql.createConnection(dbConfig)

    // 查询管理员信息
    const [rows] = await connection.execute(
      'SELECT username, email, nickname, role, last_login, last_ip FROM admins WHERE token = ? AND is_active = 1',
      [token]
    )

    const admin = (rows as any[])[0]
    if (!admin) {
      return NextResponse.json({ authenticated: false })
    }

    // 只在 IP 变化时更新
    if (admin.last_ip !== ip) {
      await connection.execute(
        'UPDATE admins SET last_login = NOW(), last_ip = ? WHERE token = ?',
        [ip, token]
      )
    }

    return NextResponse.json({
      authenticated: true,
      name: admin.nickname || admin.username,
      email: admin.email,
      role: admin.role,
      loginTime: admin.last_login,
      ip: ip
    })

  } catch (error) {
    console.error('Auth check failed:', error)
    return NextResponse.json({ authenticated: false })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
} 