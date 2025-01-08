'use client'

import { useState, useEffect } from 'react'
import { ArticleCard } from '@/components/ui/article-card'
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

interface DatabaseArticle {
  id: number
  title: string
  description: string
  file_path: string
  icon: string
  created_at: string
  is_visible: boolean
}

export default function PostsPage() {
  const [dbArticles, setDbArticles] = useState<DatabaseArticle[]>([])
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
    // 获取数据库中的文章列表
    fetch('/api/admin/articles')
      .then(res => res.json())
      .then(data => {
        // 只显示 is_visible 为 true 的文章
        const visibleArticles = data.articles.filter((article: DatabaseArticle) => article.is_visible)
        setDbArticles(visibleArticles)
        setLoading(false)
      })
      .catch(error => {
        console.error('获取文章失败:', error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen">
      <RandomBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 页面标题区域 */}
        <div className="text-center mb-16 bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            文章列表
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            探索技术世界，分享学习资源，助力你的技术成长之路
          </p>
        </div>

        {/* 文章卡片网格布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {loading ? (
            // 加载状态显示骨架屏
            Array(3).fill(null).map((_, i) => (
              <div 
                key={i} 
                className="transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
                  <div className="h-6 bg-white/20 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="h-4 bg-white/20 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-white/20 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : dbArticles.length === 0 ? (
            // 没有文章时显示提示
            <div className="col-span-3 text-center py-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <p className="text-gray-400 text-lg">暂无文章</p>
            </div>
          ) : (
            // 显示文章列表
            dbArticles.map(article => (
              <div 
                key={article.id}
                className="transform hover:scale-105 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden hover:bg-white/20 transition-colors group">
                  <ArticleCard
                    title={article.title}
                    description={article.description}
                    href={article.file_path}
                    icon={article.icon}
                    date={new Date(article.created_at).toLocaleDateString()}
                    className="p-6 group-hover:bg-white/5 transition-colors"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 