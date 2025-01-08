'use client'

import { useState } from 'react'
import { VerificationCodeInput } from '@/components/ui/verification-code-input'

export default function VerifyPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'verifying'>('idle')

  const handleSendCode = async () => {
    setStatus('sending')
    try {
      const response = await fetch('/api/email/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          userAgent: window.navigator.userAgent
        })
      })
      const data = await response.json()
      
      if (data.status === 'success') {
        setStatus('sent')
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('发送验证码失败:', error)
      setStatus('idle')
    }
  }

  const handleVerifyCode = async (code: string) => {
    setStatus('verifying')
    try {
      const response = await fetch('/api/email/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      })
      const data = await response.json()
      
      if (data.status === 'success') {
        // 验证成功后的处理
        console.log('验证成功')
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('验证失败:', error)
    } finally {
      setStatus('sent')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">验证码验证</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">邮箱地址</label>
          <div className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleSendCode}
              disabled={status === 'sending' || !email}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
            >
              {status === 'sending' ? '���送中...' : '发送验证码'}
            </button>
          </div>
        </div>

        {status === 'sent' && (
          <VerificationCodeInput
            onSubmit={handleVerifyCode}
            onResend={handleSendCode}
            expireTime={300} // 5分钟
          />
        )}
      </div>
    </div>
  )
} 