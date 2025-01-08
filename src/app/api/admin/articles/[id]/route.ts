import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { unlink } from 'fs/promises'
import { join } from 'path'

// 删除文章
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 先获取文章信息
    const [article] = await db.query(
      'SELECT file_path FROM articles WHERE id = ?',
      [params.id]
    )

    if (!article) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    // 删除文件
    const filePath = join(process.cwd(), 'public', article.file_path)
    await unlink(filePath)

    // 从数据库中删除记录
    await db.query('DELETE FROM articles WHERE id = ?', [params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除文章失败:', error)
    return NextResponse.json(
      { error: '删除文章失败' },
      { status: 500 }
    )
  }
}

// 更新文章信息
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, icon } = await request.json()

    await db.query(
      'UPDATE articles SET title = ?, description = ?, icon = ? WHERE id = ?',
      [title, description, icon, params.id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新文章失败:', error)
    return NextResponse.json(
      { error: '更新文章失败' },
      { status: 500 }
    )
  }
} 