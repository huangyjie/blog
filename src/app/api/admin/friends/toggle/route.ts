import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { link_id, is_hidden } = await request.json()
    
    await db.query(
      "UPDATE friend_links SET is_hidden = ? WHERE link_id = ?",
      [is_hidden, link_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('切换友情链接状态失败:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
} 