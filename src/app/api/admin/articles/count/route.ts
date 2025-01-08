import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [result] = await db.query('SELECT COUNT(*) FROM articles')
    
    const count = result['COUNT(*)']
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('获取文章数量失败:', error)
    return NextResponse.json(
      { error: '获取文章数量失败' },
      { status: 500 }
    )
  }
} 