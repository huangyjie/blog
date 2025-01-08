'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import imageCompression from 'browser-image-compression'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'

interface ImageInfo {
  file: File
  preview: string
  size: number
}

export default function ImageCompressPage() {
  const [originalImage, setOriginalImage] = useState<ImageInfo | null>(null)
  const [compressedImage, setCompressedImage] = useState<ImageInfo | null>(null)
  const [quality, setQuality] = useState(0.8)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [loading, setLoading] = useState(false)

  const handleImageSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setOriginalImage({
        file,
        preview: reader.result as string,
        size: file.size
      })
      setCompressedImage(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const compressImage = useCallback(async () => {
    if (!originalImage) return

    setLoading(true)
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: maxWidth,
        useWebWorker: true,
        quality
      }

      const compressedFile = await imageCompression(originalImage.file, options)
      const reader = new FileReader()
      
      reader.onloadend = () => {
        setCompressedImage({
          file: compressedFile,
          preview: reader.result as string,
          size: compressedFile.size
        })
        setLoading(false)
      }
      reader.readAsDataURL(compressedFile)
    } catch (error) {
      console.error('压缩失败:', error)
      alert('图片压缩失败，请重试')
      setLoading(false)
    }
  }, [originalImage, quality, maxWidth])

  const downloadImage = useCallback(() => {
    if (!compressedImage) return

    const link = document.createElement('a')
    link.href = compressedImage.preview
    link.download = `compressed_${originalImage?.file.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [compressedImage, originalImage])

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
        <h1 className="text-3xl font-bold text-white text-center mb-8">图片压缩</h1>
        
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

          {originalImage && (
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quality" className="block text-white mb-2">压缩质量 ({Math.round(quality * 100)}%)</label>
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
                <div>
                  <label htmlFor="max-width" className="block text-white mb-2">最大宽度 ({maxWidth}px)</label>
                  <input
                    id="max-width"
                    type="range"
                    min="800"
                    max="3840"
                    step="160"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <button
                onClick={compressImage}
                disabled={loading}
                className={`w-full py-2 rounded-lg ${
                  loading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
              >
                {loading ? '压缩中...' : '开始压缩'}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {originalImage && (
              <div>
                <h3 className="text-white font-bold mb-2">原始图片</h3>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-2">
                  <img
                    src={originalImage.preview}
                    alt="原图预览"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gray-300 text-sm">
                  大小：{formatFileSize(originalImage.size)}
                </p>
              </div>
            )}
            
            {compressedImage && (
              <div>
                <h3 className="text-white font-bold mb-2">压缩后</h3>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-2">
                  <img
                    src={compressedImage.preview}
                    alt="压缩后预览"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gray-300 text-sm">
                  大小：{formatFileSize(compressedImage.size)}
                  （压缩率：{Math.round((1 - compressedImage.size / originalImage!.size) * 100)}%）
                </p>
                <button
                  onClick={downloadImage}
                  className="mt-2 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  下载压缩图片
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 