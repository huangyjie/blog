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

interface Feedback {
  feedback_id: number
  email: string
  message: string
  created_at: string
  is_read: boolean
}

export default function FeedbackManagementPage() {
  const { isValidating, isAuthenticated } = useAdminAuth()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {  // 只在认证后加载数据
      fetchFeedbacks()
    }
  }, [isAuthenticated])  // 依赖于认证状态

  // 获取反馈列表
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/admin/feedback')
      const data = await response.json()
      if (Array.isArray(data)) {
        setFeedbacks(data)
      }
    } catch (error) {
      console.error('获取反馈失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 删除反馈
  const handleDelete = async (feedbackId: number) => {
    if (!confirm('确定要删除这条反馈吗？')) return

    try {
      const response = await fetch('/api/admin/feedback', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback_id: feedbackId })
      })

      if (response.ok) {
        // 更新列表
        setFeedbacks(feedbacks.filter(f => f.feedback_id !== feedbackId))
      }
    } catch (error) {
      console.error('删除反馈失败:', error)
    }
  }

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
    return null
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">反馈管理</h1>
          </div>
        </div>

        {/* 加载状态 */}
        {isLoading ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <div className="text-center text-gray-200">
              加载中...
            </div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <div className="text-center text-gray-200">
              暂无反馈信息
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.feedback_id}
                className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 hover:bg-white/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-medium text-white">{feedback.email}</div>
                    <div className="text-sm text-gray-300">
                      {new Date(feedback.created_at).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(feedback.feedback_id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                  >
                    删除
                  </button>
                </div>
                <p className="text-gray-200 whitespace-pre-wrap">{feedback.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 