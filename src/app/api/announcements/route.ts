import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// 获取公告列表
export async function GET() {
    try {
        const [announcements] = await pool.query(
            'SELECT * FROM announcements ORDER BY is_pinned DESC, created_at DESC'
        );
        
        return NextResponse.json({ announcements });
    } catch (error) {
        console.error('获取公告列表失败:', error);
        return NextResponse.json(
            { error: '获取公告列表失败' },
            { status: 500 }
        );
    }
}

// 创建新公告
export async function POST(request: Request) {
    try {
        const { title, content, is_pinned } = await request.json();
        
        const [result] = await pool.query(
            'INSERT INTO announcements (title, content, is_pinned) VALUES (?, ?, ?)',
            [title, content, is_pinned]
        );
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('创建公告失败:', error);
        return NextResponse.json(
            { error: '创建公告失败' },
            { status: 500 }
        );
    }
} 