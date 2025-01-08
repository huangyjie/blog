import { NextResponse } from 'next/server'

// 生成随机验证码
function generateCaptcha(length: number = 4) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let captcha = ''
  for (let i = 0; i < length; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)]
  }
  return captcha
}

// 生成随机颜色
function randomColor() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r},${g},${b})`
}

// 生成SVG验证码
function generateCaptchaSVG(text: string) {
  const width = 100
  const height = 40
  
  // 生成干扰线
  let lines = ''
  for (let i = 0; i < 3; i++) {
    const x1 = Math.random() * width
    const y1 = Math.random() * height
    const x2 = Math.random() * width
    const y2 = Math.random() * height
    lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${randomColor()}" />`
  }

  // 生成文字
  let chars = ''
  text.split('').forEach((char, i) => {
    const x = 20 + i * 20
    const y = 25
    const rotate = Math.random() * 30 - 15
    chars += `<text x="${x}" y="${y}" fill="${randomColor()}" 
              transform="rotate(${rotate} ${x} ${y})"
              style="font-size: 24px; font-weight: bold;">${char}</text>`
  })

  // 生成SVG
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      ${lines}
      ${chars}
    </svg>
  `

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

export async function GET() {
  try {
    const captchaText = generateCaptcha()
    const captchaImage = generateCaptchaSVG(captchaText)

    return NextResponse.json({
      success: true,
      text: captchaText,
      captcha: captchaImage
    })
  } catch (error) {
    console.error('生成验证码失败:', error)
    return NextResponse.json(
      { error: '生成验证码失败' },
      { status: 500 }
    )
  }
}