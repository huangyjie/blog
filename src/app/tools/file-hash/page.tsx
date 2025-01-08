'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import CryptoJS from 'crypto-js'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
interface HashResult {
  md5: string
  sha1: string
  sha256: string
  sha512: string
}

export default function TextHashPage() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<HashResult | null>(null)
  const [error, setError] = useState('')

  // 计算哈希值
  const calculateHash = useCallback(() => {
    if (!text.trim()) {
      setError('请输入需要计算哈希值的文本')
      setResult(null)
      return
    }

    try {
      setResult({
        md5: CryptoJS.MD5(text).toString(),
        sha1: CryptoJS.SHA1(text).toString(),
        sha256: CryptoJS.SHA256(text).toString(),
        sha512: CryptoJS.SHA512(text).toString()
      })
      setError('')
    } catch (err) {
      setError('计算哈希值失败：' + (err instanceof Error ? err.message : '未知错误'))
      setResult(null)
    }
  }, [text])

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
        <h1 className="text-3xl font-bold text-white text-center mb-8">文本哈希计算</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 文本输入 */}
          <div className="mb-6">
            <label className="block text-white mb-2">输入文本</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-[200px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
              placeholder="在此输入需要计算哈希值的文本..."
            />
          </div>

          {/* 计算按钮 */}
          <div className="flex justify-center mb-6">
            <button
              onClick={calculateHash}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
            >
              计算哈希值
            </button>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-3 rounded bg-red-500/20 text-red-300">
              {error}
            </div>
          )}

          {/* 计算结果 */}
          {result && (
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">MD5 (32位)</span>
                  <button
                    onClick={() => copyToClipboard(result.md5)}
                    className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded"
                  >
                    复制
                  </button>
                </div>
                <div className="font-mono text-white break-all">{result.md5}</div>
              </div>

              <div className="bg-white/5 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">SHA1 (40位)</span>
                  <button
                    onClick={() => copyToClipboard(result.sha1)}
                    className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded"
                  >
                    复制
                  </button>
                </div>
                <div className="font-mono text-white break-all">{result.sha1}</div>
              </div>

              <div className="bg-white/5 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">SHA256 (64位)</span>
                  <button
                    onClick={() => copyToClipboard(result.sha256)}
                    className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded"
                  >
                    复制
                  </button>
                </div>
                <div className="font-mono text-white break-all">{result.sha256}</div>
              </div>

              <div className="bg-white/5 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">SHA512 (128位)</span>
                  <button
                    onClick={() => copyToClipboard(result.sha512)}
                    className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded"
                  >
                    复制
                  </button>
                </div>
                <div className="font-mono text-white break-all">{result.sha512}</div>
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持计算文本的MD5、SHA1、SHA256、SHA512哈希值</li>
              <li>支持中文和特殊字符</li>
              <li>显示每种哈希值的位数</li>
              <li>支持一键复制结果</li>
              <li>所有计算在本地完成</li>
              <li>文本不会上传到服务器</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 