'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
type CalculatorMode = 'scientific' | 'base' | 'binary' | 'ip'

interface BaseNumber {
  decimal: string
  binary: string
  octal: string
  hex: string
}

export default function CalculatorPage() {
  const [mode, setMode] = useState<CalculatorMode>('scientific')
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  
  // 进制转换状态
  const [baseInput, setBaseInput] = useState('')
  const [baseNumbers, setBaseNumbers] = useState<BaseNumber>({
    decimal: '',
    binary: '',
    octal: '',
    hex: ''
  })

  // 二进制计算状态
  const [binaryInput, setBinaryInput] = useState('')
  const [binaryResult, setBinaryResult] = useState({
    original: '',
    inverse: '',
    complement: ''
  })

  // IP计算状态
  const [ipInput, setIpInput] = useState('')
  const [ipInfo, setIpInfo] = useState({
    networkClass: '',
    subnet: '',
    broadcast: '',
    range: '',
    hosts: 0
  })

  // 科学计算器按钮
  const scientificButtons = [
    ['(', ')', '%', 'C'],
    ['sin', 'cos', 'tan', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=', 'DEL']
  ]

  // 处理科学计算器按钮点击
  const handleScientificButton = useCallback((value: string) => {
    if (value === 'C') {
      setExpression('')
      setResult('')
      setError('')
    } else if (value === 'DEL') {
      setExpression(prev => prev.slice(0, -1))
    } else if (value === '=') {
      try {
        // 替换数学符号为 JavaScript 可计算的形式
        let evalExpression = expression
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan')
        
        const result = eval(evalExpression)
        setResult(Number(result).toString())
        setError('')
      } catch (err) {
        setError('计算错误')
        setResult('')
      }
    } else {
      setExpression(prev => prev + value)
    }
  }, [expression])

  // 进制转换
  const convertBase = useCallback((value: string, fromBase: number = 10) => {
    try {
      const decimal = parseInt(value, fromBase)
      setBaseNumbers({
        decimal: decimal.toString(10),
        binary: decimal.toString(2),
        octal: decimal.toString(8),
        hex: decimal.toString(16).toUpperCase()
      })
      setError('')
    } catch (err) {
      setError('进制转换错误')
    }
  }, [])

  // 二进制源码、反码、补码转换
  const convertBinary = useCallback((binary: string) => {
    try {
      // 检查是否是有效的二进制数
      if (!/^[01]+$/.test(binary)) {
        throw new Error('请输入有效的二进制数')
      }

      // 源码
      const original = binary

      // 反码（正数不变，负数除符号位外按位取反）
      const inverse = binary[0] === '1'
        ? '1' + binary.slice(1).split('').map(b => b === '0' ? '1' : '0').join('')
        : binary

      // 补码（反码+1）
      let complement = inverse
      if (binary[0] === '1') {
        let carry = 1
        const digits = inverse.split('')
        for (let i = digits.length - 1; i >= 0; i--) {
          if (i === 0) continue // 跳过符号位
          const sum = parseInt(digits[i]) + carry
          digits[i] = (sum % 2).toString()
          carry = Math.floor(sum / 2)
        }
        complement = digits.join('')
      }

      setBinaryResult({ original, inverse, complement })
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换错误')
    }
  }, [])

  // IP地址计算
  const calculateIP = useCallback((ip: string) => {
    try {
      const parts = ip.split('.')
      if (parts.length !== 4) throw new Error('无效的IP地址')

      const firstOctet = parseInt(parts[0])
      let networkClass = ''
      let subnet = ''
      let broadcast = ''
      let range = ''
      let hosts = 0

      // 判断IP地址类别
      if (firstOctet >= 1 && firstOctet <= 126) {
        networkClass = 'A类'
        subnet = `${parts[0]}.0.0.0`
        broadcast = `${parts[0]}.255.255.255`
        range = `${parts[0]}.0.0.1 - ${parts[0]}.255.255.254`
        hosts = Math.pow(2, 24) - 2
      } else if (firstOctet >= 128 && firstOctet <= 191) {
        networkClass = 'B类'
        subnet = `${parts[0]}.${parts[1]}.0.0`
        broadcast = `${parts[0]}.${parts[1]}.255.255`
        range = `${parts[0]}.${parts[1]}.0.1 - ${parts[0]}.${parts[1]}.255.254`
        hosts = Math.pow(2, 16) - 2
      } else if (firstOctet >= 192 && firstOctet <= 223) {
        networkClass = 'C类'
        subnet = `${parts[0]}.${parts[1]}.${parts[2]}.0`
        broadcast = `${parts[0]}.${parts[1]}.${parts[2]}.255`
        range = `${parts[0]}.${parts[1]}.${parts[2]}.1 - ${parts[0]}.${parts[1]}.${parts[2]}.254`
        hosts = Math.pow(2, 8) - 2
      } else {
        throw new Error('不支持的IP地址类别')
      }

      setIpInfo({ networkClass, subnet, broadcast, range, hosts })
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'IP地址计算错误')
    }
  }, [])
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">多功能计算器</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 模式选择 */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('scientific')}
              className={`px-4 py-2 rounded ${
                mode === 'scientific'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              科学计算器
            </button>
            <button
              onClick={() => setMode('base')}
              className={`px-4 py-2 rounded ${
                mode === 'base'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              进制转换
            </button>
            <button
              onClick={() => setMode('binary')}
              className={`px-4 py-2 rounded ${
                mode === 'binary'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              源反补转换
            </button>
            <button
              onClick={() => setMode('ip')}
              className={`px-4 py-2 rounded ${
                mode === 'ip'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              IP计算器
            </button>
          </div>

          {/* 科学计算器 */}
          {mode === 'scientific' && (
            <div>
              <div className="mb-4">
                <input
                  type="text"
                  value={expression}
                  readOnly
                  className="w-full p-4 rounded bg-gray-900 text-white font-mono text-xl"
                  placeholder="0"
                />
                {result && (
                  <div className="mt-2 text-right text-white font-mono">
                    = {result}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {scientificButtons.map((row, i) => (
                  <div key={i} className="contents">
                    {row.map((btn) => (
                      <button
                        key={btn}
                        onClick={() => handleScientificButton(btn)}
                        className="p-4 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 进制转换 */}
          {mode === 'base' && (
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">输入数值:</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={baseInput}
                    onChange={(e) => {
                      setBaseInput(e.target.value)
                      convertBase(e.target.value)
                    }}
                    className="flex-1 p-2 rounded bg-white/20 text-white font-mono"
                    placeholder="输入十进制数..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">二进制 (2):</label>
                  <input
                    type="text"
                    value={baseNumbers.binary}
                    readOnly
                    className="w-full p-2 rounded bg-gray-900 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">八进制 (8):</label>
                  <input
                    type="text"
                    value={baseNumbers.octal}
                    readOnly
                    className="w-full p-2 rounded bg-gray-900 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">十进制 (10):</label>
                  <input
                    type="text"
                    value={baseNumbers.decimal}
                    readOnly
                    className="w-full p-2 rounded bg-gray-900 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">十六进制 (16):</label>
                  <input
                    type="text"
                    value={baseNumbers.hex}
                    readOnly
                    className="w-full p-2 rounded bg-gray-900 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 源反补转换 */}
          {mode === 'binary' && (
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">输入二进制数:</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={binaryInput}
                    onChange={(e) => {
                      setBinaryInput(e.target.value)
                      convertBinary(e.target.value)
                    }}
                    className="flex-1 p-2 rounded bg-white/20 text-white font-mono"
                    placeholder="输入二进制数..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-white mb-2">原码:</label>
                  <input
                    type="text"
                    value={binaryResult.original}
                    readOnly
                    className="w-full p-2 rounded bg-gray-900 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">反码:</label>
                  <input
                    type="text"
                    value={binaryResult.inverse}
                    readOnly
                    className="w-full p-2 rounded bg-gray-900 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">补码:</label>
                  <input
                    type="text"
                    value={binaryResult.complement}
                    readOnly
                    className="w-full p-2 rounded bg-gray-900 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* IP计算器 */}
          {mode === 'ip' && (
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">输入IP地址:</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => {
                      setIpInput(e.target.value)
                      calculateIP(e.target.value)
                    }}
                    className="flex-1 p-2 rounded bg-white/20 text-white font-mono"
                    placeholder="例如: 192.168.1.1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-white mb-2">地址类别:</label>
                  <input
                    type="text"
                    value={ipInfo.networkClass}
                    readOnly
                    className="w-full p-2 rounded bg-gray-900 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">子网地址:</label>
                  <input
                    type="text"
                    value={ipInfo.subnet}
                    readOnly
                    className="w-full p-2 rounded bg-gray-900 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">广播地址:</label>
                  <input
                    type="text"
                    value={ipInfo.broadcast}
                    readOnly
                    className="w-full p-2 rounded bg-gray-900 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">可用地址范围:</label>
                  <input
                    type="text"
                    value={ipInfo.range}
                    readOnly
                    className="w-full p-2 rounded bg-gray-900 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">可用主机数:</label>
                  <input
                    type="text"
                    value={ipInfo.hosts}
                    readOnly
                    className="w-full p-2 rounded bg-gray-900 text-white font-mono"
                  />
                </div>
              </div>
            </div>
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
              <li>科学计算器支持基本运算和三角函数</li>
              <li>进制转换支持2、8、10、16进制互转</li>
              <li>源反补转换支持二进制数的各种形式转换</li>
              <li>IP计算器可计算地址类别和网络信息</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 