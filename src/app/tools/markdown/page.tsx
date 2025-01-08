'use client'

import { useState, useCallback, useRef } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import dynamic from 'next/dynamic'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
 
// 动态导入 html2pdf
const html2pdf = dynamic(() => import('html2pdf.js'), {
  ssr: false,
  loading: () => null
})

// 添加 Markdown 语法提示
const markdownTips = {
  basic: [
    { label: '标题', syntax: '# 标题文本' },
    { label: '粗体', syntax: '**粗体文本**' },
    { label: '斜体', syntax: '*斜体文本*' },
    { label: '链接', syntax: '[链接文本](URL)' },
    { label: '图片', syntax: '![替代文本](图片URL)' },
    { label: '引用', syntax: '> 引用文本' },
    { label: '代码块', syntax: '```语言\n代码内容\n```' },
    { label: '分割线', syntax: '---' },
  ],
  advanced: [
    { label: '表格', syntax: '| 表头 | 表头 |\n|------|------|\n| 内容 | 内容 |' },
    { label: '任务列表', syntax: '- [x] 已完成\n- [ ] 未完成' },
    { label: '脚注', syntax: '文本[^1]\n\n[^1]: 脚注内容' },
    { label: '数学公式', syntax: '$E = mc^2$' },
  ]
}

interface Theme {
  id: string
  name: string
  style: any
  previewClass: string
}

const themes: Theme[] = [
  { id: 'dark', name: '深色主题', style: vscDarkPlus, previewClass: 'prose-invert' },
  { id: 'light', name: '浅色主题', style: vs, previewClass: 'prose-gray' }
]

// 添加默认的 Markdown 文本
const defaultMarkdown = `# Markdown 编辑器

## 基本功能

- 实时预览
- 语法高亮
- 主题切换
- 导出多种格式

## 使用方法

1. 在左侧输入 Markdown 文本
2. 右侧实时预览效果
3. 使用工具栏的功能按钮

## 代码示例

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

## 表格示例

| 功能 | 说明 |
|------|------|
| 预览 | 实时预览 |
| 导出 | 支持多种格式 |

> 开始编辑吧！
`

// 修改工具函数，使用客户端专用的方式
const downloadFile = (content: string, filename: string, type: string) => {
  if (typeof window === 'undefined') return // 确保在客户端运行
  
  try {
    const blob = new Blob([content], { type })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (err) {
    console.error('下载失败:', err)
    alert('下载失败，请重试')
  }
}

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [showPreview, setShowPreview] = useState(true)
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])
  const [showTips, setShowTips] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  // 修改导出为 HTML 函数
  const exportHtml = useCallback(() => {
    if (typeof window === 'undefined' || !previewRef.current) return

    const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Markdown Export</title>
  <style>
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      line-height: 1.5; 
      padding: 2rem;
      ${currentTheme.id === 'dark' ? 'background: #1a1a1a; color: #fff;' : ''} 
    }
    pre { background: #f0f0f0; padding: 1rem; border-radius: 4px; }
    code { font-family: monospace; }
    img { max-width: 100%; height: auto; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; }
  </style>
</head>
<body>
  ${previewRef.current.innerHTML}
</body>
</html>`

    downloadFile(content, 'markdown-export.html', 'text/html;charset=utf-8')
  }, [currentTheme, previewRef])

  // 修改导出为 PDF 函数
  const exportPdf = useCallback(async () => {
    if (typeof window === 'undefined' || !previewRef.current) return

    try {
      const { default: html2pdf } = await import('html2pdf.js') 
      const element = previewRef.current
      const options = {
        margin: 1,
        filename: 'markdown-export.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }

      await html2pdf().from(element).set(options).save()
    } catch (err) {
      console.error('PDF导出失败:', err)
      alert('PDF导出失败，请重试')
    }
  }, [previewRef])

  // 修改导出为 Markdown 函数
  const exportMarkdown = useCallback(() => {
    if (typeof window === 'undefined') return
    downloadFile(markdown, 'document.md', 'text/markdown;charset=utf-8')
  }, [markdown])

  // 插入语法提示
  const insertSyntax = useCallback((syntax: string) => {
    setMarkdown(prev => prev + '\n' + syntax + '\n')
  }, [])

  // 添加清除函数
  const clearContent = useCallback(() => {
    if (window.confirm('确定要清空所有内容吗？')) {
      setMarkdown('')
    }
  }, [])
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Markdown 预览</h1>
        
        <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 工具栏 */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className={`px-4 py-2 rounded ${
                  !showPreview
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                编辑
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className={`px-4 py-2 rounded ${
                  showPreview
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                预览
              </button>
            </div>

            <div className="flex gap-2">
              <select
                title="主题切换"
                value={currentTheme.id}
                onChange={(e) => setCurrentTheme(themes.find(t => t.id === e.target.value) || themes[0])}
                className="px-4 py-2 rounded bg-white/10 text-white [&>option]:text-gray-900"
              >
                {themes.map(theme => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowTips(prev => !prev)}
                className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20"
              >
                语法提示
              </button>

              <button
                onClick={clearContent}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                title="清空内容"
              >
                清空
              </button>
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={exportMarkdown}
                className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
              >
                导出MD
              </button>
              <button
                onClick={exportHtml}
                className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                导出HTML
              </button>
              <button
                onClick={exportPdf}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                导出PDF
              </button>
            </div>
          </div>

          {/* 语法提示面板 */}
          {showTips && (
            <div className="mb-6 grid grid-cols-2 gap-4 bg-white/5 p-4 rounded">
              <div>
                <h3 className="text-white font-bold mb-2">基础语法</h3>
                <div className="grid grid-cols-2 gap-2">
                  {markdownTips.basic.map(tip => (
                    <button
                      key={tip.label}
                      onClick={() => insertSyntax(tip.syntax)}
                      className="text-left p-2 text-sm text-white hover:bg-white/10 rounded"
                    >
                      {tip.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">高级语法</h3>
                <div className="grid grid-cols-2 gap-2">
                  {markdownTips.advanced.map(tip => (
                    <button
                      key={tip.label}
                      onClick={() => insertSyntax(tip.syntax)}
                      className="text-left p-2 text-sm text-white hover:bg-white/10 rounded"
                    >
                      {tip.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 编辑和预览区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={showPreview ? 'hidden md:block' : 'block'}>
              <label className="block text-white mb-2">Markdown 文本:</label>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-[600px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                placeholder="在此输入 Markdown 文本..."
                spellCheck={false}
              />
            </div>

            <div className={!showPreview ? 'hidden md:block' : 'block'}>
              <label className="block text-white mb-2">预览效果:</label>
              <div className="w-full h-[600px] p-4 rounded bg-gray-900 overflow-auto">
                <div ref={previewRef} className={`prose ${currentTheme.previewClass} max-w-none`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            style={currentTheme.style}
                            language={match[1]}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code {...props} className={className}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持标准 Markdown 语法</li>
              <li>支持 GFM (GitHub Flavored Markdown)</li>
              <li>代码块支持语法高亮</li>
              <li>支持数学公式</li>
              <li>支持表格和任务列表</li>
              <li>支持导出 MD/HTML/PDF</li>
              <li>提供常用语法提示</li>
              <li>支持深色/浅色主题切换</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 