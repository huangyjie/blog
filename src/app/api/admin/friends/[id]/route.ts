import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// 更新友情链接
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, url, avatar, tags, sort_order } = await request.json()

    await db.query(
      `UPDATE friend_links 
       SET name = ?, description = ?, url = ?, avatar = ?, 
           tags = ?, sort_order = ? 
       WHERE link_id = ?`,
      [name, description, url, avatar, tags?.join(','), sort_order, params.id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新友情链接失败:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

// 删除友情链接
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.query(
      'DELETE FROM friend_links WHERE link_id = ?',
      [params.id]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除友情链接失败:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
} 