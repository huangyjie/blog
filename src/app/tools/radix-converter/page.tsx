'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
 
interface ConversionResult {
  binary: string
  octal: string
  decimal: string
  hex: string
  base36: string
}

export default function RadixConverterPage() {
  const [input, setInput] = useState('')
  const [sourceBase, setSourceBase] = useState(10)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [error, setError] = useState('')

  // 支持的进制选项
  const baseOptions = [
    { value: 2, label: '二进制' },
    { value: 8, label: '八进制' },
    { value: 10, label: '十进制' },
    { value: 16, label: '十六进制' },
    { value: 36, label: '三十六进制' }
  ]

  // 验证输入是否合法
  const validateInput = useCallback((value: string, base: number) => {
    const regex = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9A-Fa-f]+$/,
      36: /^[0-9A-Za-z]+$/
    }
    return regex[base as keyof typeof regex]?.test(value) || false
  }, [])

  // 转换进制
  const convert = useCallback(() => {
    if (!input.trim()) {
      setError('请输入需要转换的数值')
      setResult(null)
      return
    }

    if (!validateInput(input, sourceBase)) {
      setError(`输入的数值不是有效的${baseOptions.find(b => b.value === sourceBase)?.label}数`)
      setResult(null)
      return
    }

    try {
      // 先转换为十进制
      const decimal = parseInt(input, sourceBase)
      
      // 转换为其他进制
      setResult({
        binary: decimal.toString(2),
        octal: decimal.toString(8),
        decimal: decimal.toString(10),
        hex: decimal.toString(16).toUpperCase(),
        base36: decimal.toString(36).toUpperCase()
      })
      setError('')
    } catch (err) {
      setError('转换失败，请检查输入')
      setResult(null)
    }
  }, [input, sourceBase, validateInput])

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
        <h1 className="text-3xl font-bold text-white text-center mb-8">进制转换</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 输入区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white mb-2">源进制</label>
              <select   
                title="源进制"
                value={sourceBase}
                onChange={(e) => setSourceBase(Number(e.target.value))}
                className="w-full p-2 rounded bg-white/20 text-white [&>option]:bg-gray-800 [&>option]:text-white"
              >
                {baseOptions.map(option => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    className="bg-gray-800 text-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white mb-2">输入数值</label>
              <input
                title="输入数值"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.trim())}
                className="w-full p-2 rounded bg-white/20 text-white font-mono"
                placeholder={`请输入${baseOptions.find(b => b.value === sourceBase)?.label}数...`}
              />
            </div>
          </div>

          {/* 转换按钮 */}
          <div className="flex justify-center mb-6">
            <button
              onClick={convert}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              title="转换"
            >
              转换
            </button>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-3 rounded bg-red-500/20 text-red-300">
              {error}
            </div>
          )}

          {/* 转换结果 */}
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">二进制 (2)</span>
                  <button
                    onClick={() => copyToClipboard(result.binary)}
                    className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded"
                  >
                    复制
                  </button>
                </div>
                <div className="font-mono text-white break-all">{result.binary}</div>
              </div>
              
              <div className="bg-white/5 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">八进制 (8)</span>
                  <button
                    onClick={() => copyToClipboard(result.octal)}
                    className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded"
                  >
                    复制
                  </button>
                </div>
                <div className="font-mono text-white break-all">{result.octal}</div>
              </div>
              
              <div className="bg-white/5 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">十进制 (10)</span>
                  <button
                    onClick={() => copyToClipboard(result.decimal)}
                    className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded"
                  >
                    复制
                  </button>
                </div>
                <div className="font-mono text-white break-all">{result.decimal}</div>
              </div>
              
              <div className="bg-white/5 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">十六进制 (16)</span>
                  <button
                    onClick={() => copyToClipboard(result.hex)}
                    className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded"
                  >
                    复制
                  </button>
                </div>
                <div className="font-mono text-white break-all">{result.hex}</div>
              </div>
              
              <div className="bg-white/5 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">三十六进制 (36)</span>
                  <button
                    onClick={() => copyToClipboard(result.base36)}
                    className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded"
                  >
                    复制
                  </button>
                </div>
                <div className="font-mono text-white break-all">{result.base36}</div>
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持2、8、10、16、36进制互转</li>
              <li>二进制只能输入0和1</li>
              <li>八进制只能输入0-7的数字</li>
              <li>十六进制可以输入0-9和A-F</li>
              <li>三十六进制可以输入0-9和A-Z</li>
              <li>支持一键复制转换结果</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 