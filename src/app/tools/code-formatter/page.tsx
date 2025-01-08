'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import prettier from 'prettier/standalone'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import * as prettierPluginHtml from 'prettier/plugins/html'
import * as prettierPluginPostcss from 'prettier/plugins/postcss'
import * as prettierPluginMarkdown from 'prettier/plugins/markdown'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
type Language = 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'markdown'

interface LanguageOption {
  value: Language
  label: string
  parser: string
  plugins: any[]
}

export default function CodeFormatterPage() {
  const [code, setCode] = useState('')
  const [formatted, setFormatted] = useState('')
  const [language, setLanguage] = useState<Language>('javascript')
  const [error, setError] = useState('')
  const [tabWidth, setTabWidth] = useState(2)
  const [useTabs, setUseTabs] = useState(false)
  const [printWidth, setPrintWidth] = useState(80)

  // 支持的语言
  const languages: LanguageOption[] = [
    { 
      value: 'javascript', 
      label: 'JavaScript', 
      parser: 'babel',
      plugins: [prettierPluginBabel, prettierPluginEstree]
    },
    { 
      value: 'typescript', 
      label: 'TypeScript', 
      parser: 'babel-ts',
      plugins: [prettierPluginBabel, prettierPluginEstree]
    },
    { 
      value: 'html', 
      label: 'HTML', 
      parser: 'html',
      plugins: [prettierPluginHtml]
    },
    { 
      value: 'css', 
      label: 'CSS', 
      parser: 'css',
      plugins: [prettierPluginPostcss]
    },
    { 
      value: 'json', 
      label: 'JSON', 
      parser: 'json',
      plugins: [prettierPluginEstree]
    },
    { 
      value: 'markdown', 
      label: 'Markdown', 
      parser: 'markdown',
      plugins: [prettierPluginMarkdown]
    }
  ]

  // 格式化代码
  const formatCode = useCallback(async () => {
    if (!code.trim()) {
      setError('请输入需要格式化的代码')
      setFormatted('')
      return
    }

    try {
      const currentLang = languages.find(l => l.value === language)
      if (!currentLang) {
        throw new Error('不支持的语言')
      }

      const formatted = await prettier.format(code, {
        parser: currentLang.parser,
        plugins: currentLang.plugins,
        tabWidth,
        useTabs,
        printWidth,
        semi: true,
        singleQuote: true,
        trailingComma: 'es5'
      })
      setFormatted(formatted)
      setError('')
    } catch (err) {
      setError('格式化失败：' + (err instanceof Error ? err.message : '未知错误'))
      setFormatted('')
    }
  }, [code, language, tabWidth, useTabs, printWidth, languages])

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
        <h1 className="text-3xl font-bold text-white text-center mb-8">代码格式化</h1>
        
        <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 工具栏 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-white mb-2">编程语言</label>
              <select
                title="编程语言"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full p-2 rounded bg-white/20 text-white [&>option]:bg-gray-800 [&>option]:text-white"
              >
                {languages.map(lang => (
                  <option 
                    key={lang.value} 
                    value={lang.value}
                    className="bg-gray-800 text-white"
                  >
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white mb-2">缩进宽度</label>
              <select
                title="缩进宽度"
                value={tabWidth}
                onChange={(e) => setTabWidth(Number(e.target.value))}
                className="w-full p-2 rounded bg-white/20 text-white [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value={2} className="bg-gray-800 text-white">2 空格</option>
                <option value={4} className="bg-gray-800 text-white">4 空格</option>
                <option value={8} className="bg-gray-800 text-white">8 空格</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-2">每行最大长度</label>
              <input
                type="number"
                title="每行最大长度"
                value={printWidth}
                onChange={(e) => setPrintWidth(Number(e.target.value))}
                min={40}
                max={120}
                className="w-full p-2 rounded bg-white/20 text-white"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={useTabs}
                  onChange={(e) => setUseTabs(e.target.checked)}
                  className="mr-2"
                />
                使用Tab缩进
              </label>
            </div>
          </div>

          {/* 输入输出区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white">输入代码:</label>
                <button
                  onClick={() => setCode('')}
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                >
                  清空
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[500px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                placeholder="在此输入需要格式化的代码..."
                spellCheck={false}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white">格式化结果:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(formatted)}
                    className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                  >
                    复制
                  </button>
                  <button
                    onClick={formatCode}
                    className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    格式化
                  </button>
                </div>
              </div>
              <textarea
                value={formatted}
                readOnly
                className="w-full h-[500px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                placeholder="格式化后的代码将显示在这里..."
                spellCheck={false}
              />
            </div>
          </div>

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
              <li>支持多种编程语言的代码格式化</li>
              <li>可以调整缩进和行宽</li>
              <li>支持一键复制结果</li>
              <li>所有格式化在本地完成</li>
              <li>代码不会上传到服务器</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}