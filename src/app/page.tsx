'use client'

import { useState, useEffect, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import Link from 'next/link'
import Announcements from '@/components/Announcements'
import PinnedAnnouncements from '@/components/ui/pinned-announcements'
import RandomQuote from '@/components/ui/random-quote'
import { ClickParticles } from '@/components/ui/click-particles'
import { tools } from '@/app/tools/page'
import { articles } from '@/app/posts/page'
import { apiEndpoints } from '@/app/api-docs/page'
import { ChatWidget } from '@/components/ui/chat-widget'
import { motion } from 'framer-motion'

// 添加全局样式来隐藏滚动条
const globalStyles = `
  /* 隐藏默认滚动条 */
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  /* 为了兼容 Firefox */
  * {
    scrollbar-width: none;
  }

  /* 为了兼容 IE */
  * {
    -ms-overflow-style: none;
  }

  /* 添加淡入动画 */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.2s ease-out;
  }
`;

type IconProps = {
  className?: string;
  gradient?: boolean;
}

function TypewriterText({ text, delay = 100, showCursor = true }: { 
  text: string, 
  delay?: number,
  showCursor?: boolean 
}) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursorState, setShowCursorState] = useState(true)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, delay])

  // 将光标闪烁间隔从 800ms 改为 1200ms
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursorState(prev => !prev)
    }, 1200) // 更慢的闪烁速度
    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <span className="relative">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
        {displayText}
      </span>
      {showCursor && (
        <span 
          className={`
            absolute -right-[2px] top-0 h-full w-[2px] 
            bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400
            transition-opacity duration-500
            ${showCursorState && currentIndex < text.length ? 'opacity-100' : 'opacity-0'}
            ${currentIndex >= text.length ? 'animate-cursor-blink-slow' : ''}
          `}
        />
      )}
    </span>
  )
}

function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const startTime = new Date('[输入你的开始时间]')

  // 获取时间段描述和图标
  const getTimePhase = (hour: number) => {
    if (hour >= 0 && hour < 6) return { 
      text: '凌晨',
      icon: (
        <img src="/icons/moon.svg" alt="凌晨" className="w-5 h-5" />
      )
    }
    if (hour >= 6 && hour < 9) return {
      text: '早晨',
      icon: (
        <img src="/icons/sunrise.svg" alt="早晨" className="w-5 h-5" />
      )
    }
    if (hour >= 9 && hour < 12) return {
      text: '上午',
      icon: (
        <img src="/icons/sun.svg" alt="上午" className="w-5 h-5" />
      )
    }
    if (hour >= 12 && hour < 14) return {
      text: '中午',
      icon: (
        <img src="/icons/sun-high.svg" alt="中午" className="w-5 h-5" />
      )
    }
    if (hour >= 14 && hour < 18) return {
      text: '下午',
      icon: (
        <img src="/icons/sun-low.svg" alt="下午" className="w-5 h-5" />
      )
    }
    if (hour >= 18 && hour < 20) return {
      text: '傍晚',
      icon: (
        <img src="/icons/sunset.svg" alt="傍晚" className="w-5 h-5" />
      )
    }
    return {
      text: '晚上',
      icon: (
        <img src="/icons/moon.svg" alt="晚上" className="w-5 h-5" />
      )
    }
  }

  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const calculateRunningTime = () => {
    if (!currentTime) return '加载中...'
    const diff = currentTime.getTime() - startTime.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return `${days}天${hours}小时${minutes}分${seconds}秒`
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <svg 
            className="w-5 h-5 text-blue-400 animate-spin-slow" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="text-lg font-semibold text-white">系统时间</h3>
        </div>
        <p className="text-gray-200 text-sm">
          {currentTime ? `${currentTime.toLocaleString('zh-CN', { 
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).replace(/\//g, '年').replace(/\//g, '月').replace(/\s/, '日 ')} ` : '加载中...'}
          <span className="inline-flex items-center gap-1">
            {currentTime && (
              <>
                <span className="transform -translate-y-0.5">
                  {getTimePhase(currentTime.getHours()).icon}
                </span>
                <span>({getTimePhase(currentTime.getHours()).text})</span>
              </>
            )}
          </span>
        </p>
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <svg 
            className="w-5 h-5 text-green-400 animate-spin-slow" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="text-lg font-semibold text-white">运行时间</h3> 
        </div>
        <p className="text-gray-200 text-sm">
          {calculateRunningTime()}
        </p>
      </div>
    </div>
  )
}

function SystemInfo() {
  const [countdown, setCountdown] = useState('')
  const expireDate = new Date('[输入你的到期时间]')

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date()
      const diff = expireDate.getTime() - now.getTime()
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setCountdown(`${days}天${hours}小时${minutes}分${seconds}秒`)
    }

    calculateCountdown()
    const timer = setInterval(calculateCountdown, 1000)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          <h3 className="text-lg font-semibold text-white">服务器配置</h3>
        </div>

        <table className="w-full text-sm text-left text-gray-200">
          <tbody>
            <tr className="border-b border-gray-700/30">
              <td className="py-2 font-medium text-gray-400">实例名称</td>
              <td className="py-2">[输入你的实例名称]</td>
            </tr>
            <tr className="border-b border-gray-700/30">
              <td className="py-2 font-medium text-gray-400">操作系统</td>
              <td className="py-2">[输入你的操作系统]</td>
            </tr>
            <tr className="border-b border-gray-700/30">
              <td className="py-2 font-medium text-gray-400">CPU配置</td>
              <td className="py-2">[输入你的CPU配置]</td>
            </tr>
            <tr className="border-b border-gray-700/30">
              <td className="py-2 font-medium text-gray-400">内存大小</td>
              <td className="py-2">[输入你的内存大小]</td>
            </tr>
            <tr className="border-b border-gray-700/30">
              <td className="py-2 font-medium text-gray-400">系统盘</td>
              <td className="py-2">[输入你的系统盘]</td>
            </tr>
            <tr className="border-b border-gray-700/30">
              <td className="py-2 font-medium text-gray-400">带宽</td>
              <td className="py-2">[输入你的带宽]</td>
            </tr>
            <tr className="border-b border-gray-700/30">
              <td className="py-2 font-medium text-gray-400">地域</td>
              <td className="py-2">[输入你的地域]</td>
            </tr>
            <tr className="border-b border-gray-700/30">
              <td className="py-2 font-medium text-gray-400">到期时间</td>
              <td className="py-2">[输入你的到期时间]</td>
            </tr>
            <tr>
              <td className="py-2 font-medium text-gray-400">剩余时间</td>
              <td className="py-2 text-green-400">{countdown}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 将 cards 数组重新组织为更有逻辑的分类
const cards = [
  // 内容类
  {
    category: "content",
    items: [
      {
        title: "技术文章",
        description: "分享编程技术和开发经验", 
        href: "/posts",
        icon: ({ className }: IconProps) => (
          <img src="/icons/Technical-Articles.svg" alt="技术文章" className={className} />
        )
      },
      {
        title: "归档",
        description: "查看所有归档",
        href: "/archive",
        icon: ({ className }: IconProps) => (
          <img src="/icons/pigeonhole.svg" alt="归档" className={className} />
        )
      },
      {
        title: "说说",
        description: "分享日常想法和心得",
        href: "/talks",
        icon: ({ className }: IconProps) => (
          <img src="/icons/talk.svg" alt="说说" className={className} />
        )
      },
      {
        title: "图标下载",
        description: "下载本站所有 SVG 图标",
        href: "/icons",
        icon: ({ className }: IconProps) => (
          <img src="/icons/download.svg" alt="图标下载" className={className} />
        )
      }
    ]
  },
  // 工具类
  {
    category: "tools",
    items: [
      {
        title: "工具箱", 
        description: "实用在线工具集合",
        href: "/tools",
        icon: ({ className }: IconProps) => (
          <img src="/icons/toolbox.svg" alt="工具箱" className={className} />
        )
      },
      {
        title: "API分享",
        description: "查看可用的API接口文档", 
        href: "/api-docs",
        icon: ({ className }: IconProps) => (
          <img src="/icons/API.svg" alt="API" className={className} />
        )
      },
      {
        title: "资源下载",  
        description: "提供常用软件和工具下载",  
        href: "/resources",
        icon: ({ className }: IconProps) => (
          <img src="/icons/download.svg" alt="下载" className={className} />
        )
      }
    ]
  },
  // 社交类
  {
    category: "social",
    items: [
      {
        title: "聊天室",
        description: "在线交流互动",
        href: "/chat",
        icon: ({ className }: IconProps) => (
          <img src="/icons/chat-room.svg" alt="聊天室" className={className} />
        )
      },
      {
        title: "留言板",
        description: "写下你想说的话",
        href: "/messages",
        icon: ({ className }: IconProps) => (
          <img src="/icons/Message-boards.svg" alt="留言板" className={className} />
        )
      },
      {
        title: "友情链接",
        description: "志同道合的朋友们",
        href: "/friends",
        icon: ({ className }: IconProps) => (
          <img src="/icons/Links.svg" alt="友情链接" className={className} />
        )
      }
    ]
  },
  // 关于类
  {
    category: "about",
    items: [
      {
        title: "关于",
        description: "了解更多关于我的信息",
        href: "/about",
        icon: ({ className }: IconProps) => (
          <img src="/icons/concerning.svg" alt="关于" className={className} />
        )
      },
      {
        title: "联系我",
        description: "有任何问题都可联系我", 
        href: "/contact",
        icon: ({ className }: IconProps) => (
          <img src="/icons/mail.svg" alt="联系我" className={className} />
        )
      }
    ]
  }
];

// 在渲染部分使用新的结构
{/* 卡片网格 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {cards.map((category) => (
    category.items.map((card) => (
      <Link
        key={card.title}
        href={card.href}
        className="group bg-white/10 backdrop-blur-sm rounded-lg p-6 
                 transition-all duration-300 hover:bg-white/20 
                 hover:scale-105 hover:shadow-xl
                 border border-white/5 hover:border-white/10"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`
            w-12 h-12 flex items-center justify-center rounded-lg
            bg-gradient-to-br from-blue-500/20 to-purple-500/20
            group-hover:from-blue-500/30 group-hover:to-purple-500/30
            transition-all duration-300
          `}>
            {typeof card.icon === 'function' ? 
              card.icon({ 
                className: "w-6 h-6 transform group-hover:scale-110 transition-transform duration-300",
                gradient: true 
              }) : 
              card.icon
            }
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {card.title}
          </h3>
        </div>
        <p className="text-gray-200 group-hover:text-white transition-colors">
          {card.description}
        </p>
      </Link>
    ))
  ))}
</div>

export default function HomePage() {
  const [isAvatarAnimating, setIsAvatarAnimating] = useState(false)
  const [isAvatarTransitioning, setIsAvatarTransitioning] = useState(false)
  const [showSecondAvatar, setShowSecondAvatar] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [articleCount, setArticleCount] = useState(0)
  const [isScrollLocked, setIsScrollLocked] = useState(false)

  const handleScrollDown = () => {
    const contentSection = document.getElementById('content-section')
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleAvatarClick = (e: React.MouseEvent) => {
    // 创建一个新的点击事件在头像位置触发
    const clickEvent = new MouseEvent('click', {
      clientX: e.clientX,
      clientY: e.clientY,
      bubbles: true
    })
    window.dispatchEvent(clickEvent)
    
    setIsAvatarAnimating(true)
    setTimeout(() => {
      setIsAvatarAnimating(false)
    }, 1000)
  }

  const handleCloseChat = () => {
    setShowChat(false)
  }

  useEffect(() => {
    fetch('/api/admin/articles')
      .then(res => res.json())
      .then(data => {
        // 只计算可见的文章数量
        const visibleArticles = data.articles.filter((article: any) => article.is_visible)
        setArticleCount(visibleArticles.length)
      })
      .catch(error => {
        console.error('获取文章数量失败:', error)
      })
  }, [])

  // 在组件挂载时添加全局样式
  useEffect(() => {
    // 创建 style 元素
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);

    // 清理函数
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 添加自定义右键菜单处理函数
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    
    // 先移除已存在的菜单（如果有）
    const existingMenu = document.querySelector('.context-menu')
    if (existingMenu) {
      existingMenu.remove()
    }
    
    // 创建菜单元素
    const menu = document.createElement('div')
    menu.className = `
      context-menu fixed bg-white/10 backdrop-blur-md rounded-lg shadow-lg 
      border border-white/20 overflow-hidden z-50
      animate-fade-in
    `
    
    // 确保菜单不会超出视口
    const x = Math.min(e.clientX, window.innerWidth - 250) // 增加宽度以适应更多选项
    const y = Math.min(e.clientY, window.innerHeight - 400) // 增加高度以适应更多选项
    
    menu.style.left = `${x}px`
    menu.style.top = `${y}px`

    // 基础菜单选项
    const baseMenuItems = [
      {
        icon: ({ className }: IconProps) => (
          <img src="/icons/flushed.svg" alt="刷新" className="w-4 h-4" />
        ),
        text: '刷新页面',
        onClick: () => window.location.reload()
      },
      {
        icon: ({ className }: IconProps) => (
          <img src="/icons/return.svg" alt="返回" className="w-4 h-4" />
        ),
        text: '返回上页',
        onClick: () => window.history.back()
      },
      {
        icon: ({ className }: IconProps) => (
          <img src="/icons/github.svg" alt="源码" className="w-4 h-4" />
        ),
        text: '查看源码',
        onClick: () => window.open('https://github.com/huangyjie/blog', '_blank')
      }
    ]

    // 合并所有菜单项
    const menuItems = [
      ...baseMenuItems,
      { isSeparator: true }
    ]

    // 创建菜单项
    menuItems.forEach((item, index) => {
      if (item.isSeparator) {
        const separator = document.createElement('div')
        separator.className = 'border-t border-white/10 my-1'
        menu.appendChild(separator)
        return
      }

      if (item.isHeader) {
        const header = document.createElement('div')
        header.className = 'px-4 py-2 text-sm text-gray-400 font-medium'
        header.textContent = item.text
        menu.appendChild(header)
        return
      }

      const menuItem = document.createElement('div')
      menuItem.className = `
        px-4 py-2 flex items-center gap-3 text-white/90 hover:bg-white/20 
        cursor-pointer transition-colors duration-200
      `

      // 创建图标容器
      const iconContainer = document.createElement('div')
      iconContainer.className = `
        w-6 h-6 flex items-center justify-center rounded-md
        bg-gradient-to-br from-blue-500/20 to-purple-500/20
        group-hover:from-blue-500/30 group-hover:to-purple-500/30
        transition-all duration-300
      `

      // 如果是函数类型的图标，需要特殊处理
      if (typeof item.icon === 'function') {
        const tempDiv = document.createElement('div')
        const iconElement = item.icon({ className: 'w-4 h-4' })
        // 假设 iconElement 是一个 React 元素，我们需要获取其 HTML 字符串
        // 这里可能需要根据你的图标实现方式进行调整
        tempDiv.innerHTML = iconElement.props.src ? 
          `<img src="${iconElement.props.src}" alt="" class="w-4 h-4" />` :
          iconElement.type === 'svg' ? iconElement.props.children : ''
        iconContainer.appendChild(tempDiv.firstChild as Node)
      }

      const textSpan = document.createElement('span')
      textSpan.className = 'text-sm'
      textSpan.textContent = item.text

      menuItem.appendChild(iconContainer)
      menuItem.appendChild(textSpan)

      menuItem.onclick = () => {
        if (document.body.contains(menu)) {
          document.body.removeChild(menu)
        }
        item.onClick()
      }
      menu.appendChild(menuItem)
    })

    // 添加菜单到页面
    document.body.appendChild(menu)

    // 点击其他地方关闭菜单
    const closeMenu = (e: MouseEvent) => {
      if (!menu.contains(e.target as Node) && document.body.contains(menu)) {
        document.body.removeChild(menu)
        document.removeEventListener('click', closeMenu)
        document.removeEventListener('keydown', handleEsc)
      }
    }

    // ESC 键关闭菜单
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.body.contains(menu)) {
        document.body.removeChild(menu)
        document.removeEventListener('click', closeMenu)
        document.removeEventListener('keydown', handleEsc)
      }
    }

    // 添加事件监听器
    setTimeout(() => {
      document.addEventListener('click', closeMenu)
      document.addEventListener('keydown', handleEsc)
    }, 0)

  }, [])

  // 在组件挂载时添加右键菜单事件监听
  useEffect(() => {
    // 阻止默认的手势事件
    const preventGestures = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // 阻止鼠标事件
    const preventMouseGestures = (e: MouseEvent) => {
      if (e.buttons === 2) { // 右键被按下
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 添加右键菜单事件监听
    document.addEventListener('contextmenu', handleContextMenu as any);
    
    // 禁用手势相关事件
    document.addEventListener('gesturestart', preventGestures, { capture: true });
    document.addEventListener('gesturechange', preventGestures, { capture: true });
    document.addEventListener('gestureend', preventGestures, { capture: true });
    
    // 禁用触摸相关手势
    document.addEventListener('touchstart', preventGestures, { passive: false, capture: true });
    document.addEventListener('touchmove', preventGestures, { passive: false, capture: true });
    document.addEventListener('touchend', preventGestures, { passive: false, capture: true });

    // 禁用鼠标手势
    document.addEventListener('mousedown', preventMouseGestures, { capture: true });
    document.addEventListener('mousemove', preventMouseGestures, { capture: true });
    document.addEventListener('mouseup', preventMouseGestures, { capture: true });
    document.addEventListener('drag', preventGestures, { capture: true });
    document.addEventListener('dragstart', preventGestures, { capture: true });

    // 清理函数
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu as any);
      document.removeEventListener('gesturestart', preventGestures);
      document.removeEventListener('gesturechange', preventGestures);
      document.removeEventListener('gestureend', preventGestures);
      document.removeEventListener('touchstart', preventGestures);
      document.removeEventListener('touchmove', preventGestures);
      document.removeEventListener('touchend', preventGestures);
      document.removeEventListener('mousedown', preventMouseGestures);
      document.removeEventListener('mousemove', preventMouseGestures);
      document.removeEventListener('mouseup', preventMouseGestures);
      document.removeEventListener('drag', preventGestures);
      document.removeEventListener('dragstart', preventGestures);
    };
  }, [handleContextMenu]);

  // 添加滚动处理
  useEffect(() => {
    const handleScroll = () => {
      // 获取欢迎区域的高度作为触发点
      const welcomeSection = document.querySelector('section:first-of-type')
      if (!welcomeSection) return

      const triggerPoint = welcomeSection.getBoundingClientRect().height - 100

      if (window.scrollY > triggerPoint && !isScrollLocked) {
        setIsScrollLocked(true)
        // 滚动到内容区域
        const contentSection = document.getElementById('content-section')
        if (contentSection) {
          contentSection.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isScrollLocked])

  // 阻止向上滚动
  useEffect(() => {
    if (isScrollLocked) {
      const preventScroll = (e: WheelEvent) => {
        const contentSection = document.getElementById('content-section')
        if (!contentSection) return

        const contentTop = contentSection.getBoundingClientRect().top
        // 如果用户试图向上滚动且已经到达内容区域顶部
        if (e.deltaY < 0 && contentTop >= 0) {
          e.preventDefault()
          // 保持在内容区域顶部
          contentSection.scrollIntoView()
        }
      }

      window.addEventListener('wheel', preventScroll, { passive: false })
      return () => window.removeEventListener('wheel', preventScroll)
    }
  }, [isScrollLocked])

  return (
    <div className="relative">
      <RandomBackground />
      <ClickParticles />
      
      {/* 欢迎区域 */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="relative z-10 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            <TypewriterText text="[输入你的标题]" />
          </h1>
          <p className="text-xl">
            <TypewriterText 
              text="[输入你的副标题]" 
              delay={150} 
              showCursor={false}
            />
          </p>
          <button 
            onClick={handleScrollDown}
            className="animate-bounce mt-12 group cursor-pointer"
            aria-label="向下滚动"
          >
            <p className="text-gray-200 group-hover:text-white transition-colors">
              向下滚动探索更多
            </p>
            <svg 
              className="w-6 h-6 mx-auto mt-2 text-white transition-transform group-hover:translate-y-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </button>
        </div>
      </section>

      {/* 内容区域 */}
      <section 
        id="content-section" 
        className={`relative ${isScrollLocked ? 'scroll-smooth' : ''}`}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-12 gap-6">
            {/* 侧长条 */}
            <div className="col-span-3 space-y-6">
              {/* 个人信息卡片 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="relative group cursor-pointer animate-bounce hover:animate-none w-24 h-24 mb-4"
                  >
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full 
                      opacity-60 group-hover:opacity-100 transition-all duration-300
                      before:absolute before:inset-[1px] before:rounded-full before:bg-black/20 before:z-10
                      after:absolute after:inset-[-4px] after:rounded-full after:bg-gradient-to-r 
                      after:from-blue-500/0 after:via-purple-500/50 after:to-pink-500/0
                      after:opacity-0 after:group-hover:opacity-100 after:blur-md after:transition-all after:duration-300"
                    />
                    <img
                      src={showSecondAvatar 
                        ? `https://q4.qlogo.cn/g?b=qq&nk=[输入你的QQ号]&s=640&t=${new Date().getTime()}` 
                        : `https://q4.qlogo.cn/g?b=qq&nk=[输入你的QQ号]&s=640&t=${new Date().getTime()}`
                      }
                      alt="QQ头像"
                      className="relative w-full h-full rounded-full transform transition-all duration-1000
                        group-hover:rotate-[360deg] group-hover:scale-125
                        z-20"
                      onMouseEnter={() => {
                        setTimeout(() => {
                          setShowSecondAvatar(true)
                        }, 500)
                      }}
                      onMouseLeave={() => {
                        setShowSecondAvatar(false)
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = showSecondAvatar 
                          ? `https://thirdqq.qlogo.cn/g?b=qq&nk=[输入你的QQ号]&s=640&t=${new Date().getTime()}`
                          : `https://thirdqq.qlogo.cn/g?b=qq&nk=[输入你的QQ号]&s=640&t=${new Date().getTime()}`;
                      }}
                    />
                  </div>

                  {/* 使用表格展示信息 */}
                  <table className="w-full text-sm text-left text-gray-200 mt-4">
                    <tbody>
                      <tr className="border-b border-gray-700/30">
                        <td className="py-2 font-medium text-gray-400">昵称</td>
                        <td className="py-2">[输入你的昵称]</td>
                      </tr>
                      <tr className="border-b border-gray-700/30">
                        <td className="py-2 font-medium text-gray-400">邮箱</td>
                        <td className="py-2">
                          <a 
                            href="mailto:xxx@gmail.com"
                            className="hover:text-blue-400 transition-colors"
                          >
                            [输入你的邮箱]
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium text-gray-400">GitHub</td>
                        <td className="py-2">
                          <a 
                            href="https://github.com/xxx"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition-colors"
                          >
                            @[输入你的GitHub]
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* 在表格后添加心电图区域 */}
                  <div className="w-full mt-6 p-4 bg-black/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-300">系统运行状态</span>
                      </div>
                      <div className="flex-1 relative h-12 overflow-hidden">
                        <svg 
                          className="heartbeat-line" 
                          viewBox="0 0 300 100" 
                          preserveAspectRatio="none"
                        >
                          <path 
                            className="heartbeat-path"
                            d="M0,50 
                               L30,50 
                               L35,50 
                               L40,44
                               L45,56
                               L50,40
                               L55,60
                               L60,50
                               L65,50 
                               L70,50 
                               L75,50
                               L80,20
                               L85,80
                               L90,20
                               L95,50 
                               L100,50
                               L105,50
                               L300,50"
                            fill="none"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="text-green-500"
                          />
                        </svg>
                        {/* 添加多个重复的路径来创造连续效果 */}
                        <svg
                          className="heartbeat-line absolute top-0 left-full"
                          viewBox="0 0 300 100" 
                          preserveAspectRatio="none"
                        >
                          <path 
                            className="heartbeat-path"
                            d="M0,50 
                               L30,50 
                               L35,50 
                               L40,44
                               L45,56
                               L50,40
                               L55,60
                               L60,50
                               L65,50 
                               L70,50 
                               L75,50
                               L80,20
                               L85,80
                               L90,20
                               L95,50 
                               L100,50
                               L105,50
                               L300,50"
                            fill="none"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="text-green-500"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 添加系统信息卡片 */}
              <SystemInfo />

              {/* 添加时间显示卡片 */}
              <TimeDisplay />

              {/* 最新动态卡片 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-[calc(100vh-20rem)] flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">最新动态</h2>
                  <div className="space-y-4 mb-6">
                    <div className="text-gray-200">
                      <p className="font-medium flex items-center gap-2">
                        <span className="text-blue-400">🎨</span>
                        界面更新
                      </p>
                      <p className="text-sm text-gray-300">新的设计风格，更好的用户体验</p>
                      <p className="text-xs text-gray-400">2024-12-14</p>
                    </div>
                    <div className="text-gray-200">
                      <p className="font-medium flex items-center gap-2">
                        <span className="text-green-400">✨</span>
                        新增功能
                      </p>
                      <p className="text-sm text-gray-300">新增背景图、一言展示动态时间线</p>
                      <p className="text-xs text-gray-400">2024-12-13</p>
                    </div>
                    <div className="text-gray-200">
                      <p className="font-medium flex items-center gap-2">
                        <span className="text-yellow-400">📝</span>
                        内更新
                      </p>
                      <p className="text-sm text-gray-300">新增技术文章《React 18 新特性解析》</p>
                      <p className="text-xs text-gray-400">2024-12-12</p>
                    </div>
                    <div className="text-gray-200">
                      <p className="font-medium flex items-center gap-2">
                        <span className="text-purple-400">🚀</span>
                        性能优化
                      </p>
                      <p className="text-sm text-gray-300">引入 Server Components，提升首屏加载速度</p>  
                      <p className="text-xs text-gray-400">2024-12-11</p>
                    </div>
                    <div className="text-gray-200">
                      <p className="font-medium flex items-center gap-2">
                        <span className="text-red-400">🔧</span>
                        问题修复
                      </p>
                      <p className="text-sm text-gray-300">修复色模下的显示问题</p>
                      <p className="text-xs text-gray-400">2024-12-10</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-6 border-t border-white/10">
                  <div className="cursor-pointer group/quote hover:opacity-80 transition-opacity">
                    <RandomQuote />
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧内容 */}
            <div className="col-span-9 space-y-6">
              {/* 顶部条 - 只显示置顶公告 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                  <img src="/icons/announcement.svg" alt="公告" className="w-6 h-6" />
                  公告
                </h2>
                <div className="min-h-[60px]">
                  <PinnedAnnouncements />
                </div>
                <div className="mt-3 flex justify-end">
                  <Link
                    href="/announcements"
                    className="inline-flex items-center gap-2 px-4 py-1.5 text-sm 
                      bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                      hover:from-blue-500/30 hover:to-purple-500/30
                      text-white/80 hover:text-white
                      rounded-full transition-all duration-300 
                      group"
                  >
                    <span>查看全部公告</span>
                    <svg 
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* 卡片网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((category) => (
                  category.items.map((card) => (
                    <Link
                      key={card.title}
                      href={card.href}
                      className="group bg-white/10 backdrop-blur-sm rounded-lg p-6 
                               transition-all duration-300 hover:bg-white/20 
                               hover:scale-105 hover:shadow-xl
                               border border-white/5 hover:border-white/10"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`
                          w-12 h-12 flex items-center justify-center rounded-lg
                          bg-gradient-to-br from-blue-500/20 to-purple-500/20
                          group-hover:from-blue-500/30 group-hover:to-purple-500/30
                          transition-all duration-300
                        `}>
                          {typeof card.icon === 'function' ? 
                            card.icon({ 
                              className: "w-6 h-6 transform group-hover:scale-110 transition-transform duration-300",
                              gradient: true 
                            }) : 
                            card.icon
                          }
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                          {card.title}
                        </h3>
                      </div>
                      <p className="text-gray-200 group-hover:text-white transition-colors">
                        {card.description}
                      </p>
                    </Link>
                  ))
                ))}
              </div>

              {/* 在小卡片区域后面，核心价值观区域前面添加 AI 助手卡片 */}
              <div className="w-full px-4 mb-8">
                <motion.div
                  onClick={() => window.location.href = '/ai-chat'}
                  className="w-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                             rounded-2xl p-6 cursor-pointer group relative overflow-hidden
                             border border-white/10 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* 背景装饰 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 
                                  blur-3xl group-hover:opacity-75 transition-opacity duration-500 opacity-0" />
                  
                  <div className="relative flex items-start space-x-6">
                    {/* AI 图标 */}
                    <div className="flex-shrink-0 p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                      <svg 
                        className="w-8 h-8 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                        />
                      </svg>
                    </div>

                    {/* 内容区域 */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        AI 智能助手
                      </h3>
                      <p className="text-gray-300 mb-4">
                        24小时在线的 AI 助手，可以帮助你解答问题、编写代码、提供建议。支持代码高亮显示和一键复制功能。
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {['智能对话', '代码生成', '问题解答', '即时响应'].map((feature, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 text-sm text-blue-300 bg-blue-500/10 rounded-full
                                       border border-blue-500/20"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 右侧箭头 */}
                    <div className="flex-shrink-0 self-center">
                      <svg 
                        className="w-6 h-6 text-gray-400 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </div>
                  </div>

                  {/* 悬浮提示 */}
                  <div className="absolute bottom-4 right-4 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    点击开始对话
                  </div>
                </motion.div>
              </div>

              {/* 统计数字部分 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-500 hover:bg-white/10">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full opacity-0 group-hover:opacity-50 blur transition-all duration-500"></div>
                      <div className="relative text-5xl font-bold text-blue-400 mb-2 text-center group-hover:animate-pulse">
                        {(apiEndpoints?.length || 50)}+
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-300 text-center mt-4 font-medium">API接口</div>
                  <div className="text-gray-400 text-sm text-center mt-2">持续更新中</div>
                </div>
                
                <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-500 hover:bg-white/10">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full opacity-0 group-hover:opacity-50 blur transition-all duration-500"></div>
                      <div className="relative text-5xl font-bold text-purple-400 mb-2 text-center group-hover:animate-pulse">
                        {articleCount}+
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-300 text-center mt-4 font-medium">技术文章</div>
                  <div className="text-gray-400 text-sm text-center mt-2">分享技术见解</div>
                </div>
                
                <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-500 hover:bg-white/10">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full opacity-0 group-hover:opacity-50 blur transition-all duration-500"></div>
                      <div className="relative text-5xl font-bold text-green-400 mb-2 text-center group-hover:animate-pulse">
                        {tools.length}+
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-300 text-center mt-4 font-medium">实用工具</div>
                  <div className="text-gray-400 text-sm text-center mt-2">提升开发效率</div>
                </div>
              </div>

              {/* 标语部分 */}
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 blur"></div>
                  <h3 className="relative text-2xl md:text-3xl font-bold text-white">
                    分享知识，传播价值
                  </h3>
                </div>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  致力于为开发者提供优质的技术内容和开发工具，让编程更简单，让技术更有趣。
                </p>
              </div>

              {/* 装饰性图标网格 */}
              <div className="grid grid-cols-6 md:grid-cols-8 gap-4 py-8 relative">
                {[
                  { path: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "from-blue-500 to-blue-400" }, // 显示器
                  { path: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", color: "from-green-500 to-green-400" }, // 手机
                  { path: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "from-purple-500 to-purple-400" }, // 芯片
                  { path: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4", color: "from-yellow-500 to-yellow-400" }, // 数据库
                  { path: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9", color: "from-cyan-500 to-cyan-400" }, // 网络
                  { path: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z", color: "from-red-500 to-red-400" }, // CPU
                  { path: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "from-indigo-500 to-indigo-400" }, // 3D立方体
                  { path: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z", color: "from-orange-500 to-orange-400" }, // 电路
                  { path: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", color: "from-amber-500 to-amber-400" }, // 灯泡
                  { path: "M13 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5", color: "from-teal-500 to-teal-400" }, // 服务器
                  { path: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", color: "from-fuchsia-500 to-fuchsia-400" }, // 图片
                  { path: "M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5", color: "from-violet-500 to-violet-400" }, // 原子
                  { path: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", color: "from-sky-500 to-sky-400" }, // 云
                  { path: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", color: "from-emerald-500 to-emerald-400" }, // 代码
                  { path: "M13 10V3L4 14h7v7l9-11h-7z", color: "from-yellow-500 to-yellow-400" }, // 闪电
                  { path: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01", color: "from-teal-500 to-teal-400" }, // 服务器
                ].map(({ path, color }, i) => (
                  <div
                    key={i}
                    className={`
                      aspect-square rounded-lg 
                      bg-gradient-to-br from-white/5 to-white/10 
                      transform hover:scale-110 transition-all duration-500 
                      hover:rotate-12 group relative
                      hover:z-10
                      animate-float
                    `}
                    style={{ 
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: `${3 + Math.random() * 2}s`
                    }}
                  >
                    {/* 背景效果 */}
                    <div className={`
                      absolute inset-0 rounded-lg opacity-0 
                      group-hover:opacity-30 transition-opacity duration-500
                      bg-gradient-to-br ${color} blur-xl
                    `}></div>
                    
                    {/* 图标容器 */}
                    <div className={`
                      relative w-full h-full rounded-lg 
                      backdrop-blur-sm p-3
                      overflow-hidden
                      border border-white/5
                      group-hover:border-white/20
                      transition-all duration-300
                    `}>
                      {/* 渐变背景 */}
                      <div className={`
                        absolute inset-0 rounded-lg
                        bg-gradient-to-br ${color} opacity-20 
                        group-hover:opacity-100 transition-all duration-300
                        group-hover:animate-pulse
                      `}></div>

                      {/* 图标 */}
                      <div className="relative h-full flex items-center justify-center">
                        <svg 
                          className={`
                            w-6 h-6 text-white drop-shadow-lg
                            transform group-hover:scale-110 
                            transition-all duration-300
                            group-hover:rotate-[-12deg]
                          `}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d={path}
                            className="group-hover:stroke-[2.5px]" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 底部饰线 */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 添加悬浮AI对话按钮 */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-8 right-8 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 z-50"
        aria-label="打开AI助手"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
      </button>

      {/* AI对话组件 */}
      {showChat && (
        <ChatWidget onClose={handleCloseChat} />
      )}
    </div>
  )
} 