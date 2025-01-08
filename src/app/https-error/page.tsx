import Link from 'next/link'
import { RandomBackground } from '@/components/ui/random-background'

export default function HttpsError() {
  // 获取当前URL并转换为HTTP
  const getHttpUrl = () => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href
      return currentUrl.replace('https://', 'http://')
    }
    return '#'
  }

  return (
    <div className="min-h-screen">
      <RandomBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-12">
          {/* 图标 */}
          <div className="relative w-32 h-32 animate-bounce">
            <svg 
              className="w-full h-full text-yellow-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          
          {/* 标题和描述 */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              需要使用 HTTP 访问
            </h1>
            <div className="space-y-4">
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                此网站仅支持 HTTP 协议访问。请点击下方按钮切换到 HTTP 协议继续访问。
              </p>
              <div className="flex flex-col space-y-2 text-gray-400">
                <p className="text-sm">为什么会看到此页面？</p>
                <ul className="text-sm space-y-1">
                  <li>• 您正在使用 HTTPS 协议访问本站</li>
                  <li>• 出于特殊原因，本站仅支持 HTTP 协议</li>
                  <li>• 需要手动切换到 HTTP 协议继续访问</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
            <Link 
              href={getHttpUrl()}
              className="group px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                切换到 HTTP 继续访问
              </span>
            </Link>
          </div>

          {/* 装饰元素 */}
          <div className="absolute inset-0 -z-10 overflow-hidden opacity-50">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-40 h-40 border border-yellow-500/10 rounded-lg backdrop-blur-sm"
                  style={{
                    transform: `rotate(${i * 12}deg) scale(${1 + i * 0.1})`,
                    animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
                    opacity: 0.1 - i * 0.01
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 