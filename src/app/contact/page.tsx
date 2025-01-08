'use client'

import { useState, useEffect } from 'react'
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError(null)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
        setError(data.error || '提交失败，请稍后重试')
      }
    } catch (err) {
      setStatus('error')
      setError('提交失败，请稍后重试')
    }
  }

  const handleSendEmail = async () => {
    if (!formData.email || !formData.name || !formData.message) {
      setError('请填写完整信息')
      return
    }

    setEmailStatus('loading')
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${formData.name} <[输入你的邮箱]>`,
          to: '[输入你的邮箱]',
          subject: `来自 ${formData.name} 的反馈`,
          name: formData.name,
          email: formData.email,
          message: formData.message
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setEmailStatus('success')
        alert('✅ 邮件发送成功！')
      } else {
        setEmailStatus('error')
        setError(data.message || '邮件发送失败')
      }
    } catch (err) {
      setEmailStatus('error')
      setError('邮件发送失败，请稍后重试')
    } finally {
      setEmailStatus('idle')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 页面标题 */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">联系我</h1>
            <p className="text-gray-300">期待您的反馈和建议</p>
          </div>
          
          {/* 留言表单 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              给我留言
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                  姓名
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/20 
                    text-white placeholder-gray-400 
                    focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none 
                    transition-all duration-300"
                  placeholder="请输入您的姓名"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/20 
                    text-white placeholder-gray-400 
                    focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none 
                    transition-all duration-300"
                  placeholder="请输入您的邮箱"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                  留言内容
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/20 
                    text-white placeholder-gray-400 
                    focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none 
                    transition-all duration-300 resize-none"
                  placeholder="请输入您的留言内容"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-white
                    bg-gradient-to-r from-blue-500 to-purple-500
                    hover:from-blue-600 hover:to-purple-600
                    focus:ring-2 focus:ring-purple-400/20 focus:outline-none
                    transition-all duration-300
                    ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                >
                  {status === 'loading' ? '提交中...' : '提交留言'}
                </button>

                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={emailStatus === 'loading'}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-white
                    bg-gradient-to-r from-green-500 to-blue-500
                    hover:from-green-600 hover:to-blue-600
                    focus:ring-2 focus:ring-blue-400/20 focus:outline-none
                    transition-all duration-300
                    ${emailStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                >
                  {emailStatus === 'loading' ? '发送中...' : '发送邮件'}
                </button>
              </div>

              {status === 'success' && (
                <p className="text-green-400 text-center animate-fade-in">留言提交成功！</p>
              )}

              {status === 'error' && error && (
                <p className="text-red-400 text-center animate-fade-in">{error}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}