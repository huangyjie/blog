'use client'
import { useGlobalStyles } from '@/hooks/useGlobalStyles' 
import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import JsBarcode from 'jsbarcode' 

type BarcodeFormat = 'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'CODE39' | 'ITF14'

interface BarcodeOptions {
  format: BarcodeFormat
  width: number
  height: number
  displayValue: boolean
  text: string
  background: string
  lineColor: string
}

export default function BarcodePage() {
  const [text, setText] = useState('')
  const [format, setFormat] = useState<BarcodeFormat>('CODE128')
  const [options, setOptions] = useState<BarcodeOptions>({
    format: 'CODE128',
    width: 2,
    height: 100,
    displayValue: true,
    text: '',
    background: '#ffffff',
    lineColor: '#000000'
  })
  const [error, setError] = useState('')

  const generateBarcode = useCallback(() => {
    try {
      const canvas = document.getElementById('barcodeCanvas') as HTMLCanvasElement
      JsBarcode(canvas, text, {
        ...options,
        format: format,
        text: text
      })
      setError('')
    } catch (err) {
      setError('生成条形码失败,请检查输入内容是否符合所选格式要求')
    }
  }, [text, format, options])

  const downloadBarcode = () => {
    const canvas = document.getElementById('barcodeCanvas') as HTMLCanvasElement
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `barcode-${text}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  useGlobalStyles();  
  return (
    <div className="min-h-screen">
      <RandomBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-black/50 backdrop-blur-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">条形码生成器</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">条形码内容</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
                placeholder="请输入要生成条形码的内容"
              />
            </div>

            <div>
              <label className="block text-white mb-2">条形码格式</label>
              <select
                title="条形码格式"
                value={format}
                onChange={(e) => setFormat(e.target.value as BarcodeFormat)}
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                style={{
                  background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 0.75rem center/1em`,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <option value="CODE128" className="bg-gray-800">CODE128 (通用格式)</option>
                <option value="EAN13" className="bg-gray-800">EAN-13 (商品码)</option>
                <option value="EAN8" className="bg-gray-800">EAN-8 (短商品码)</option>
                <option value="UPC" className="bg-gray-800">UPC (通用产品码)</option>
                <option value="CODE39" className="bg-gray-800">CODE39 (字母数字)</option>
                <option value="ITF14" className="bg-gray-800">ITF-14 (物流包装)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">条码宽度</label>
                <input
                  title="条码宽度"
                  type="number"
                  value={options.width}
                  onChange={(e) => setOptions({...options, width: Number(e.target.value)})}
                  className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
                  min="1"
                  max="4"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">条码高度</label>
                <input
                  title="条码高度"
                  type="number"
                  value={options.height}
                  onChange={(e) => setOptions({...options, height: Number(e.target.value)})}
                  className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
                  min="50"
                  max="200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center text-white">
                <input
                  title="显示文本"
                  type="checkbox"
                  checked={options.displayValue}
                  onChange={(e) => setOptions({...options, displayValue: e.target.checked})}
                  className="mr-2"
                />
                显示文本
              </label>
            </div>

            <button
              onClick={generateBarcode}
              disabled={!text}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              生成条形码
            </button>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <div className="mt-6 p-4 bg-white rounded-lg">
              <canvas id="barcodeCanvas"></canvas>
            </div>

            <button
              onClick={downloadBarcode}
              disabled={!text}
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              下载条形码
            </button>
          </div>

          <div className="mt-8 text-gray-300">
            <h2 className="text-xl font-semibold mb-2">使用说明</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>支持多种条形码格式</li>
              <li>可自定义条码宽度和高度</li>
              <li>可选择是否显示文本</li>
              <li>支持PNG格式下载</li>
              <li>不同格式有不同的内容要求</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}