'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
type Mode = 'text' | 'image'

export default function Base64ConverterPage() {
  const [mode, setMode] = useState<Mode>('text')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // 文本编码
  const encodeText = useCallback(() => {
    if (!input.trim()) {
      setError('请输入需要编码的文本')
      setOutput('')
      return
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(input)))
      setOutput(encoded)
      setError('')
    } catch (err) {
      setError('编码失败：' + (err instanceof Error ? err.message : '未知错误'))
      setOutput('')
    }
  }, [input])

  // 文本解码
  const decodeText = useCallback(() => {
    if (!input.trim()) {
      setError('请输入需要解码的 Base64 字符串')
      setOutput('')
      return
    }

    try {
      const decoded = decodeURIComponent(escape(atob(input)))
      setOutput(decoded)
      setError('')
    } catch (err) {
      setError('解码失败：无效的 Base64 字符串')
      setOutput('')
    }
  }, [input])

  // 处理图片选择
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件')
      return
    }

    const reader = new FileReader()
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setInput(reader.result)
        setImagePreview(reader.result)
        setError('')
      }
    }

    reader.onerror = () => {
      setError('读取图片失败')
    }

    reader.readAsDataURL(file)
  }, [])

  // 下载 Base64 图片
  const downloadImage = useCallback(() => {
    if (!input) return

    const link = document.createElement('a')
    link.href = input
    link.download = 'image.' + input.split(';')[0].split('/')[1]
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [input])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('已复制到剪贴板')
    } catch (err) {
      alert('复制失败，请手动复制')
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    setImagePreview(null)
  }
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Base64 转换</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 模式选择 */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('text')}
              className={`px-4 py-2 rounded ${
                mode === 'text'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              文本转换
            </button>
            <button
              onClick={() => setMode('image')}
              className={`px-4 py-2 rounded ${
                mode === 'image'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              图片转换
            </button>
          </div>

          {mode === 'text' ? (
            <>
              {/* 文本转换工具栏 */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={encodeText}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  编码
                </button>
                <button
                  onClick={decodeText}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                >
                  解码
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors ml-auto"
                >
                  清空
                </button>
              </div>

              {/* 文本输入输出区域 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-white">输入:</label>
                    <button
                      onClick={() => copyToClipboard(input)}
                      className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                    >
                      复制
                    </button>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full h-[400px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                    placeholder="在此输入需要转换的文本..."
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-white">输出:</label>
                    {output && (
                      <button
                        onClick={() => copyToClipboard(output)}
                        className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                      >
                        复制
                      </button>
                    )}
                  </div>
                  <textarea
                    value={output}
                    readOnly
                    className="w-full h-[400px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                    placeholder="转换结果将显示在这里..."
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 图片转换区域 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">选择图片:</label>
                  <input
                    title="选择图片"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full p-2 rounded bg-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  />
                </div>

                {imagePreview && (
                  <div>
                    <label className="block text-white mb-2">图片预览:</label>
                    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="预览"
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}

                {input && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-white">Base64 字符串:</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(input)}
                          className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                        >
                          复制
                        </button>
                        <button
                          onClick={downloadImage}
                          className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                        >
                          下载图片
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={input}
                      readOnly
                      className="w-full h-[200px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                      placeholder="Base64 编码将显示在这里..."
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mt-4 p-3 rounded bg-red-500/20 text-red-300">
              {error}
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持文本和图片的 Base64 转换</li>
              <li>文本支持编码和解码</li>
              <li>图片支持预览和下载</li>
              <li>支持一键复制转换结果</li>
              <li>支持 UTF-8 编码的文本</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 