'use client'

import { useState } from 'react'
import { CountdownTimer } from './countdown-timer'

interface VerificationCodeInputProps {
  onSubmit: (code: string) => void
  onResend: () => Promise<void>
  expireTime?: number // 过期时间（秒）
}

export function VerificationCodeInput({ 
  onSubmit, 
  onResend, 
  expireTime = 300 // 默认5分钟
}: VerificationCodeInputProps) {
  const [code, setCode] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [showTimer, setShowTimer] = useState(true)

  const handleResend = async () => {
    setIsResending(true)
    try {
      await onResend()
      setShowTimer(true)
      setCode('')
    } catch (error) {
      console.error('重新发送失败:', error)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="请输入验证码"
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          maxLength={6}
        />
        <button
          onClick={() => onSubmit(code)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          验证
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>验证码有效期：</span>
          {showTimer && (
            <CountdownTimer
              initialTime={expireTime}
              onFinish={() => setShowTimer(false)}
            />
          )}
        </div>
        <button
          onClick={handleResend}
          disabled={isResending || showTimer}
          className={`text-blue-500 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors ${
            isResending ? 'opacity-50' : ''
          }`}
        >
          {isResending ? '发送中...' : '重新发送'}
        </button>
      </div>

      <div className="text-xs text-gray-400">
        没收到验证码？请检查垃圾邮件文件夹，或点击重新发送
      </div>
    </div>
  )
} 