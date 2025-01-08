'use client'

import { useState } from 'react'
import { Book, Coffee, Terminal, Database, Code } from 'lucide-react'

interface ArticleCardProps {
  title: string
  description?: string
  href: string
  icon: string
  date?: string
  className?: string
}

export function ArticleCard({
  title,
  description,
  href,
  icon,
  date,
  className = ''
}: ArticleCardProps) {
  const [imageError, setImageError] = useState(false)

  const getIconComponent = () => {
    if (!imageError) {
      return (
        <img
          src={`/icons/${icon}.svg`}
          alt={title}
          className="w-8 h-8"
          onError={() => setImageError(true)}
        />
      )
    }
    // 如果图标加载失败，显示默认图标
    return <Code className="w-8 h-8 text-gray-400" />
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`block group ${className}`}
    >
      <div className="flex items-start">
        {/* 图标部分 */}
        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mr-4">
          {getIconComponent()}
        </div>

        <div className="flex-1">
          {/* 标题 */}
          <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          
          {/* 描述 */}
          {description && (
            <p className="text-gray-300 text-sm mb-2">
              {description}
            </p>
          )}

          {/* 跳转按钮 */}
          <div className="flex items-center justify-between">
            <button className="bg-white/10 backdrop-blur-sm text-sm px-4 py-1.5 rounded-lg hover:bg-white/20 transition-colors border border-white/20">
              查看详情
            </button>
            {/* 日期 */}
            {date && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {date}
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  )
} 