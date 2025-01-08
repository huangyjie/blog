import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const articles = await db.query(
      'SELECT * FROM articles ORDER BY created_at DESC'
    )
    return NextResponse.json({ articles })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const icon = formData.get('icon') as string
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: '请上传HTML文件' },
        { status: 400 }
      )
    }

    // 保存文件
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(process.cwd(), 'public/article', file.name)
    await writeFile(filePath, buffer)

    // 保存到数据库
    await db.query(
      `INSERT INTO articles (title, description, file_path, icon) 
       VALUES (?, ?, ?, ?)`,
      [title, description, `/article/${file.name}`, icon]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('上传文章失败:', error)
    return NextResponse.json(
      { error: '上传文章失败' },
      { status: 500 }
    )
  }
} 