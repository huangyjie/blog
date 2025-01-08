'use client'

import { useState } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
export default function TranslatorPage() {
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const translate = async () => {
    if (!sourceText.trim()) {
      setError('请输入需要翻译的文本')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/translate?text=${encodeURIComponent(sourceText)}`)
      
      if (!response.ok) {
        throw new Error(`翻译请求失败: ${response.status}`)
      }

      const text = await response.text()
      // 解析返回的文本，提取翻译结果
      const resultMatch = text.match(/结果：(.+)/)
      if (resultMatch && resultMatch[1]) {
        setTranslatedText(resultMatch[1])
      } else {
        throw new Error('无法解析翻译结果')
      }
    } catch (err) {
      console.error('Translation error:', err)
      setError(
        err instanceof Error 
          ? `翻译失败: ${err.message}` 
          : '翻译服务暂时不可用，请稍后重试'
      )
      setTranslatedText('')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('已复制到剪贴板')
    } catch (err) {
      alert('复制失败，请手动复制')
    }
  }

  // 添加回车键翻译功能
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      translate()
    }
  }
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">中英互译</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={translate}
                disabled={loading}
                className={`px-6 py-2 rounded-lg ${
                  loading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors ml-auto`}
              >
                {loading ? '翻译中...' : '翻译'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white">原文:</label>
                  <button
                    onClick={() => copyToClipboard(sourceText)}
                    className="px-4 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                  >
                    复制原文
                  </button>
                </div>
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full h-[300px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                  placeholder="在此输入需要翻译的文本..."
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white">译文:</label>
                  {translatedText && (
                    <button
                      onClick={() => copyToClipboard(translatedText)}
                      className="px-4 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                    >
                      复制译文
                    </button>
                  )}
                </div>
                <textarea
                  value={translatedText}
                  readOnly
                  className="w-full h-[300px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                  placeholder="翻译结果将显示在这里..."
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-red-400 text-sm">{error}</p>
            )}
          </div>

          <div className="text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持中英文互译</li>
              <li>自动识别中英文</li>
              <li>支持复制原文和译文</li>
              <li>支持长文本翻译</li>
              <li>按回车键快速翻译</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 