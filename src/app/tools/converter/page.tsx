'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'

interface ImageInfo {
  file: File
  preview: string
  size: number
  type: string
}

type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'

export default function ImageConverterPage() {
  const [image, setImage] = useState<ImageInfo | null>(null)
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/jpeg')
  const [quality, setQuality] = useState(0.9)
  const [loading, setLoading] = useState(false)
  const [convertedImage, setConvertedImage] = useState<string | null>(null)

  const formats: { value: ImageFormat; label: string }[] = [
    { value: 'image/jpeg', label: 'JPEG' },
    { value: 'image/png', label: 'PNG' },
    { value: 'image/webp', label: 'WebP' },
    { value: 'image/gif', label: 'GIF' }
  ]

  const handleImageSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImage({
        file,
        preview: reader.result as string,
        size: file.size,
        type: file.type
      })
      setConvertedImage(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const convertImage = useCallback(async () => {
    if (!image) return

    setLoading(true)
    try {
      // 创建一个临时的 canvas 元素
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('无法创建 canvas 上下文')

      // 创建一个临时的 Image 对象
      const img = new Image()
      img.src = image.preview

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      // 设置 canvas 尺寸
      canvas.width = img.width
      canvas.height = img.height

      // 在 canvas 上绘制图片
      ctx.drawImage(img, 0, 0)

      // 转换格式
      const convertedDataUrl = canvas.toDataURL(targetFormat, quality)
      setConvertedImage(convertedDataUrl)
    } catch (error) {
      console.error('转换失败:', error)
      alert('图片转换失败，请重试')
    } finally {
      setLoading(false)
    }
  }, [image, targetFormat, quality])

  const downloadImage = useCallback(() => {
    if (!convertedImage || !image) return

    const extension = targetFormat.split('/')[1]
    const link = document.createElement('a')
    link.href = convertedImage
    link.download = `converted_${image.file.name.split('.')[0]}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [convertedImage, image, targetFormat])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">图片格式转换</h1>
        
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="mb-6">
            <label htmlFor="image-input" className="block text-white mb-2">选择图片</label>
            <input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full p-2 rounded bg-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
          </div>

          {image && (
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="format" className="block text-white mb-2">目标格式</label>
                  <select
                    id="format"
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value as ImageFormat)}
                    className="w-full p-2 rounded bg-white/20 text-white [&>option]:bg-gray-800 [&>option]:text-white"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    {formats.map((format) => (
                      <option 
                        key={format.value} 
                        value={format.value}
                        className="bg-gray-800 text-white"
                      >
                        {format.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="quality" className="block text-white mb-2">
                    图片质量 ({Math.round(quality * 100)}%)
                  </label>
                  <input
                    id="quality"
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <button
                onClick={convertImage}
                disabled={loading}
                className={`w-full py-2 rounded-lg ${
                  loading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
              >
                {loading ? '转换中...' : '开始转换'}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {image && (
              <div>
                <h3 className="text-white font-bold mb-2">原始图片</h3>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-2">
                  <img
                    src={image.preview}
                    alt="原图预览"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gray-300 text-sm">
                  格式：{image.type.split('/')[1].toUpperCase()}
                  <br />
                  大小：{formatFileSize(image.size)}
                </p>
              </div>
            )}
            
            {convertedImage && (
              <div>
                <h3 className="text-white font-bold mb-2">转换后</h3>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-2">
                  <img
                    src={convertedImage}
                    alt="转换后预览"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gray-300 text-sm">
                  格式：{targetFormat.split('/')[1].toUpperCase()}
                </p>
                <button
                  onClick={downloadImage}
                  className="mt-2 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  下载转换后的图片
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 