import { NextResponse } from 'next/server'

const API_KEY = process.env.OPENAI_API_KEY || 'sk-MN8czhMGAGVtRqJfF5742a357b8f4fE8Ad3eDb761525DdA0'
const API_URL = 'https://burn.hair/v1/chat/completions'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    )
  }
} 