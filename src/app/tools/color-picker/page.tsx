'use client'

import { useState, useRef } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { SketchPicker } from 'react-color'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
export default function ColorPickerPage() {
  const [color, setColor] = useState('#ffffff')
  const [pickedColor, setPickedColor] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  const handleColorChange = (color: any) => {
    setColor(color.hex)
  }

  const pickColorFromScreen = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper()
        const result = await eyeDropper.open()
        setPickedColor(result.sRGBHex)
      } catch (error) {
        console.error('颜色提取失败:', error)
      }
    } else {
      alert('您的浏览器不支持 EyeDropper API')
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
          }
        }
      }
      img.src = URL.createObjectURL(file)
    }
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const imageData = ctx.getImageData(x, y, 1, 1).data
        const hexColor = `#${((1 << 24) + (imageData[0] << 16) + (imageData[1] << 8) + imageData[2]).toString(16).slice(1)}`
        setPickedColor(hexColor)
      }
    }
  }

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgb(${r}, ${g}, ${b})`
  }

  const hexToHsl = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = ((bigint >> 16) & 255) / 255
    const g = ((bigint >> 8) & 255) / 255
    const b = (bigint & 255) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return `hsl(${(h * 360).toFixed(1)}, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%)`
  }
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">颜色提取器</h1>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <SketchPicker color={color} onChange={handleColorChange} />
          
          <div className="mt-4">
            <button
              onClick={pickColorFromScreen}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              从屏幕提取颜色
            </button>
          </div>

          <div className="mt-4">
            <input  
              title="选择图片"
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="w-full p-2 rounded bg-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
          </div>

          {image && (
            <canvas ref={canvasRef} onClick={handleCanvasClick} className="mt-4 border" />
          )}

          {pickedColor && (
            <div className="mt-4 p-3 rounded bg-gray-900 text-white">
              <p>提取的颜色: <span style={{ color: pickedColor }}>{pickedColor}</span></p>
              <p>RGB: {hexToRgb(pickedColor)}</p>
              <p>HSL: {hexToHsl(pickedColor)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 