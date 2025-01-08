import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 先获取所有分类
    const categories = await db.query(`
      SELECT category_id as id, category_name as name, category_description as description
      FROM app_categories
      WHERE 1=1
    `)

    // 获取每个分类下的应用
    for (const category of categories) {
      const apps = await db.query(`
        SELECT 
          app_id as id,
          app_name as name,
          app_description as description,
          download_url as downloadUrl,
          download_count as downloadCount,
          NOT is_hidden as isActive
        FROM apps 
        WHERE category_id = ?
      `, [category.id])
      
      category.apps = apps
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('获取资源失败:', error)
    return NextResponse.json(
      { error: '获取资源失败' },
      { status: 500 }
    )
  }
} 