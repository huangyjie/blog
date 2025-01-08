'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RandomBackground } from '@/components/ui/random-background'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'

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

interface Message {
  message_id: number
  nickname: string
  email: string
  content: string
  created_at: string
  is_hidden: number
}

export default function AdminMessagesPage() {
  const { isValidating, isAuthenticated } = useAdminAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {  // 只在认证后加载数据
      loadMessages()
    }
  }, [isAuthenticated])  // 依赖于认证状态

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

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages')
      const data = await response.json()
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('加载留言失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMessage = async (messageId: number, isHidden: number) => {
    try {
      const response = await fetch('/api/admin/messages/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message_id: messageId, is_hidden: isHidden ? 0 : 1 })
      })

      if (response.ok) {
        loadMessages()
      }
    } catch (error) {
      console.error('切换留言状态失败:', error)
    }
  }

  const deleteMessage = async (messageId: number) => {
    if (!confirm('确定要删除这条留言吗？')) return

    try {
      const response = await fetch('/api/admin/messages/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message_id: messageId })
      })

      if (response.ok) {
        loadMessages()
      }
    } catch (error) {
      console.error('删除留言失败:', error)
    }
  }

  if (isValidating) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">验证中...</div>
        </div>
      </AdminLayout>
    )
  }

  if (!isAuthenticated) {
    return null // 不渲染任何内容，等待重定向完成
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">留言管理</h1>
        </div>

        {loading ? (
          <div className="text-center text-white">加载中...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-white">暂无留言</div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.message_id}
                className={`bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 ${
                  message.is_hidden ? 'opacity-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {message.nickname}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {message.email} · {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => toggleMessage(message.message_id, message.is_hidden)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        message.is_hidden
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-yellow-500 hover:bg-yellow-600'
                      } text-white text-sm`}
                    >
                      {message.is_hidden ? '显示' : '隐藏'}
                    </button>
                    <button
                      onClick={() => deleteMessage(message.message_id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
                <p className="text-gray-200 whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 