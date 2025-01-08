'use client'

import { useState, useEffect } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
interface FFmpegClientProps {
  children: (ffmpeg: FFmpeg | null) => React.ReactNode
}

export default function FFmpegClient({ children }: FFmpegClientProps) {
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const ffmpegInstance = new FFmpeg()
        const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/umd'
        
        await ffmpegInstance.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
          workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
        })
        
        setFFmpeg(ffmpegInstance)
        setLoaded(true)
      } catch (error) {
        console.error('FFmpeg 加载失败:', error)
        setError('音频转换组件加载失败，请刷新页面重试')
      }
    }

    load()
  }, [])

  if (!loaded) {
    return (
      <div className="text-white text-center">
        加载音频转换组件中...
      </div>
    )
  }

  return children(ffmpeg)
} 