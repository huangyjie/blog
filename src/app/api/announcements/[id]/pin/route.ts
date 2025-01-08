import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// 更新公告置顶状态
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { is_pinned } = await request.json()

    const result = await query(
      'UPDATE announcements SET is_pinned = ? WHERE id = ?',
      [is_pinned, params.id]
    ) as any

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: '公告不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: parseInt(params.id),
      is_pinned,
      updated_at: new Date(),
    })
  } catch (error) {
    console.error('更新置顶状态失败:', error)
    return NextResponse.json(
      { error: '更新置顶状态失败' },
      { status: 500 }
    )
  }
} 