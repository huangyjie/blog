import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// 获取所有友情链接
export async function GET() {
  try {
    const links = await db.query(
      "SELECT * FROM friend_links ORDER BY created_at DESC"
    )
    return NextResponse.json({ links })
  } catch (error) {
    console.error('获取友情链接失败:', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
}

// 添加友情链接
export async function POST(request: Request) {
  try {
    const { name, description, url } = await request.json()

    if (!name || !url) {
      return NextResponse.json(
        { error: '名称和链接为必填项' },
        { status: 400 }
      )
    }

    await db.query(
      `INSERT INTO friend_links (name, description, url) VALUES (?, ?, ?)`,
      [name, description, url]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('添加友情链接失败:', error)
    return NextResponse.json({ error: '添加失败' }, { status: 500 })
  }
} 