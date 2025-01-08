'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
 
interface PasswordOptions {
  length: number
  includeLowercase: boolean
  includeUppercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  minNumbers: number
  minLetters: number
  minSymbols: number
}

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('')
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    minNumbers: 2,
    minLetters: 2,
    minSymbols: 2
  })

  const characters = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  }

  const generatePassword = useCallback(() => {
    let charset = ''
    let result = ''
    
    // 添加必需的字符
    if (options.includeLowercase) {
      charset += characters.lowercase
      for (let i = 0; i < options.minLetters; i++) {
        result += characters.lowercase[Math.floor(Math.random() * characters.lowercase.length)]
      }
    }
    if (options.includeUppercase) {
      charset += characters.uppercase
      for (let i = 0; i < options.minLetters; i++) {
        result += characters.uppercase[Math.floor(Math.random() * characters.uppercase.length)]
      }
    }
    if (options.includeNumbers) {
      charset += characters.numbers
      for (let i = 0; i < options.minNumbers; i++) {
        result += characters.numbers[Math.floor(Math.random() * characters.numbers.length)]
      }
    }
    if (options.includeSymbols) {
      charset += characters.symbols
      for (let i = 0; i < options.minSymbols; i++) {
        result += characters.symbols[Math.floor(Math.random() * characters.symbols.length)]
      }
    }

    // 填充剩余长度
    const remainingLength = options.length - result.length
    for (let i = 0; i < remainingLength; i++) {
      result += charset[Math.floor(Math.random() * charset.length)]
    }

    // 打乱密码顺序
    result = result.split('').sort(() => Math.random() - 0.5).join('')
    
    setPassword(result)
  }, [options])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      alert('密码已复制到剪贴板')
    } catch (err) {
      alert('复制失败，请手动复制')
    }
  }

  const handleOptionChange = (key: keyof PasswordOptions, value: number | boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">随机密码生成器</h1>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 密码显示区域 */}
          <div className="mb-6">
            <div className="flex gap-4 items-center">
              <input
                type="text"
                value={password}
                readOnly
                className="flex-1 p-4 rounded bg-gray-900 text-white font-mono text-xl"
                placeholder="点击生成按钮创建密码"
              />
              <button
                onClick={copyToClipboard}
                disabled={!password}
                className="px-4 py-4 bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:bg-gray-500"
                title="复制密码"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>

          {/* 选项设置区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white mb-2">密码长度: {options.length}</label>
              <input
                title="密码长度"
                type="range"
                min="8"
                max="32"
                value={options.length}
                onChange={(e) => handleOptionChange('length', Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-white mb-2">最少数字个数: {options.minNumbers}</label>
              <input
                title="最少数字个数"
                type="range"
                min="0"
                max="10"
                value={options.minNumbers}
                onChange={(e) => handleOptionChange('minNumbers', Number(e.target.value))}
                className="w-full"
                disabled={!options.includeNumbers}
              />
            </div>

            <div>
              <label className="block text-white mb-2">最少字母个数: {options.minLetters}</label>
              <input
                title="最少字母个数"
                type="range"
                min="0"
                max="10"
                value={options.minLetters}
                onChange={(e) => handleOptionChange('minLetters', Number(e.target.value))}
                className="w-full"
                disabled={!options.includeLowercase && !options.includeUppercase}
              />
            </div>

            <div>
              <label className="block text-white mb-2">最少符号个数: {options.minSymbols}</label>
              <input
                title="最少符号个数"
                type="range"
                min="0"
                max="10"
                value={options.minSymbols}
                onChange={(e) => handleOptionChange('minSymbols', Number(e.target.value))}
                className="w-full"
                disabled={!options.includeSymbols}
              />
            </div>
          </div>

          {/* 字符类型选择 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <label className="flex items-center text-white">
              <input
                title="小写字母"
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => handleOptionChange('includeLowercase', e.target.checked)}
                className="mr-2"
              />
              小写字母 (a-z)
            </label>
            <label className="flex items-center text-white">
              <input
                title="大写字母"
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => handleOptionChange('includeUppercase', e.target.checked)}
                className="mr-2"
              />
              大写字母 (A-Z)
            </label>
            <label className="flex items-center text-white">
              <input
                title="数字"
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => handleOptionChange('includeNumbers', e.target.checked)}
                className="mr-2"
              />
              数字 (0-9)
            </label>
            <label className="flex items-center text-white">
              <input
                title="特殊符号"
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => handleOptionChange('includeSymbols', e.target.checked)}
                className="mr-2"
              />
              特殊符号 (!@#$%^&*)
            </label>
          </div>

          {/* 生成按钮 */}
          <button
            onClick={generatePassword}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            title="生成随机密码"
          >
            生成随机密码
          </button>

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>密码长度建议在12-16位以上</li>
              <li>建议同时包含大小写字母、数字和特殊符号</li>
              <li>可以设置每种字符的最少个数</li>
              <li>生成的密码完全随机，不会存储</li>
              <li>点击复制按钮可快速复制密码</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 