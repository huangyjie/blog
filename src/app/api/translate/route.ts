import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const text = searchParams.get('text')

    if (!text) {
      return new NextResponse('Missing text parameter', { status: 400 })
    }

    const response = await fetch(
      `http://api.yujn.cn/api/fanyi2.php?msg=${encodeURIComponent(text)}`,
      {
        headers: {
          'Accept': 'text/plain',
          'Content-Type': 'text/plain',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const result = await response.text()
    return new NextResponse(result)

  } catch (error) {
    console.error('Translation API error:', error)
    return new NextResponse(
      'Translation service error',
      { status: 500 }
    )
  }
} 