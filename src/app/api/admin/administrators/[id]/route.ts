import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// 删除管理员
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = params.id

    // 检查是否为超级管理员
    const [admin] = await pool.query(
      'SELECT role FROM admins WHERE admin_id = ?',
      [adminId]
    )

    if (Array.isArray(admin) && admin[0]?.role === 'super_admin') {
      return NextResponse.json({ error: '不能删除超级管理员' }, { status: 403 })
    }

    await pool.query('DELETE FROM admins WHERE admin_id = ?', [adminId])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除管理员失败:', error)
    return NextResponse.json({ error: '删除管理员失败' }, { status: 500 })
  }
}

// 添加 PUT 方法处理编辑请求
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = params.id
    const { username, email, nickname, role, is_active } = await request.json()

    // 检查是否为超级管理员
    const [admin] = await pool.query(
      'SELECT role FROM admins WHERE admin_id = ?',
      [adminId]
    ) as any

    if (Array.isArray(admin) && admin[0]?.role === 'super_admin') {
      return NextResponse.json({ error: '不能修改超级管理员' }, { status: 403 })
    }

    // 检查用户名是否已存在(排除当前用户)
    const [existingUsers] = await pool.query(
      'SELECT username FROM admins WHERE username = ? AND admin_id != ?',
      [username, adminId]
    ) as any

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ error: '用户名已存在' }, { status: 400 })
    }

    await pool.query(
      'UPDATE admins SET username = ?, email = ?, nickname = ?, role = ?, is_active = ? WHERE admin_id = ?',
      [username, email, nickname, role, is_active, adminId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新管理员失败:', error)
    return NextResponse.json({ error: '更新管理员失败' }, { status: 500 })
  }
}