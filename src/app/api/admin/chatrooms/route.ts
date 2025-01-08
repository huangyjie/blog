import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// 获取所有聊天室
export async function GET() {
  try {
    const rooms = await db.query(
      "SELECT * FROM chat_rooms ORDER BY created_at DESC"
    )
    return NextResponse.json({ rooms })
  } catch (error) {
    console.error('获取聊天室失败:', error)
    return NextResponse.json(
      { error: '获取聊天室失败' },
      { status: 500 }
    )
  }
}

// 创建新聊天室
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('收到的请求数据:', body)

    const { room_number, room_name, description } = body
    
    // 验证必填字段
    if (!room_number || !room_name) {
      console.log('缺少必填字段')
      return NextResponse.json(
        { error: '房间号和房间名称不能为空' },
        { status: 400 }
      )
    }

    // 检查房间号是否已存在
    const existingRooms = await db.query(
      "SELECT room_id FROM chat_rooms WHERE room_number = ?",
      [room_number]
    ) as any[]

    console.log('检查已存在房间:', existingRooms)

    if (existingRooms.length > 0) {
      console.log('房间号已存在')
      return NextResponse.json(
        { error: '该房间号已存在' },
        { status: 400 }
      )
    }

    // 插入新聊天室
    try {
      const result = await db.query(
        `INSERT INTO chat_rooms 
         (room_number, room_name, description, is_active) 
         VALUES (?, ?, ?, true)`,
        [room_number, room_name, description || '']
      ) as any

      console.log('插入结果:', result)

      // 获取新创建的聊天室信息
      const [newRoom] = await db.query(
        "SELECT * FROM chat_rooms WHERE room_id = ?",
        [result.insertId]
      ) as any[]

      // 返回成功响应
      return NextResponse.json({
        success: true,
        room: newRoom
      })
    } catch (dbError) {
      console.error('数据库插入错误:', dbError)
      throw dbError
    }
  } catch (error) {
    console.error('创建聊天室失败:', error)
    return NextResponse.json(
      { error: '创建聊天室失败: ' + (error as Error).message },
      { status: 500 }
    )
  }
} 