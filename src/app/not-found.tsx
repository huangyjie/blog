import Link from 'next/link'
import { RandomBackground } from '@/components/ui/random-background'

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <RandomBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-12">
          {/* 404标题 */}
          <div className="relative">
            <h1 className="text-[12rem] md:text-[15rem] font-bold text-white opacity-10 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-6xl md:text-8xl font-bold text-white animate-pulse">
                404
              </h2>
            </div>
          </div>
          
          {/* 错误描述 */}
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-semibold text-white">
              Oops! 页面未找到
            </h2>
            <p className="text-gray-300 max-w-lg mx-auto text-lg">
              抱歉，您访问的页面可能已被移动、删除或暂时不可用。
            </p>
          </div>

          {/* 返回按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
            <Link 
              href="/"
              className="group px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                <svg 
                  className="w-5 h-5 transition-transform group-hover:-translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回首页
              </span>
            </Link>
            <Link 
              href="javascript:history.back()"
              className="group px-8 py-3 bg-gray-500/50 hover:bg-gray-500/70 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                返回上页
                <svg 
                  className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>

          {/* 装饰元素 */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-40 h-40 border border-white/5 rounded-lg backdrop-blur-sm"
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
