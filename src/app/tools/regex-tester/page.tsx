'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
 
interface RegexFlags {
  global: boolean
  ignoreCase: boolean
  multiline: boolean
  dotAll: boolean
  unicode: boolean
  sticky: boolean
}

interface Match {
  text: string
  index: number
  length: number
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('')
  const [testString, setTestString] = useState('')
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  })
  const [matches, setMatches] = useState<Match[]>([])
  const [error, setError] = useState('')

  // 获取当前标志字符串
  const getFlagsString = useCallback(() => {
    let result = ''
    if (flags.global) result += 'g'
    if (flags.ignoreCase) result += 'i'
    if (flags.multiline) result += 'm'
    if (flags.dotAll) result += 's'
    if (flags.unicode) result += 'u'
    if (flags.sticky) result += 'y'
    return result
  }, [flags])

  // 执行正则测试
  const testRegex = useCallback(() => {
    if (!pattern) {
      setError('请输入正则表达式')
      setMatches([])
      return
    }

    try {
      const regex = new RegExp(pattern, getFlagsString())
      const results: Match[] = []
      let match

      if (flags.global) {
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            text: match[0],
            index: match.index,
            length: match[0].length
          })
        }
      } else {
        match = regex.exec(testString)
        if (match) {
          results.push({
            text: match[0],
            index: match.index,
            length: match[0].length
          })
        }
      }

      setMatches(results)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '无效的正则表达式')
      setMatches([])
    }
  }, [pattern, testString, flags, getFlagsString])

  // 切换标志
  const toggleFlag = useCallback((flag: keyof RegexFlags) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }))
  }, [])

  // 高亮显示匹配文本
  const getHighlightedText = useCallback(() => {
    if (!matches.length) return testString

    let result = []
    let lastIndex = 0

    matches.forEach((match, index) => {
      // 添加匹配前的文本
      if (match.index > lastIndex) {
        result.push(
          <span key={`text-${index}`}>
            {testString.slice(lastIndex, match.index)}
          </span>
        )
      }

      // 添加高亮的匹配文本
      result.push(
        <span
          key={`match-${index}`}
          className="bg-yellow-500/50 rounded px-0.5"
          title={`匹配 #${index + 1}`}
        >
          {match.text}
        </span>
      )

      lastIndex = match.index + match.length
    })

    // 添加最后一个匹配后的文本
    if (lastIndex < testString.length) {
      result.push(
        <span key="text-end">
          {testString.slice(lastIndex)}
        </span>
      )
    }

    return result
  }, [matches, testString])
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">正则表达式测试</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 正则输入区域 */}
          <div className="mb-6">
            <label className="block text-white mb-2">正则表达式:</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="flex-1 p-2 rounded bg-white/20 text-white font-mono"
                placeholder="输入正则表达式..."
              />
              <button
                onClick={testRegex}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                测试
              </button>
            </div>
          </div>

          {/* 标志选择 */}
          <div className="mb-6">
            <label className="block text-white mb-2">正则标志:</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.global}
                  onChange={() => toggleFlag('global')}
                  className="mr-2"
                />
                全局匹配 (g)
              </label>
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.ignoreCase}
                  onChange={() => toggleFlag('ignoreCase')}
                  className="mr-2"
                />
                忽略大小写 (i)
              </label>
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.multiline}
                  onChange={() => toggleFlag('multiline')}
                  className="mr-2"
                />
                多行匹配 (m)
              </label>
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.dotAll}
                  onChange={() => toggleFlag('dotAll')}
                  className="mr-2"
                />
                点匹配所有 (s)
              </label>
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.unicode}
                  onChange={() => toggleFlag('unicode')}
                  className="mr-2"
                />
                Unicode (u)
              </label>
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.sticky}
                  onChange={() => toggleFlag('sticky')}
                  className="mr-2"
                />
                粘性匹配 (y)
              </label>
            </div>
          </div>

          {/* 测试文本输入 */}
          <div className="mb-6">
            <label className="block text-white mb-2">测试文本:</label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="w-full h-[200px] p-4 rounded bg-white/20 text-white font-mono"
              placeholder="输入要测试的文本..."
            />
          </div>

          {/* 匹配结果 */}
          <div className="mb-6">
            <label className="block text-white mb-2">
              匹配结果: {matches.length ? `找到 ${matches.length} 个匹配` : '无匹配'}
            </label>
            <div className="p-4 rounded bg-white/20 min-h-[100px] text-white font-mono whitespace-pre-wrap">
              {error ? (
                <span className="text-red-400">{error}</span>
              ) : (
                getHighlightedText()
              )}
            </div>
          </div>

          {/* 匹配详情 */}
          {matches.length > 0 && (
            <div>
              <label className="block text-white mb-2">匹配详情:</label>
              <div className="space-y-2">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="p-2 rounded bg-white/10 text-white"
                  >
                    <div className="font-bold">匹配 #{index + 1}:</div>
                    <div className="font-mono">
                      文本: {match.text}
                      <br />
                      位置: {match.index}
                      <br />
                      长度: {match.length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>输入正则表达式和测试文本</li>
              <li>选择需要的正则标志</li>
              <li>点击测试按钮查看结果</li>
              <li>匹配结果会高亮显示</li>
              <li>可以查看每个匹配的详细信息</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 