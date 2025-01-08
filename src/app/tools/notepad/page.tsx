'use client'

import { useState, useCallback, useEffect } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
 
export default function NotepadPage() {
  const [content, setContent] = useState('')
  const [autoSave, setAutoSave] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  // 从本地存储加载内容
  useEffect(() => {
    const savedContent = localStorage.getItem('notepad-content')
    if (savedContent) {
      setContent(savedContent)
      updateCounts(savedContent)
    }
  }, [])

  // 更新字数和字符统计
  const updateCounts = useCallback((text: string) => {
    setCharCount(text.length)
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
  }, [])

  // 处理内容变化
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    updateCounts(newContent)

    if (autoSave) {
      localStorage.setItem('notepad-content', newContent)
      setLastSaved(new Date())
    }
  }, [autoSave, updateCounts])

  // 手动保存
  const handleSave = useCallback(() => {
    localStorage.setItem('notepad-content', content)
    setLastSaved(new Date())
  }, [content])

  // 清空内容
  const handleClear = useCallback(() => {
    if (window.confirm('确定要清空所有内容吗？')) {
      setContent('')
      localStorage.removeItem('notepad-content')
      setLastSaved(null)
      updateCounts('')
    }
  }, [updateCounts])

  // 复制内容
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content)
      alert('已复制到剪贴板')
    } catch (err) {
      alert('复制失败，请手动复制')
    }
  }, [content])

  // 添加导出功能
  const handleExport = useCallback((format: 'txt' | 'md') => {
    if (!content.trim()) {
      alert('没有可导出的内容')
      return
    }

    try {
      // 创建 Blob
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      
      // 创建下载链接
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // 设置文件名
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
      link.download = `notepad_${timestamp}.${format}`
      
      // 触发下载
      document.body.appendChild(link)
      link.click()
      
      // 清理
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('导出失败，请重试')
      console.error('导出失败:', err)
    }
  }, [content])
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">在线记事本</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 工具栏 */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="mr-2"
                />
                自动保存
              </label>

              {/* 添加导出按钮组 */}
              <div className="relative group">
                <button
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
                >
                  导出
                </button>
                <div className="absolute left-0 mt-1 w-32 py-2 bg-gray-800 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={() => handleExport('txt')}
                    className="block w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                  >
                    导出为 TXT
                  </button>
                  <button
                    onClick={() => handleExport('md')}
                    className="block w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                  >
                    导出为 MD
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                复制
              </button>
              {!autoSave && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                >
                  保存
                </button>
              )}
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                清空
              </button>
            </div>
          </div>

          {/* 编辑区域 */}
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full h-[500px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
            placeholder="开始输入..."
            spellCheck={false}
          />

          {/* 状态栏 */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-300">
            <div>字符数: {charCount}</div>
            <div>字数: {wordCount}</div>
            {lastSaved && (
              <div>
                上次保存: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持自动保存到本地</li>
              <li>显示字数和字符统计</li>
              <li>可以一键复制内容</li>
              <li>数据保存在浏览器中</li>
              <li>支持清空和手动保存</li>
              <li>支持导出为 TXT 和 MD 格式</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 