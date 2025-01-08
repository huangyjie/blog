'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
export default function JsonFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [mode, setMode] = useState<'beautify' | 'minify'>('beautify')

  const formatJson = useCallback(() => {
    if (!input.trim()) {
      setError('请输入需要格式化的 JSON')
      setOutput('')
      return
    }

    try {
      // 先解析确保是有效的 JSON
      const parsed = JSON.parse(input)
      
      // 根据模式选择格式化方式
      const formatted = mode === 'beautify'
        ? JSON.stringify(parsed, null, indentSize)
        : JSON.stringify(parsed)
      
      setOutput(formatted)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '无效的 JSON 格式')
      setOutput('')
    }
  }, [input, indentSize, mode])

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
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
    } catch (err) {
      alert('无法访问剪贴板')
    }
  }

  const validateJson = useCallback(() => {
    if (!input.trim()) {
      setError('请输入需要验证的 JSON')
      return false
    }

    try {
      JSON.parse(input)
      setError('JSON 格式有效')
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '无效的 JSON 格式')
      return false
    }
  }, [input])
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">JSON 格式化</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 工具栏 */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-white">格式化方式:</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'beautify' | 'minify')}
                className="p-2 rounded bg-white/20 text-white [&>option]:text-gray-900"
                title="选择格式化方式"
              >
                <option value="beautify">美化</option>
                <option value="minify">压缩</option>
              </select>
            </div>

            {mode === 'beautify' && (
              <div className="flex items-center gap-2">
                <label className="text-white">缩进空格:</label>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  className="p-2 rounded bg-white/20 text-white [&>option]:text-gray-900"
                  title="选择缩进大小"
                >
                  <option value="2">2 空格</option>
                  <option value="4">4 空格</option>
                  <option value="8">8 空格</option>
                </select>
              </div>
            )}

            <div className="flex gap-2 ml-auto">
              <button
                onClick={validateJson}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
              >
                验证
              </button>
              <button
                onClick={formatJson}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                格式化
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                清空
              </button>
            </div>
          </div>

          {/* 输入输出区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white">输入 JSON:</label>
                <button
                  onClick={handlePaste}
                  className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                >
                  粘贴
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-[400px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                placeholder="在此输入或粘贴 JSON..."
                spellCheck={false}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white">格式化结果:</label>
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
                placeholder="格式化后的 JSON 将显示在这里..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className={`mt-4 p-3 rounded ${
              error === 'JSON 格式有效' 
                ? 'bg-green-500/20 text-green-300'
                : 'bg-red-500/20 text-red-300'
            }`}>
              {error}
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持 JSON 格式化和压缩</li>
              <li>可以调整缩进空格数量</li>
              <li>支持 JSON 格式验证</li>
              <li>支持一键复制和粘贴</li>
              <li>自动检测 JSON 格式错误</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 