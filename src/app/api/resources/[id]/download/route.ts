import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const appId = parseInt(params.id)
    
    // 使用 query 函数而不是 execute
    await db.query(
      'UPDATE apps SET download_count = download_count + 1 WHERE app_id = ?',
      [appId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新下载次数失败:', error)
    return NextResponse.json(
      { error: '更新下载次数失败' },
      { status: 500 }
    )
  }
} 