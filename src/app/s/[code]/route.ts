import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { urlMap } from '@/lib/storage'

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params
  
  // 从存储中获取原始URL
  const urlData = urlMap.get(code)
  
  if (!urlData) {
    return new NextResponse('短链接不存在或已过期', { status: 404 })
  }

  // 检查是否过期
  if (urlData.expiresAt && urlData.expiresAt < new Date()) {
    urlMap.delete(code) // 清理过期数据
    return new NextResponse('短链接已过期', { status: 410 })
  }

  // 重定向到原始URL
  return redirect(urlData.url)
} 