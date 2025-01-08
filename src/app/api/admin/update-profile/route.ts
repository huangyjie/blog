import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'app_download_center'
}

export async function POST(request: Request) {
  try {
    const token = cookies().get('admin_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nickname, username, email, password } = body

    const connection = await mysql.createConnection(dbConfig)

    // 首先验证当前用户
    const [admins] = await connection.execute(
      'SELECT admin_id FROM admins WHERE token = ? AND is_active = 1',
      [token]
    )
    const admin = (admins as any[])[0]
    if (!admin) {
      await connection.end()
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 构建更新语句
    let updateFields = []
    let updateValues = []

    if (nickname) {
      updateFields.push('nickname = ?')
      updateValues.push(nickname)
    }
    if (username) {
      updateFields.push('username = ?')
      updateValues.push(username)
    }
    if (email) {
      updateFields.push('email = ?')
      updateValues.push(email)
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateFields.push('password = ?')
      updateValues.push(hashedPassword)
    }

    // 添加 admin_id 到值数组
    updateValues.push(admin.admin_id)

    // 执行更新
    await connection.execute(
      `UPDATE admins SET ${updateFields.join(', ')} WHERE admin_id = ?`,
      updateValues
    )

    // 获取更新后的信息
    const [updatedRows] = await connection.execute(
      'SELECT username, nickname, email FROM admins WHERE admin_id = ?',
      [admin.admin_id]
    )
    const updatedAdmin = (updatedRows as any[])[0]

    await connection.end()

    return NextResponse.json({
      username: updatedAdmin.username,
      nickname: updatedAdmin.nickname,
      email: updatedAdmin.email
    })

  } catch (error) {
    console.error('更新个人信息失败:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 