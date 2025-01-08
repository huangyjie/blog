import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// 更新应用状态
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { is_hidden } = await request.json()

    const result = await query(
      'UPDATE apps SET is_hidden = ? WHERE app_id = ?',
      [is_hidden, params.id]
    ) as any

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: '应用不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新应用状态失败:', error)
    return NextResponse.json(
      { error: '更新应用状态失败' },
      { status: 500 }
    )
  }
}

// 删除应用
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      'DELETE FROM apps WHERE app_id = ?',
      [params.id]
    ) as any

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: '应用不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除应用失败:', error)
    return NextResponse.json(
      { error: '删除应用失败' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const app = await request.json()
    
    await query(
      `UPDATE apps 
       SET app_name = ?, app_description = ?, download_url = ?, category_id = ? 
       WHERE app_id = ?`,
      [app.app_name, app.app_description, app.download_url, app.category_id, params.id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新应用失败:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
} 