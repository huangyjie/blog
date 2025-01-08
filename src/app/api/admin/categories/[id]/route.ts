import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// 更新分类状态
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { is_hidden } = await request.json()

    const result = await query(
      'UPDATE app_categories SET is_hidden = ? WHERE category_id = ?',
      [is_hidden, params.id]
    ) as any

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: '分类不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新分类状态失败:', error)
    return NextResponse.json(
      { error: '更新分类状态失败' },
      { status: 500 }
    )
  }
}

// 删除分类
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 首先删除该分类下的所有应用
    await query(
      'DELETE FROM apps WHERE category_id = ?',
      [params.id]
    )

    // 然后删除分类
    const result = await query(
      'DELETE FROM app_categories WHERE category_id = ?',
      [params.id]
    ) as any

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: '分类不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除分类失败:', error)
    return NextResponse.json(
      { error: '删除分类失败' },
      { status: 500 }
    )
  }
} 