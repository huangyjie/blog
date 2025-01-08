'use client'

import { useState, useEffect } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { isValidEmail, validateContent } from '@/lib/security'

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
  content: string
  created_at: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    content: ''
  })
  const [submitting, setSubmitting] = useState(false)

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
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      const data = await response.json()
      setMessages(data.messages)
    } catch (error) {
      console.error('获取留言失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (!isValidEmail(formData.email)) {
        alert('请输入有效的邮箱地址')
        return
      }

      const nicknameValidation = validateContent('nickname', formData.nickname)
      if (!nicknameValidation.isValid) {
        alert(nicknameValidation.message)
        return
      }

      const contentValidation = validateContent('content', formData.content)
      if (!contentValidation.isValid) {
        alert(contentValidation.message)
        return
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setFormData({ nickname: '', email: '', content: '' })
        fetchMessages()
        alert('留言发表成功！')
      } else {
        alert(data.error || '发表留言失败，请稍后重试')
      }
    } catch (error) {
      console.error('提交留言失败:', error)
      alert('发表留言失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <RandomBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">留言板</h1>
          <p className="text-gray-300">写下你想说的话</p>
        </div>

        {/* 留言表单 */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-200 mb-1">
                昵称
              </label>
              <input
                type="text"
                id="nickname"
                value={formData.nickname}
                onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                required
                className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/20 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                邮箱
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/20 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-1">
                留言内容
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                required
                rows={4}
                className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/20 text-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:bg-blue-400"
            >
              {submitting ? '提交中...' : '发表留言'}
            </button>
          </form>
        </div>

        {/* 留言列表 - 改成对话气泡样式 */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center text-white">加载中...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-white">暂无留言</div>
          ) : (
            <div className="space-y-8">
              {messages.map((message) => (
                <div key={message.message_id} className="flex flex-col space-y-2">
                  {/* 用户信息 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {message.nickname.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{message.nickname}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* 留言内容气泡 */}
                  <div className="ml-12">
                    <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-lg rounded-tl-none border border-white/20">
                      {/* 气泡尖角 */}
                      <div className="absolute -left-2 top-0 w-2 h-4 overflow-hidden">
                        <div className="absolute -right-2 top-0 w-4 h-4 bg-white/10 backdrop-blur-sm rotate-45 border-l border-t border-white/20"></div>
                      </div>
                      
                      {/* 留言内容 */}
                      <p className="text-gray-200 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 