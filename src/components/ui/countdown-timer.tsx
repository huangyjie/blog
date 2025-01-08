'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  initialTime: number // 初始时间（秒）
  onFinish?: () => void // 倒计时结束回调
}

export function CountdownTimer({ initialTime, onFinish }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish?.()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onFinish])

  // 转换秒数为分:秒格式
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <span className="font-mono text-blue-500 font-medium">
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </span>
  )
} 