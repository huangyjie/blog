'use client'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useState, useCallback, useEffect } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import dynamic from 'next/dynamic'

// 动态导入 FFmpeg 相关组件
const FFmpegClient = dynamic(
  () => import('./ffmpeg-client').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="text-white text-center">
        加载音频转换组件中...
      </div>
    )
  }
)

interface AudioInfo {
  file: File
  preview: string
  size: number
  duration: number
  type: string
}

  export default function AudioConverterPage() {
  useGlobalStyles();
  const [ffmpeg, setFFmpeg] = useState<any>(null)
  const [audioFile, setAudioFile] = useState<AudioInfo | null>(null)
  const [targetFormat, setTargetFormat] = useState<string>('mp3')
  const [quality, setQuality] = useState<number>(192)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [convertedAudio, setConvertedAudio] = useState<string | null>(null)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)

  // 支持的音频格式
  const formats = [
    { value: 'mp3', label: 'MP3' },
    { value: 'wav', label: 'WAV' },
    { value: 'ogg', label: 'OGG' },
    { value: 'aac', label: 'AAC' },
    { value: 'm4a', label: 'M4A' },
    { value: 'flac', label: 'FLAC' }
  ]

  // 音频质量选项
  const qualities = [
    { value: 64, label: '64 kbps' },
    { value: 128, label: '128 kbps' },
    { value: 192, label: '192 kbps' },
    { value: 256, label: '256 kbps' },
    { value: 320, label: '320 kbps' }
  ]

  // 添加 mgg 解密函数
  const decryptMGG = async (file: File) => {
    try {
      // 这里需要实现 mgg 解密逻辑
      // 1. 读取文件头信息
      // 2. 解析加密参数
      // 3. 解密音频数据
      // 4. 返回解密后的音频数据
      throw new Error('暂不支持 QQ 音乐加密格式转换')
    } catch (err) {
      throw new Error('MGG 格式解密失败')
    }
  }

  // 处理文件选择
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // 检查文件格式
      if (!file.type.startsWith('audio/')) {
        setError('请选择音频文件')
        return 
      }

      // 创建频预览URL
      const preview = URL.createObjectURL(file)
      
      // 获取音频时长
      const audio = new Audio(preview)
      await new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', resolve)
      })

      // 设置音频文件信息
      setAudioFile({
        file,
        preview,
        size: file.size,
        duration: audio.duration,
        type: file.type
      })

      // 重要：清除之前的错误和转换结果
      setError('')
      setConvertedAudio(null)

      // 显示转换选项和按钮
      document.querySelector('.convert-options')?.classList.remove('hidden')
    } catch (err) {
      setError('音频文件加载失败')
      console.error(err)
    }
  }, [])

  // 修改 FFmpeg 加载逻辑
  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        // 获取 FFmpeg 实例和工具函数
        const { ffmpeg, toBlobURL } = await FFmpegClient()
        
        // 加载 FFmpeg 核心文件
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd'
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
        })
        
        setFFmpeg(ffmpeg)
        setFfmpegLoaded(true)
      } catch (err) {
        setError('音频转换组件加载失败')
        console.error(err)
      }
    }

    loadFFmpeg()
  }, [])

  // 修改转换函数
  const convertAudio = useCallback(async () => {
    if (!audioFile || !ffmpegLoaded || !ffmpeg) return

    setLoading(true)
    setError('')

    try {
      const { fetchFile } = await FFmpegClient()  
      
      // 写入文件
      await ffmpeg.writeFile('input', await fetchFile(audioFile.file))

      // 执行转换
      await ffmpeg.exec([
        '-i', 'input',
        '-c:a', targetFormat === 'mp3' ? 'libmp3lame' : targetFormat,
        '-b:a', `${quality}k`,
        `output.${targetFormat}`
      ])

      // 读取转换后的文件
      const data = await ffmpeg.readFile(`output.${targetFormat}`)
      
      // 创建 Blob URL
      const blob = new Blob([data], { type: `audio/${targetFormat}` })
      const url = URL.createObjectURL(blob)
      
      setConvertedAudio(url)
    } catch (err) {
      setError('转换失败，请重试')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [audioFile, ffmpegLoaded, ffmpeg, targetFormat, quality])

  // 下载转换后的音频
  const downloadAudio = useCallback(() => {
    if (!convertedAudio || !audioFile) return

    const link = document.createElement('a')
    link.href = convertedAudio
    link.download = `converted_${audioFile.file.name.split('.')[0]}.${targetFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [convertedAudio, audioFile, targetFormat])

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">音频格式转换</h1>
        
        <FFmpegClient>
          {(ffmpeg) => (
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
              {/* 文件选择 */}
              <div className="mb-6">
                <label className="block text-white mb-2">选择音频文件</label>
                <input
                  title="选择音频文件"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="w-full p-2 rounded bg-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                />
              </div>

              {audioFile && (
                <div className="mb-6 space-y-4">
                  {/* 转换选项 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2">目标格式</label>
                      <select
                        title="目标格式"
                        value={targetFormat}
                        onChange={(e) => setTargetFormat(e.target.value)}
                        className="w-full p-2 rounded bg-white/20 text-white"
                      >
                        {formats.map(format => (
                          <option key={format.value} value={format.value}>
                            {format.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white mb-2">音频质量</label>
                      <select
                        title="音频质量"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full p-2 rounded bg-white/20 text-white"
                      >
                        {qualities.map(q => (
                          <option key={q.value} value={q.value}>
                            {q.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 音频信息显示 */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 p-4 rounded">
                      <div className="text-gray-400 text-sm">原始格式</div>
                      <div className="text-white font-mono">
                        {audioFile.type.split('/')[1].toUpperCase()}
                      </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded">
                      <div className="text-gray-400 text-sm">文件大小</div>
                      <div className="text-white font-mono">
                        {formatFileSize(audioFile.size)}
                      </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded">
                      <div className="text-gray-400 text-sm">时长</div>
                      <div className="text-white font-mono">
                        {formatDuration(audioFile.duration)}
                      </div>
                    </div>
                  </div>

                  {/* 音频预览 */}
                  <div>
                    <label className="block text-white mb-2">音频预览</label>
                    <audio
                      controls
                      className="w-full"
                      src={audioFile.preview}
                    />
                  </div>

                  {/* 添加转换进度提示 */}
                  {loading && (
                    <div className="text-white text-center">
                      正在转换中，请稍候...
                    </div>
                  )}

                  {/* 转换按钮 */}
                  <button
                    onClick={convertAudio}
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

              {/* 转换结果 */}
              {convertedAudio && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2">转换结果</label>
                    <audio
                      controls
                      className="w-full"
                      src={convertedAudio}
                    />
                  </div>
                  <button
                    onClick={downloadAudio}
                    className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    下载转换后的音频
                  </button>
                </div>
              )}

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
                  <li>支持常见音频格式转换</li>
                  <li>可以选择目标格式和音频质量</li>
                  <li>支持音频预览</li>
                  <li>显示音频文件信息</li>
                  <li>支持批量转换</li>
                  <li>转换后可直接下载</li>
                </ul>
              </div>
            </div>
          )}
        </FFmpegClient>
      </div>
    </div>
  )
} 