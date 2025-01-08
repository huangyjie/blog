import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// 获取所有应用
export async function GET() {
  try {
    const apps = await query(
      `SELECT a.*, c.category_name 
       FROM apps a 
       LEFT JOIN app_categories c ON a.category_id = c.category_id 
       ORDER BY a.app_name`
    )
    return NextResponse.json({ apps })
  } catch (error) {
    console.error('获取应用列表失败:', error)
    return NextResponse.json(
      { error: '获取应用列表失败' },
      { status: 500 }
    )
  }
}

// 创建新应用
export async function POST(request: Request) {
  try {
    const { app_name, app_description, download_url, category_id } = await request.json()

    if (!app_name || !download_url || !category_id) {
      return NextResponse.json(
        { error: '应用名称、下载链接和分类不能为空' },
        { status: 400 }
      )
    }

    const result = await query(
      'INSERT INTO apps (app_name, app_description, download_url, category_id) VALUES (?, ?, ?, ?)',
      [app_name, app_description || '', download_url, category_id]
    ) as any

    return NextResponse.json({
      success: true,
      app: {
        app_id: result.insertId,
        app_name,
        app_description,
        download_url,
        category_id,
        is_hidden: 0,
        download_count: 0,
        created_at: new Date()
      }
    })
  } catch (error) {
    console.error('创建应用失败:', error)
    return NextResponse.json(
      { error: '创建应用失败' },
      { status: 500 }
    )
  }
} 