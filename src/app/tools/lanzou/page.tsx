'use client'

import { useState } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
 
export default function LanzouParser() {
  const [url, setUrl] = useState('')
  const [pwd, setPwd] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const parseUrl = async () => {
    if (!url) {
      setError('请输入蓝奏云链接！')
      return
    }

    if (!url.includes('lanzou')) {
      setError('请输入正确的蓝奏云链接！')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`http://api.hsbogk.icu/lanzou/?${new URLSearchParams({
        url,
        pwd
      })}`)

      const data = await response.json()

      if (data.code === 200) {
        setResult(data)
      } else {
        setError(data.msg || '解析失败')
      }
    } catch (err) {
      setError('请求失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-black/20 backdrop-blur-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">蓝奏云链接解析</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">蓝奏云链接：</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="请输入蓝奏云链接"
                className="w-full p-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-white mb-2">密码（如果有）：</label>
              <input
                type="text"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="请输入密码（选填）"
                className="w-full p-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40"
              />
            </div>

            <button
              onClick={parseUrl}
              disabled={loading}
              className={`w-full py-2 rounded ${
                loading 
                  ? 'bg-blue-500/50 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
            >
              {loading ? '解析中...' : '解析链接'}
            </button>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/40 rounded text-red-300">
                {error}
              </div>
            )}

            {result && (
              <div className="p-4 bg-white/10 rounded space-y-2">
                <h3 className="text-lg font-semibold text-white">解析结果：</h3>
                <p className="text-gray-200">文件名：{result.name}</p>
                <p className="text-gray-200">文件大小：{result.filesize}</p>
                <p className="text-gray-200">
                  下载链接：
                  <a 
                    href={result.downUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 ml-2"
                  >
                    点击下载
                  </a>
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 text-gray-300">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持解析蓝奏云分享链接</li>
              <li>支持带密码的分享链接</li>
              <li>可获取直接下载地址</li>
              <li>显示文件名和大小信息</li>
              <li>支持新版蓝奏云链接</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 