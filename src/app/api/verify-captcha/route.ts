import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const captcha = data.get('captcha')

    const params = new URLSearchParams()
    params.append('captcha', captcha as string)

    const response = await fetch('http://api.hsbogk.icu/YZM/verify.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      credentials: 'include',
      mode: 'cors'
    })

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('验证码验证失败:', error)
    return NextResponse.json(
      { success: false, message: '验证请求失败' },
      { status: 500 }
    )
  }
} 