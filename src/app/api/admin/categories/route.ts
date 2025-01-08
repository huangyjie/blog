import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// 获取所有分类
export async function GET() {
  try {
    const categories = await query(
      'SELECT * FROM app_categories ORDER BY category_name'
    )
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('获取分类列表失败:', error)
    return NextResponse.json(
      { error: '获取分类列表失败' },
      { status: 500 }
    )
  }
}

// 创建新分类
export async function POST(request: Request) {
  try {
    const { category_name, category_description } = await request.json()

    if (!category_name) {
      return NextResponse.json(
        { error: '分类名称不能为空' },
        { status: 400 }
      )
    }

    const result = await query(
      'INSERT INTO app_categories (category_name, category_description) VALUES (?, ?)',
      [category_name, category_description || '']
    ) as any

    return NextResponse.json({
      success: true,
      category: {
        category_id: result.insertId,
        category_name,
        category_description,
        is_hidden: 0,
        created_at: new Date()
      }
    })
  } catch (error) {
    console.error('创建分类失败:', error)
    return NextResponse.json(
      { error: '创建分类失败' },
      { status: 500 }
    )
  }
} 