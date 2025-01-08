import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// 获取单个公告
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [announcement] = await query(
      'SELECT * FROM announcements WHERE id = ?',
      [params.id]
    ) as any[]

    if (!announcement) {
      return NextResponse.json(
        { error: '公告不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(announcement)
  } catch (error) {
    console.error('获取公告失败:', error)
    return NextResponse.json(
      { error: '获取公告失败' },
      { status: 500 }
    )
  }
}

// 更新公告
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, content, is_pinned } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      )
    }

    const result = await query(
      'UPDATE announcements SET title = ?, content = ?, is_pinned = ? WHERE id = ?',
      [title, content, is_pinned || false, params.id]
    ) as any

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: '公告不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: parseInt(params.id),
      title,
      content,
      is_pinned,
      updated_at: new Date(),
    })
  } catch (error) {
    console.error('更新公告失败:', error)
    return NextResponse.json(
      { error: '更新公告失败' },
      { status: 500 }
    )
  }
}

// 删除公告
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      'DELETE FROM announcements WHERE id = ?',
      [params.id]
    ) as any

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: '公告不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除公告失败:', error)
    return NextResponse.json(
      { error: '删除公告失败' },
      { status: 500 }
    )
  }
} 