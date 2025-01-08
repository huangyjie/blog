'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigationConfig } from '@/config/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentYear] = useState(new Date().getFullYear())
  
  // 控制页面滚动
  useEffect(() => {
    if (isOpen) {
      // 禁用页面滚动
      document.body.style.overflow = 'hidden'
    } else {
      // 恢复页面滚动
      document.body.style.overflow = 'unset'
    }
    
    // 清理函数
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    setIsAdmin(!!adminToken)
  }, [])

  useEffect(() => {
    const event = new CustomEvent('sidebarStateChange', {
      detail: { isOpen }
    })
    window.dispatchEvent(event)
  }, [isOpen])

  // 阻止侧边栏的滚动事件传播到页面
  const handleNavScroll = (e: React.UIEvent<HTMLElement>) => {
    e.stopPropagation()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 - 调整透明度 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* 侧边栏 - 使用透明背景 */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed top-0 right-0 h-full w-80 
              bg-transparent backdrop-blur-xl
              border-l border-white/10
              z-50"
          >
            <div className="relative flex flex-col h-full">
              {/* 侧边栏头部 - 使用透明背景 */}
              <div className="flex items-center justify-between p-6
                border-b border-white/10
                bg-white/5">
                <h2 className="text-xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 
                  text-transparent bg-clip-text">
                  导航菜单
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10
                    transition-colors duration-200"
                  aria-label="关闭菜单"
                >
                  <svg 
                    className="w-5 h-5 text-gray-500 dark:text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 导航链接 - 调整悬停效果 */}
              <nav 
                className="flex-1 overflow-y-auto py-6 px-4 space-y-8
                  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
                  scrollbar-track-transparent hover:scrollbar-thumb-gray-400
                  dark:hover:scrollbar-thumb-gray-500"
                onScroll={handleNavScroll}
              >
                {navigationConfig.map((section) => (
                  <motion.div 
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="mb-4 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </h2>
                    <div className="space-y-1.5">
                      {section.items
                        .filter(item => !item.isAdmin || isAdmin)
                        .map((item) => {
                          const isActive = pathname === item.href
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={onClose}
                              className={`
                                group flex items-center gap-4 px-4 py-3 rounded-xl
                                transition-all duration-300 relative
                                ${isActive 
                                  ? 'bg-white/10 text-violet-400' 
                                  : 'hover:bg-white/5 text-gray-300 hover:text-white'
                                }
                              `}
                            >
                              {item.icon && (
                                <item.icon 
                                  className={`w-5 h-5 transition-colors duration-200
                                    ${isActive 
                                      ? 'text-violet-500' 
                                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                                    }`}
                                />
                              )}
                              <div>
                                <span className="font-medium">{item.title}</span>
                                {item.description && (
                                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="absolute left-0 w-1 h-8 bg-violet-500 rounded-r-full"
                                  transition={{ type: "spring", damping: 15, stiffness: 100 }}
                                />
                              )}
                            </Link>
                          )
                        })}
                    </div>
                  </motion.div>
                ))}
              </nav>

              {/* 底部版权信息 */}
              <div className="p-6 space-y-3 text-sm 
                border-t border-white/10
                bg-white/5">
                <div className="flex items-center gap-2">
                  <img 
                    src="/icons/Record.svg" 
                    alt="备案图标" 
                    className="w-4 h-4 opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <a 
                    href="https://beian.miit.gov.cn/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 
                      hover:text-violet-600 dark:hover:text-violet-400 
                      transition-colors duration-200"
                  >
                    [输入你的备案号]
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <img 
                    src="/icons/copyright.svg" 
                    alt="版权图标" 
                    className="w-3.5 h-3.5 opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <span>{currentYear} [输入你的名字]. 保留所有权利。</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 