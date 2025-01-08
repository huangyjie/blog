import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 获取 User-Agent
  const userAgent = request.headers.get('user-agent') || ''
  
  // 记录访问信息
  console.log('访问信息:', {
    path: request.nextUrl.pathname,
    userAgent,
    time: new Date().toISOString()
  })

  // 获取当前路径
  const path = request.nextUrl.pathname
  
  // 获取 token
  const token = request.cookies.get('admin_token')?.value
  
  // 如果是管理员路径
  if (path.startsWith('/admin')) {
    // 登录页面不需要验证
    if (path === '/admin/login') {
      // 如果已经有 token，直接跳转到管理页面
      if (token) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.next()
    }
    
    // 其他管理页面需要验证 token
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
} 