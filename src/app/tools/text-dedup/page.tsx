'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
 
export default function TextDedupPage() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [stats, setStats] = useState({
    originalLines: 0,
    uniqueLines: 0,
    duplicates: 0
  })
  const [caseSensitive, setCaseSensitive] = useState(true)
  const [trimLines, setTrimLines] = useState(true)
  const [ignoreEmpty, setIgnoreEmpty] = useState(true)

  const deduplicateText = useCallback(() => {
    if (!text.trim()) return

    let lines = text.split('\n')
    const originalCount = lines.length

    // 预处理
    if (trimLines) {
      lines = lines.map(line => line.trim())
    }
    if (ignoreEmpty) {
      lines = lines.filter(line => line.length > 0)
    }
    
    // 去重
    const uniqueLines = new Set(
      caseSensitive ? lines : lines.map(line => line.toLowerCase())
    )
    
    // 保持原始大小写
    const resultLines = caseSensitive
      ? Array.from(uniqueLines)
      : Array.from(new Set(lines.map(line => {
          const lower = line.toLowerCase()
          return lines.find(l => l.toLowerCase() === lower) || line
        })))

    setResult(resultLines.join('\n'))
    setStats({
      originalLines: originalCount,
      uniqueLines: resultLines.length,
      duplicates: originalCount - resultLines.length
    })
  }, [text, caseSensitive, trimLines, ignoreEmpty])

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
        <h1 className="text-3xl font-bold text-white text-center mb-8">文本去重</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 选项设置 */}
          <div className="flex flex-wrap gap-4 mb-6">
            <label className="flex items-center text-white cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="mr-2"
              />
              区分大小写
            </label>
            <label className="flex items-center text-white cursor-pointer">
              <input
                type="checkbox"
                checked={trimLines}
                onChange={(e) => setTrimLines(e.target.checked)}
                className="mr-2"
              />
              去除首尾空格
            </label>
            <label className="flex items-center text-white cursor-pointer">
              <input
                type="checkbox"
                checked={ignoreEmpty}
                onChange={(e) => setIgnoreEmpty(e.target.checked)}
                className="mr-2"
              />
              忽略空行
            </label>
          </div>

          {/* 输入区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white">原始文本:</label>
                <button
                  onClick={() => setText('')}
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                >
                  清空
                </button>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-[400px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                placeholder="在此输入需要去重的文本..."
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white">去重结果:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(result)}
                    className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                  >
                    复制
                  </button>
                  <button
                    onClick={deduplicateText}
                    className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    去重
                  </button>
                </div>
              </div>
              <textarea
                value={result}
                readOnly
                className="w-full h-[400px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                placeholder="去重后的文本将显示在这里..."
              />
            </div>
          </div>

          {/* 统计信息 */}
          {result && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded">
                <div className="text-gray-400 text-sm">原始行数</div>
                <div className="text-xl font-bold text-white">{stats.originalLines}</div>
              </div>
              <div className="bg-white/5 p-4 rounded">
                <div className="text-gray-400 text-sm">去重后行数</div>
                <div className="text-xl font-bold text-white">{stats.uniqueLines}</div>
              </div>
              <div className="bg-white/5 p-4 rounded">
                <div className="text-gray-400 text-sm">重复行数</div>
                <div className="text-xl font-bold text-white">{stats.duplicates}</div>
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持按行去重</li>
              <li>可选是否区分大小写</li>
              <li>可选是否去除首尾空格</li>
              <li>可选是否忽略空行</li>
              <li>显示详细的统计信息</li>
              <li>支持一键复制结果</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 