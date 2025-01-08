import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [result] = await db.query('SELECT SUM(download_count) as count FROM apps')
    
    const count = result['count'] || 0
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('获取下载总数失败:', error)
    return NextResponse.json(
      { error: '获取下载总数失败' },
      { status: 500 }
    )
  }
} 