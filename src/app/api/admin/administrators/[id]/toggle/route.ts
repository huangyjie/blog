import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// 切换管理员状态
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = params.id
    const { is_active } = await request.json()

    // 检查是否为超级管理员
    const [admin] = await pool.query(
      'SELECT role FROM admins WHERE admin_id = ?',
      [adminId]
    )

    if (Array.isArray(admin) && admin[0]?.role === 'super_admin') {
      return NextResponse.json({ error: '不能修改超级管理员状态' }, { status: 403 })
    }

    await pool.query(
      'UPDATE admins SET is_active = ? WHERE admin_id = ?',
      [is_active, adminId]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('切换管理员状态失败:', error)
    return NextResponse.json({ error: '切换管理员状态失败' }, { status: 500 })
  }
}