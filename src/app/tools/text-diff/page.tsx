'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { diffLines, type Change } from 'diff'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
 
export default function TextDiffPage() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [differences, setDifferences] = useState<Change[]>([])
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)

  // 比较文本
  const compareTexts = useCallback(() => {
    let firstText = text1
    let secondText = text2

    if (ignoreCase) {
      firstText = firstText.toLowerCase()
      secondText = secondText.toLowerCase()
    }

    if (ignoreWhitespace) {
      firstText = firstText.replace(/\s+/g, ' ').trim()
      secondText = secondText.replace(/\s+/g, ' ').trim()
    }

    const diffs = diffLines(firstText, secondText)
    setDifferences(diffs)
  }, [text1, text2, ignoreCase, ignoreWhitespace])

  // 清空内容
  const clearTexts = useCallback(() => {
    setText1('')
    setText2('')
    setDifferences([])
  }, [])

  // 交换文本
  const swapTexts = useCallback(() => {
    setText1(text2)
    setText2(text1)
  }, [text1, text2])
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">文本对比</h1>
        
        <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 工具栏 */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                  className="mr-2"
                />
                显示行号
              </label>
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreCase}
                  onChange={(e) => setIgnoreCase(e.target.checked)}
                  className="mr-2"
                />
                忽略大小写
              </label>
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreWhitespace}
                  onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                  className="mr-2"
                />
                忽略空白字符
              </label>
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={swapTexts}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
              >
                交换文本
              </button>
              <button
                onClick={clearTexts}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                清空
              </button>
              <button
                onClick={compareTexts}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                比较
              </button>
            </div>
          </div>

          {/* 输入区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white mb-2">文本 1:</label>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="w-full h-[300px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                placeholder="在此输入第一段文本..."
                spellCheck={false}
              />
            </div>
            <div>
              <label className="block text-white mb-2">文本 2:</label>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="w-full h-[300px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                placeholder="在此输入第二段文本..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* 对比结果 */}
          {differences.length > 0 && (
            <div>
              <label className="block text-white mb-2">对比结果:</label>
              <div className="p-4 rounded bg-gray-900 overflow-x-auto">
                <table className="w-full border-collapse font-mono text-sm">
                  <tbody>
                    {differences.map((part, index) => {
                      let bgColor = 'transparent'
                      if (part.added) bgColor = 'rgba(34, 197, 94, 0.2)' // 绿色，表示新增
                      if (part.removed) bgColor = 'rgba(239, 68, 68, 0.2)' // 红色，表示删除

                      return part.value.split('\n').map((line, lineIndex) => {
                        if (line === '' && lineIndex === part.value.split('\n').length - 1) return null
                        return (
                          <tr
                            key={`${index}-${lineIndex}`}
                            style={{ backgroundColor: bgColor }}
                          >
                            {showLineNumbers && (
                              <td className="text-gray-500 pr-4 text-right select-none w-12">
                                {lineIndex + 1}
                              </td>
                            )}
                            <td className="text-white whitespace-pre">{line}</td>
                          </tr>
                        )
                      })
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>在两个文本框中输入要对比的文本</li>
              <li>可以选择是否忽略大小写和空白字符</li>
              <li>支持显示/隐藏行号</li>
              <li>绿色表示新增内容，红色表示删除内容</li>
              <li>可以快速交换两段文本</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 