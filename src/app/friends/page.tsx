'use client'

import { useState, useEffect } from 'react'
import { RandomBackground } from '@/components/ui/random-background'

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
`;

interface Friend {
  link_id: number
  name: string
  description: string
  url: string
  avatar: string
  tags?: string[]
  is_hidden: boolean
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)

  // 添加全局样式
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

  // 添加阻止默认滑动行为
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
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('/api/admin/friends')
        const data = await response.json()
        setFriends(data.links.filter((link: Friend) => !link.is_hidden))
      } catch (error) {
        console.error('获取友链失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [])

  return (
    <div className="relative">
      <RandomBackground />
      <div className="relative min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8 text-white">友情链接</h1>
          
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-white">加载中...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {friends.map(friend => (
                <a
                  key={friend.link_id}
                  href={friend.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white/10 backdrop-blur-sm rounded-lg p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={friend.avatar}
                      alt={`${friend.name} 的头像`}
                      className="w-16 h-16 rounded-full bg-black/20"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {friend.name}
                      </h2>
                      <p className="text-gray-300 mt-1 text-sm">
                        {friend.description}
                      </p>
                      {friend.tags && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {friend.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 text-xs rounded-full bg-black/20 text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* 申请友链说明 */}
          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">申请友链</h2>
            <div className="space-y-4 text-gray-300">
              <p>欢迎和我交换友链！请确保你的网站满足以下条件：</p>
              <ul className="list-disc list-inside space-y-2">
                <li>[输入你的条件]</li>
                <li>[输入你的条件]</li>
                <li>[输入你的条件]</li>
                <li>[输入你的条件]</li>
              </ul>
              <p>如果你想要申请友链，请提供以下信息：</p>
              <ul className="list-disc list-inside space-y-2">
                <li>[输入你的信息]</li>
                <li>[输入你的信息]</li>
                <li>[输入你的信息]</li>
                <li>[输入你的信息]</li>
              </ul>
              <p>
                你可以通过以下方式联系我：
                <a 
                  href="mailto:[输入你的邮箱]" 
                  className="text-blue-400 hover:text-blue-300 ml-2"
                >
                  [输入你的邮箱]
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 