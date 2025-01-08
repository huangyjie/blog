'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
type CodecMode = 'encode' | 'decode'

interface UrlInfo {
  protocol: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  ip?: string
}

export default function UrlCodecPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<CodecMode>('encode')
  const [error, setError] = useState('')
  const [encodeAll, setEncodeAll] = useState(false)
  const [urlInfo, setUrlInfo] = useState<UrlInfo | null>(null)

  // URL 编码
  const encodeUrl = useCallback((text: string, encodeAll: boolean) => {
    try {
      const encoded = encodeAll ? 
        encodeURIComponent(text).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`) :
        encodeURIComponent(text)
      setOutput(encoded)
      setError('')
    } catch (err) {
      setError('编码失败：' + (err instanceof Error ? err.message : '未知错误'))
      setOutput('')
    }
  }, [])

  // URL 解码
  const decodeUrl = useCallback((text: string) => {
    try {
      const decoded = decodeURIComponent(text)
      setOutput(decoded)
      setError('')
    } catch (err) {
      setError('解码失败：无效的 URL 编码')
      setOutput('')
    }
  }, [])

  // 解析 URL
  const parseUrl = useCallback(async (text: string) => {
    try {
      const url = new URL(text)
      const info: UrlInfo = {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? '443' : '80'),
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      }

      // 使用 ipapi.co 服务获取 IP 信息
      try {
        const response = await fetch(`https://ipapi.co/${url.hostname}/json/`)
        const data = await response.json()
        if (data.ip) {
          info.ip = data.ip
        }
      } catch (err) {
        console.error('IP 解析失败:', err)
        // 如果是 localhost 或 IP 地址格式，直接使用
        if (url.hostname === 'localhost' || /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(url.hostname)) {
          info.ip = url.hostname
        }
      }

      setUrlInfo(info)
      setError('')
    } catch (err) {
      setUrlInfo(null)
      setError('无效的 URL 格式')
    }
  }, [])

  // 处理编解码
  const handleCodec = useCallback(() => {
    if (!input.trim()) {
      setError('请输入需要处理的文本')
      setOutput('')
      setUrlInfo(null)
      return
    }

    if (mode === 'encode') {
      encodeUrl(input, encodeAll)
      // 如果输入看起来像 URL，尝试解析它
      if (input.includes('://')) {
        parseUrl(input)
      } else {
        setUrlInfo(null)
      }
    } else {
      decodeUrl(input)
      // 如果解码后的文本看起来像 URL，尝试解析它
      const decoded = decodeURIComponent(input)
      if (decoded.includes('://')) {
        parseUrl(decoded)
      } else {
        setUrlInfo(null)
      }
    }
  }, [input, mode, encodeAll, encodeUrl, decodeUrl, parseUrl])

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('已复制到剪贴板')
    } catch (err) {
      alert('复制失败，请手动复制')
    }
  }

  // 清空内容
  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  // 交换输入输出
  const swapText = () => {
    setInput(output)
    setOutput(input)
  }
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">URL 编解码</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 工具栏 */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('encode')}
                className={`px-4 py-2 rounded ${
                  mode === 'encode'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                编码
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-4 py-2 rounded ${
                  mode === 'decode'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                解码
              </button>
            </div>

            {mode === 'encode' && (
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={encodeAll}
                  onChange={(e) => setEncodeAll(e.target.checked)}
                  className="mr-2"
                />
                编码所有字符
              </label>
            )}

            <div className="flex gap-2 ml-auto">
              <button
                onClick={swapText}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
              >
                交换
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                清空
              </button>
              <button
                onClick={handleCodec}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                {mode === 'encode' ? '编码' : '解码'}
              </button>
            </div>
          </div>

          {/* 输入输出区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white">输入:</label>
                <button
                  onClick={() => copyToClipboard(input)}
                  className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                >
                  复制
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-[400px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                placeholder={`在此输入需要${mode === 'encode' ? '编码' : '解码'}的文本...`}
                spellCheck={false}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white">输出:</label>
                {output && (
                  <button
                    onClick={() => copyToClipboard(output)}
                    className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                  >
                    复制
                  </button>
                )}
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-[400px] p-4 rounded bg-gray-900 text-white font-mono text-sm"
                placeholder={`${mode === 'encode' ? '编码' : '解码'}结果将显示在这里...`}
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

          {/* URL 解析结果 */}
          {urlInfo && (
            <div className="mt-6">
              <h3 className="text-white font-bold mb-4">URL 解析结果:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded">
                  <div className="text-gray-300 text-sm mb-1">协议:</div>
                  <div className="text-white font-mono">{urlInfo.protocol}</div>
                </div>
                <div className="bg-white/5 p-4 rounded">
                  <div className="text-gray-300 text-sm mb-1">主机名:</div>
                  <div className="text-white font-mono">{urlInfo.hostname}</div>
                </div>
                <div className="bg-white/5 p-4 rounded">
                  <div className="text-gray-300 text-sm mb-1">端口:</div>
                  <div className="text-white font-mono">
                    {urlInfo.port} 
                    {urlInfo.port === '80' && ' (HTTP 默认端口)'}
                    {urlInfo.port === '443' && ' (HTTPS 默认端口)'}
                  </div>
                </div>
                {urlInfo.ip && (
                  <div className="bg-white/5 p-4 rounded">
                    <div className="text-gray-300 text-sm mb-1">IP 地址:</div>
                    <div className="text-white font-mono">{urlInfo.ip}</div>
                  </div>
                )}
                <div className="bg-white/5 p-4 rounded">
                  <div className="text-gray-300 text-sm mb-1">路径:</div>
                  <div className="text-white font-mono">{urlInfo.pathname || '/'}</div>
                </div>
                {urlInfo.search && (
                  <div className="bg-white/5 p-4 rounded">
                    <div className="text-gray-300 text-sm mb-1">查询参数:</div>
                    <div className="text-white font-mono">{urlInfo.search}</div>
                  </div>
                )}
                {urlInfo.hash && (
                  <div className="bg-white/5 p-4 rounded">
                    <div className="text-gray-300 text-sm mb-1">片段标识符:</div>
                    <div className="text-white font-mono">{urlInfo.hash}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持 URL 编码和解码</li>
              <li>可以选择是否编码所有字符</li>
              <li>支持一键复制结果</li>
              <li>可以快速交换输入输出</li>
              <li>自动处理特殊字符</li>
              <li>自动解析 URL 结构</li>
              <li>显示 URL 对应的 IP 地址</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 