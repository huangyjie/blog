import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const appId = searchParams.get('id')
  const action = searchParams.get('action')

  if (!appId) {
    return NextResponse.json({ error: '无效的应用ID' }, { status: 400 })
  }

  try {
    if (action === 'increment') {
      // 增加下载次数
      await db.query(
        "UPDATE apps SET download_count = download_count + 1 WHERE app_id = ?",
        [appId]
      )

      // 获取下载链接
      const [app] = await db.query(
        "SELECT download_url FROM apps WHERE app_id = ?",
        [appId]
      ) as any[]

      if (app) {
        return NextResponse.json({
          success: true,
          download_url: app.download_url
        })
      } else {
        return NextResponse.json({ error: '应用不存在' }, { status: 404 })
      }
    } else {
      // 直接获取下载链接
      const [app] = await db.query(
        "SELECT download_url FROM apps WHERE app_id = ?",
        [appId]
      ) as any[]

      if (app) {
        return NextResponse.json({
          success: true,
          download_url: app.download_url
        })
      } else {
        return NextResponse.json({ error: '应用不存在' }, { status: 404 })
      }
    }
  } catch (error) {
    console.error('下载处理失败:', error)
    return NextResponse.json({ error: '数据库错误' }, { status: 500 })
  }
} 