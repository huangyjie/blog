import { NextResponse } from 'next/server'
import { db} from '@/lib/db'

export async function GET() {
  try {
    const [result] = await db.query(
      'SELECT COUNT(*) as count FROM friend_links WHERE is_hidden = ?',
      [0]
    )
    
    return NextResponse.json({ 
      count: result.count || 0 
    })
  } catch (error) {
    console.error('获取友链数量失败:', error)
    return NextResponse.json(
      { error: '获取友链数量失败' },
      { status: 500 }
    )
  }
} 