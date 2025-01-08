import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { urlMap } from '@/lib/storage'

export async function POST(req: Request) {
  try {
    const { url, alias, expireTime } = await req.json()

    // 生成短码
    const code = alias || nanoid(6)
    
    // 检查自定义短码是否已存在
    if (alias && urlMap.has(alias)) {
      return NextResponse.json(
        { error: '该短码已被使用' },
        { status: 400 }
      )
    }

    // 计算过期时间
    const expiresAt = expireTime ? new Date(Date.now() + expireTime * 1000) : undefined

    // 存储映射
    urlMap.set(code, {
      url,
      expiresAt
    })

    return NextResponse.json({
      code,
      expiresAt
    })
  } catch (error) {
    return NextResponse.json(
      { error: '生成短链接失败' },
      { status: 500 }
    )
  }
} 