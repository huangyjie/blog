'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import CryptoJS from 'crypto-js'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
 
type CryptoMode = 'encode' | 'decode'
type Algorithm = 'base64' | 'md5' | 'sha1' | 'sha256' | 'sha512' | 'aes'

interface AlgorithmOption {
  value: Algorithm
  label: string
  canDecode: boolean
  needKey?: boolean
}

export default function TextCryptoPage() {
  const [mode, setMode] = useState<CryptoMode>('encode')
  const [algorithm, setAlgorithm] = useState<Algorithm>('base64')
  const [input, setInput] = useState('')
  const [key, setKey] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  // 支持的算法
  const algorithms: AlgorithmOption[] = [
    { value: 'base64', label: 'Base64', canDecode: true },
    { value: 'md5', label: 'MD5', canDecode: false },
    { value: 'sha1', label: 'SHA1', canDecode: false },
    { value: 'sha256', label: 'SHA256', canDecode: false },
    { value: 'sha512', label: 'SHA512', canDecode: false },
    { value: 'aes', label: 'AES', canDecode: true, needKey: true }
  ]

  // ��密
  const encrypt = useCallback(() => {
    if (!input.trim()) {
      setError('请输入需要加密的文本')
      setOutput('')
      return
    }

    if (algorithm === 'aes' && !key.trim()) {
      setError('使用AES加密需要提供密钥')
      setOutput('')
      return
    }

    try {
      let result = ''
      switch (algorithm) {
        case 'base64':
          result = btoa(unescape(encodeURIComponent(input)))
          break
        case 'md5':
          result = CryptoJS.MD5(input).toString()
          break
        case 'sha1':
          result = CryptoJS.SHA1(input).toString()
          break
        case 'sha256':
          result = CryptoJS.SHA256(input).toString()
          break
        case 'sha512':
          result = CryptoJS.SHA512(input).toString()
          break
        case 'aes':
          result = CryptoJS.AES.encrypt(input, key).toString()
          break
      }
      setOutput(result)
      setError('')
    } catch (err) {
      setError('加密失败：' + (err instanceof Error ? err.message : '未知错误'))
      setOutput('')
    }
  }, [input, algorithm, key])

  // 解密
  const decrypt = useCallback(() => {
    if (!input.trim()) {
      setError('请输入需要解密的文本')
      setOutput('')
      return
    }

    if (algorithm === 'aes' && !key.trim()) {
      setError('使用AES解密需要提供密钥')
      setOutput('')
      return
    }

    try {
      let result = ''
      switch (algorithm) {
        case 'base64':
          result = decodeURIComponent(escape(atob(input)))
          break
        case 'aes':
          const bytes = CryptoJS.AES.decrypt(input, key)
          result = bytes.toString(CryptoJS.enc.Utf8)
          break
        default:
          throw new Error('该算法不支持解密')
      }
      setOutput(result)
      setError('')
    } catch (err) {
      setError('解密失败：' + (err instanceof Error ? err.message : '未知错误'))
      setOutput('')
    }
  }, [input, algorithm, key])

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
        <h1 className="text-3xl font-bold text-white text-center mb-8">文本加密</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 工具栏 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-white mb-2">模式</label>
              <select 
                title="模式"
                value={mode}
                onChange={(e) => setMode(e.target.value as CryptoMode)}
                className="w-full p-2 rounded bg-white/20 text-white [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="encode" className="bg-gray-800 text-white">加密</option>
                <option value="decode" className="bg-gray-800 text-white">解密</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-2">算法</label>
              <select
                title="算法"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
                className="w-full p-2 rounded bg-white/20 text-white [&>option]:bg-gray-800 [&>option]:text-white"
              >
                {algorithms
                  .filter(algo => mode === 'encode' || algo.canDecode)
                  .map(algo => (
                    <option 
                      key={algo.value} 
                      value={algo.value}
                      className="bg-gray-800 text-white"
                    >
                      {algo.label}
                    </option>
                  ))
                }
              </select>
            </div>
            {algorithms.find(a => a.value === algorithm)?.needKey && (
              <div>
                <label className="block text-white mb-2">密钥</label>
                <input
                  title="密钥"
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full p-2 rounded bg-white/20 text-white"
                  placeholder="请输入密钥..."
                />
              </div>
            )}
          </div>

          {/* 输入输出区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white">输入:</label>
                <button
                  onClick={() => setInput('')}
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                >
                  清空
                </button>
              </div>
              <textarea
                title="输入文本"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-[300px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                placeholder={`请输入需要${mode === 'encode' ? '加密' : '解密'}的文本...`}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white">输出:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(output)}
                    className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                  >
                    复制
                  </button>
                  <button
                    onClick={mode === 'encode' ? encrypt : decrypt}
                    className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    {mode === 'encode' ? '加密' : '解密'}
                  </button>
                </div>
              </div>
              <textarea
                title="输出文本"
                value={output}
                readOnly
                className="w-full h-[300px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                placeholder={`${mode === 'encode' ? '加密' : '解密'}结果将显示在这里...`}
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
              <li>支持多种加密算法</li>
              <li>Base64支持加密和解密</li>
              <li>MD5/SHA系列是单向加密</li>
              <li>AES需要提供密钥</li>
              <li>支持一键复制结果</li>
              <li>支持中文加密</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 