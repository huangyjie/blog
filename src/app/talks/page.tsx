'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RandomBackground } from '@/components/ui/random-background'

// 添加全局样式来隐藏滚动条
const globalStyles = `
  /* 隐藏默认滚动条 */
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  /* 为了兼容 Firefox */
  * {
    scrollbar-width: none;
  }

  /* 为了兼容 IE */
  * {
    -ms-overflow-style: none;
  }
`;

interface Talk {
  talk_id: number
  title: string
  content: string
  created_at: string
  author: string
}

export default function TalksPage() {
  const [talks, setTalks] = useState<Talk[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 添加全局样式
  useEffect(() => {
    // 创建 style 元素
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);

    // 清理函数
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 添加阻止默认滑动行为
  useEffect(() => {
    // 阻止默认的手势事件
    const preventGestures = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // 阻止鼠标事件
    const preventMouseGestures = (e: MouseEvent) => {
      if (e.buttons === 2) { // 右键被按下
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    
    // 禁用手势相关事件
    document.addEventListener('gesturestart', preventGestures, { capture: true });
    document.addEventListener('gesturechange', preventGestures, { capture: true });
    document.addEventListener('gestureend', preventGestures, { capture: true });
    
    // 禁用触摸相关手势
    document.addEventListener('touchstart', preventGestures, { passive: false, capture: true });
    document.addEventListener('touchmove', preventGestures, { passive: false, capture: true });
    document.addEventListener('touchend', preventGestures, { passive: false, capture: true });

    // 禁用鼠标手势
    document.addEventListener('mousedown', preventMouseGestures, { capture: true });
    document.addEventListener('mousemove', preventMouseGestures, { capture: true });
    document.addEventListener('mouseup', preventMouseGestures, { capture: true });
    document.addEventListener('drag', preventGestures, { capture: true });
    document.addEventListener('dragstart', preventGestures, { capture: true });

    // 清理函数
    return () => {
      document.removeEventListener('gesturestart', preventGestures);
      document.removeEventListener('gesturechange', preventGestures);
      document.removeEventListener('gestureend', preventGestures);
      document.removeEventListener('touchstart', preventGestures);
      document.removeEventListener('touchmove', preventGestures);
      document.removeEventListener('touchend', preventGestures);
      document.removeEventListener('mousedown', preventMouseGestures);
      document.removeEventListener('mousemove', preventMouseGestures);
      document.removeEventListener('mouseup', preventMouseGestures);
      document.removeEventListener('drag', preventGestures);
      document.removeEventListener('dragstart', preventGestures);
    };
  }, []);

  useEffect(() => {
    fetch('/api/talks')
      .then(res => res.json())
      .then(data => {
        setTalks(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch talks:', err)
        setError('加载说说失败')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <RandomBackground />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center text-white">加载中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <RandomBackground />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">说说</h1>
        <div className="space-y-6">
          {talks.map((talk) => (
            <Link
              key={talk.talk_id}
              href={`/talks/${talk.talk_id}`}
              className="block p-6 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 transition-colors hover:bg-white/20"
            >
              <h2 className="text-xl font-semibold mb-2">{talk.title}</h2>
              <p className="text-gray-200 mb-4 line-clamp-3">{talk.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-300">
                <span className="font-medium">{talk.author}</span>
                <time dateTime={talk.created_at}>
                  {new Date(talk.created_at).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 