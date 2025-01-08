'use client'

import { useState } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('')
  const [date, setDate] = useState('')
  const [format, setFormat] = useState('seconds') // seconds or milliseconds

  useGlobalStyles();

  const convertTimestampToDate = (ts: string) => {
    if (!ts) return
    
    try {
      const timestampNum = parseInt(ts)
      const milliseconds = format === 'seconds' ? timestampNum * 1000 : timestampNum
      const dateObj = new Date(milliseconds)
      setDate(dateObj.toISOString().slice(0, 19).replace('T', ' '))
    } catch (error) {
      console.error('Invalid timestamp')
    }
  }

  const convertDateToTimestamp = (dateStr: string) => {
    if (!dateStr) return
    
    try {
      const dateObj = new Date(dateStr)
      const milliseconds = dateObj.getTime()
      setTimestamp(format === 'seconds' ? String(Math.floor(milliseconds / 1000)) : String(milliseconds))
    } catch (error) {
      console.error('Invalid date')
    }
  }

  const getCurrentTimestamp = () => {
    const now = new Date()
    setTimestamp(format === 'seconds' ? String(Math.floor(Date.now() / 1000)) : String(Date.now()))
    setDate(now.toISOString().slice(0, 19).replace('T', ' '))
  }

  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">时间戳转换</h1>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="mb-6">
            <label htmlFor="timestamp-format" className="block text-white mb-2">时间戳格式</label>
            <select
              id="timestamp-format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full p-2 rounded bg-white/20 text-white"
              title="选择时间戳格式"
            >
              <option value="seconds">秒级时间戳</option>
              <option value="milliseconds">毫秒级时间戳</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="timestamp-input" className="block text-white mb-2">时间戳</label>
              <input
                id="timestamp-input"
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                onBlur={() => convertTimestampToDate(timestamp)}
                className="w-full p-2 rounded bg-white/20 text-white"
                placeholder={format === 'seconds' ? '1234567890' : '1234567890000'}
                title="输入时间戳"
              />
            </div>
            
            <div>
              <label htmlFor="date-input" className="block text-white mb-2">日期时间</label>
              <input
                id="date-input"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onBlur={() => convertDateToTimestamp(date)}
                className="w-full p-2 rounded bg-white/20 text-white"
                title="选择日期时间"
              />
            </div>
          </div>

          <button
            onClick={getCurrentTimestamp}
            className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            获取当前时间
          </button>
        </div>
      </div>
    </div>
  )
} 