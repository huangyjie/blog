'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
interface ColorValues {
  hex: string
  rgb: {
    r: number
    g: number
    b: number
  }
  hsl: {
    h: number
    s: number
    l: number
  }
}

export default function ColorConverterPage() {
  const [color, setColor] = useState<ColorValues>({
    hex: '#1E90FF',
    rgb: { r: 30, g: 144, b: 255 },
    hsl: { h: 210, s: 100, l: 56 }
  })

  // RGB 转 HEX
  const rgbToHex = useCallback((r: number, g: number, b: number): string => {
    const toHex = (n: number) => {
      const hex = n.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
  }, [])

  // HEX 转 RGB
  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }, [])

  // RGB 转 HSL
  const rgbToHsl = useCallback((r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }, [])

  // 处理颜色变化
  const handleColorChange = useCallback((type: 'hex' | 'rgb' | 'hsl', value: string | number, component?: string) => {
    let newColor = { ...color }

    if (type === 'hex') {
      const hex = value as string
      if (/^#[0-9A-F]{6}$/i.test(hex)) {
        const rgb = hexToRgb(hex)
        if (rgb) {
          newColor = {
            hex: hex.toUpperCase(),
            rgb,
            hsl: rgbToHsl(rgb.r, rgb.g, rgb.b)
          }
        }
      }
    } else if (type === 'rgb' && component) {
      const val = Math.min(255, Math.max(0, Number(value)))
      newColor.rgb = { ...newColor.rgb, [component]: val }
      newColor.hex = rgbToHex(newColor.rgb.r, newColor.rgb.g, newColor.rgb.b)
      newColor.hsl = rgbToHsl(newColor.rgb.r, newColor.rgb.g, newColor.rgb.b)
    }

    setColor(newColor)
  }, [color, hexToRgb, rgbToHex, rgbToHsl])

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
        <h1 className="text-3xl font-bold text-white text-center mb-8">颜色转换</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 颜色预览 */}
          <div className="mb-8">
            <div className="flex gap-4 items-center">
              <div 
                className="w-32 h-32 rounded-lg shadow-lg" 
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => copyToClipboard(color.hex)}
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <p className="text-gray-400 text-sm mb-1">HEX</p>
                  <p className="text-white font-mono">{color.hex}</p>
                </button>
                <button
                  onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)}
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <p className="text-gray-400 text-sm mb-1">RGB</p>
                  <p className="text-white font-mono">
                    {`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`}
                  </p>
                </button>
                <button
                  onClick={() => copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`)}
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <p className="text-gray-400 text-sm mb-1">HSL</p>
                  <p className="text-white font-mono">
                    {`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`}
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* 颜色输入 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white mb-2">HEX 颜色值</label>
              <input
                type="text"
                value={color.hex}
                onChange={(e) => handleColorChange('hex', e.target.value)}
                className="w-full p-2 rounded bg-white/20 text-white font-mono"
                placeholder="#000000"
                title="输入HEX颜色值"
              />
            </div>

            <div>
              <label className="block text-white mb-2">颜色选择器</label>
              <input
                type="color"
                value={color.hex}
                onChange={(e) => handleColorChange('hex', e.target.value)}
                className="w-full h-10 rounded bg-white/20"
                title="选择颜色"
              />
            </div>

            <div>
              <label className="block text-white mb-2">RGB 值</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    value={color.rgb.r}
                    onChange={(e) => handleColorChange('rgb', e.target.value, 'r')}
                    min="0"
                    max="255"
                    className="w-full p-2 rounded bg-white/20 text-white font-mono"
                    placeholder="R"
                    title="红色值(0-255)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={color.rgb.g}
                    onChange={(e) => handleColorChange('rgb', e.target.value, 'g')}
                    min="0"
                    max="255"
                    className="w-full p-2 rounded bg-white/20 text-white font-mono"
                    placeholder="G"
                    title="绿色值(0-255)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={color.rgb.b}
                    onChange={(e) => handleColorChange('rgb', e.target.value, 'b')}
                    min="0"
                    max="255"
                    className="w-full p-2 rounded bg-white/20 text-white font-mono"
                    placeholder="B"
                    title="蓝色值(0-255)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持 HEX、RGB、HSL 颜色格式互转</li>
              <li>可以直接使用颜色选择器选择颜色</li>
              <li>点击颜色值可以快速复制</li>
              <li>RGB 值范围：0-255</li>
              <li>支持实时预览颜色效果</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 