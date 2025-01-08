'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
type SortOrder = 'asc' | 'desc'
type SortType = 'alpha' | 'length' | 'number'

export default function TextSortPage() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [sortType, setSortType] = useState<SortType>('alpha')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [trimLines, setTrimLines] = useState(true)
  const [ignoreEmpty, setIgnoreEmpty] = useState(true)

  const sortText = useCallback(() => {
    if (!text.trim()) return

    let lines = text.split('\n')

    // 预处理
    if (trimLines) {
      lines = lines.map(line => line.trim())
    }
    if (ignoreEmpty) {
      lines = lines.filter(line => line.length > 0)
    }

    // 排序函数
    const compareFn = (a: string, b: string) => {
      let compareResult = 0

      switch (sortType) {
        case 'alpha':
          if (!caseSensitive) {
            a = a.toLowerCase()
            b = b.toLowerCase()
          }
          compareResult = a.localeCompare(b)
          break
        case 'length':
          compareResult = a.length - b.length
          break
        case 'number':
          const numA = parseFloat(a) || 0
          const numB = parseFloat(b) || 0
          compareResult = numA - numB
          break
      }

      return sortOrder === 'asc' ? compareResult : -compareResult
    }

    const sortedLines = [...lines].sort(compareFn)
    setResult(sortedLines.join('\n'))
  }, [text, sortOrder, sortType, caseSensitive, trimLines, ignoreEmpty])

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
        <h1 className="text-3xl font-bold text-white text-center mb-8">文本排序</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 排序选项 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white mb-2">排序方式</label>
              <select 
                title="排序方式"
                value={sortType}
                onChange={(e) => setSortType(e.target.value as SortType)}
                className="w-full p-2 rounded bg-white/20 text-white [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="alpha" className="bg-gray-800 text-white">按字母</option>
                <option value="length" className="bg-gray-800 text-white">按长度</option>
                <option value="number" className="bg-gray-800 text-white">按数值</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-2">排序顺序</label>
              <select
                title="排序顺序"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="w-full p-2 rounded bg-white/20 text-white [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="asc" className="bg-gray-800 text-white">升序</option>
                <option value="desc" className="bg-gray-800 text-white">降序</option>
              </select>
            </div>
          </div>

          {/* 其他选项 */}
          <div className="flex flex-wrap gap-4 mb-6">
            <label className="flex items-center text-white cursor-pointer">
              <input
                title="区分大小写"
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="mr-2"
              />
              区分大小写
            </label>
            <label className="flex items-center text-white cursor-pointer">
              <input
                title="去除首尾空格"
                type="checkbox"
                checked={trimLines}
                onChange={(e) => setTrimLines(e.target.checked)}
                className="mr-2"
              />
              去除首尾空格
            </label>
            <label className="flex items-center text-white cursor-pointer">
              <input
                title="忽略空行"
                type="checkbox"
                checked={ignoreEmpty}
                onChange={(e) => setIgnoreEmpty(e.target.checked)}
                className="mr-2"
              />
              忽略空行
            </label>
          </div>

          {/* 输入输出区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white">输入文本:</label>
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
                placeholder="在此输入需要排序的文本..."
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white">排序结果:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(result)}
                    className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                  >
                    复制
                  </button>
                  <button
                    onClick={sortText}
                    className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    排序
                  </button>
                </div>
              </div>
              <textarea
                value={result}
                readOnly
                className="w-full h-[400px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                placeholder="排序后的文本将显示在这里..."
              />
            </div>
          </div>

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持按字母、长度、数值排序</li>
              <li>支持升序和降序排序</li>
              <li>可选是否区分大小写</li>
              <li>可选是否去除首尾空格</li>
              <li>可选是否忽略空行</li>
              <li>支持一键复制结果</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 