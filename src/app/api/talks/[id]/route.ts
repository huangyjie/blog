import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [talk] = await db.query(
      "SELECT * FROM talks WHERE talk_id = ? AND is_hidden = 0",
      [params.id]
    ) as any[]

    if (!talk) {
      return NextResponse.json({ error: '说说不存在' }, { status: 404 })
    }

    return NextResponse.json({ talk })
  } catch (error) {
    console.error('获取说说详情失败:', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
} 