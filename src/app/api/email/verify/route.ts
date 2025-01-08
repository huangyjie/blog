import { NextResponse } from 'next/server'

// 声明全局变量类型
declare global {
  var verificationCodes: Map<string, {
    code: string;
    expireTime: number;
    createTime: number;
  }>;
}

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()
    console.log('验证请求:', { email, code })

    // 验证邮箱格式
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({
        status: 'error',
        message: '邮箱格式不正确'
      })
    }

    // 验证码不能为空
    if (!code) {
      return NextResponse.json({
        status: 'error',
        message: '请输入验证码'
      })
    }

    // 从全局 Map 获取验证码信息
    const codeInfo = global.verificationCodes.get(email)

    // 验证码不存在
    if (!codeInfo) {
      return NextResponse.json({
        status: 'error',
        message: '验证码不存在或已过期'
      })
    }

    // 验证码过期
    if (Date.now() > codeInfo.expireTime) {
      // 删除过期的验证码
      global.verificationCodes.delete(email)
      return NextResponse.json({
        status: 'error',
        message: '验证码已过期'
      })
    }

    // 验证码不匹配 (不区分大小写)
    if (code.toLowerCase() !== codeInfo.code.toLowerCase()) {
      return NextResponse.json({
        status: 'error',
        message: '验证码错误'
      })
    }

    // 验证成功，删除已使用的验证码
    global.verificationCodes.delete(email)

    return NextResponse.json({
      status: 'success',
      message: '验证成功'
    })

  } catch (error: any) {
    console.error('验证失败:', error)
    return NextResponse.json({
      status: 'error',
      message: '验证失败：' + (error.message || '未知错误')
    }, {
      status: 500
    })
  }
} 