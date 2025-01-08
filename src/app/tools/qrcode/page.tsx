'use client'

import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
 
export default function QRCodeGenerator() {

  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')

  const downloadQRCode = () => {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = 'qrcode.png'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">二维码生成器</h1>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="mb-6">
            <label className="block text-white mb-2">文本内容</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 rounded bg-white/20 text-white"
              rows={4}
              placeholder="输入要转换的文本或链接"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="qr-size" className="block text-white mb-2">二维码大小</label>
              <input
                id="qr-size"
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                min="128"
                max="512"
                step="32"
                className="w-full p-2 rounded bg-white/20 text-white"
                placeholder="输入二维码尺寸(128-512)"
                title="二维码尺寸"
              />
            </div>
            <div>
              <label htmlFor="fg-color" className="block text-white mb-2">前景色</label>
              <input
                id="fg-color"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full p-1 rounded bg-white/20"
                title="二维码前景色"
              />
            </div>
            <div>
              <label htmlFor="bg-color" className="block text-white mb-2">背景色</label>
              <input
                id="bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full p-1 rounded bg-white/20"
                title="二维码背景色"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            {text && (
              <div className="p-4 bg-white rounded-lg">
                <QRCodeCanvas
                  id="qrcode"
                  value={text}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H"
                  includeMargin={true}
                />
              </div>
            )}
            
            <button
              onClick={downloadQRCode}
              disabled={!text}
              className={`px-6 py-2 rounded-lg ${
                text 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              下载二维码
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 