import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const token = cookies().get('admin_token')?.value
    
    if (token) {
      // 清除数据库中的token
      await db.query(
        'UPDATE admins SET token = NULL WHERE token = ?',
        [token]
      )
      
      // 清除cookie
      cookies().delete('admin_token')
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('登出失败:', error)
    return NextResponse.json({ error: '登出失败' }, { status: 500 })
  }
} 