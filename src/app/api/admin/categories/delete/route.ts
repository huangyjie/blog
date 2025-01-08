import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { category_id } = await request.json()
    
    // 先删除该分类下的所有应用
    await db.query(
      'DELETE FROM apps WHERE category_id = ?',
      [category_id]
    )

    // 然后删除分类
    await db.query(
      'DELETE FROM app_categories WHERE category_id = ?',
      [category_id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除分类失败:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
} 