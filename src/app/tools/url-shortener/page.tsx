'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
interface ShortenResult {
  originalUrl: string
  shortUrl: string
  qrCode?: string
  expiresAt?: string
}

export default function UrlShortenerPage() {
  const [url, setUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [expireTime, setExpireTime] = useState('never')
  const [result, setResult] = useState<ShortenResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 生成短链接
  const shortenUrl = useCallback(async () => {
    if (!url.trim()) {
      setError('请输入需要缩短的链接')
      return
    }

    // 验证URL格式
    try {
      new URL(url)
    } catch {
      setError('请输入有效的URL地址')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 使用自己的API
      const response = await fetch('/api/shorturl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          alias: customAlias || undefined,
          expireTime: expireTime === 'never' ? undefined : parseInt(expireTime)
        })
      })
      
      if (!response.ok) {
        throw new Error('短链接生成失败')
      }

      const data = await response.json()
      const shortUrl = `${window.location.origin}/s/${data.code}`

      // 生成二维码
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shortUrl)}`

      setResult({
        originalUrl: url,
        shortUrl,
        qrCode: qrCodeUrl,
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toLocaleString() : undefined
      })
    } catch (err) {
      setError('生成短链接失败：' + (err instanceof Error ? err.message : '未知错误'))
    } finally {
      setLoading(false)
    }
  }, [url, customAlias, expireTime])

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('已复制到剪贴板')
    } catch (err) {
      alert('复制失败，请手动复制')
    }
  }
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">短链生成</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 输入区域 */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-white mb-2">原始链接</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 rounded bg-white/20 text-white"
                placeholder="请输入需要缩短的链接..."
              />
            </div>

            <div>
              <label className="block text-white mb-2">自定义后缀（可选）</label>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="w-full p-2 rounded bg-white/20 text-white"
                placeholder="输入自定义短链接后缀..."
              />
            </div>

            <div>
              <label className="block text-white mb-2">有效期</label>
              <select
                value={expireTime}
                onChange={(e) => setExpireTime(e.target.value)}
                className="w-full p-2 rounded bg-white/20 text-white [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="never" className="bg-gray-800 text-white">永久有效</option>
                <option value="3600" className="bg-gray-800 text-white">1小时</option>
                <option value="86400" className="bg-gray-800 text-white">1天</option>
                <option value="604800" className="bg-gray-800 text-white">7天</option>
                <option value="2592000" className="bg-gray-800 text-white">30天</option>
              </select>
            </div>

            <button
              onClick={shortenUrl}
              disabled={loading}
              className={`w-full py-2 rounded ${
                loading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
            >
              {loading ? '生成中...' : '生成短链接'}
            </button>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-3 rounded bg-red-500/20 text-red-300">
              {error}
            </div>
          )}

          {/* 生成结果 */}
          {result && (
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">原始链接</span>
                  <button
                    onClick={() => copyToClipboard(result.originalUrl)}
                    className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded"
                  >
                    复制
                  </button>
                </div>
                <div className="text-white break-all">{result.originalUrl}</div>
              </div>

              <div className="bg-white/5 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">短链接</span>
                  <button
                    onClick={() => copyToClipboard(result.shortUrl)}
                    className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded"
                  >
                    复制
                  </button>
                </div>
                <a 
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 break-all"
                >
                  {result.shortUrl}
                </a>
              </div>

              {result.expiresAt && (
                <div className="bg-white/5 p-4 rounded">
                  <div className="text-gray-400 mb-2">有效期至</div>
                  <div className="text-white">{result.expiresAt}</div>
                </div>
              )}

              {result.qrCode && (
                <div className="bg-white/5 p-4 rounded">
                  <div className="text-gray-400 mb-2">二维码</div>
                  <img
                    src={result.qrCode}
                    alt="QR Code"
                    className="w-32 h-32 bg-white p-2 rounded"
                  />
                </div>
              )}
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持生成短链接</li>
              <li>可以自定义短链接后缀</li>
              <li>可以设置有效期</li>
              <li>自动生成二维码</li>
              <li>支持一键复制</li>
              <li>支持链接预览</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 