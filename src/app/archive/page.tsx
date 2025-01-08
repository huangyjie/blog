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

// 定义文章接口
interface Article {
  id: string
  title: string
  date: string
  category: string
  href: string
}

// 按年份分组的文章
interface ArticlesByYear {
  [year: string]: {
    [month: string]: Article[]
  }
}

export default function ArchivePage() {
  const [articles, setArticles] = useState<ArticlesByYear>({})
  // 添加折叠状态
  const [collapsedYears, setCollapsedYears] = useState<{[key: string]: boolean}>({})
  const [collapsedMonths, setCollapsedMonths] = useState<{[key: string]: boolean}>({})

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
    // 组合文章和工具数据
    const allArticles: Article[] = [
      // 文章数据 - 2024年11月
      {
        id: '1',
        title: '湖北省技能高考',
        date: '2024-11-14',
        category: '考试指南',
        href: '/article/jngk.html'
      },
      {
        id: '2',
        title: '下载中心',
        date: '2024-11-14',
        category: '资源下载',
        href: '/article/Download.html'
      },
      {
        id: '3',
        title: 'Eclipse 教程',
        date: '2024-11-14',
        category: '开发指南',
        href: '/article/Eclipse.html'
      },
      {
        id: '4',
        title: 'JetBrains 工具',
        date: '2024-11-14',
        category: '开发指南',
        href: '/article/Jetbrains.html'
      },
      {
        id: '5',
        title: 'Node.js 指南',
        date: '2024-11-14',
        category: '开发指南',
        href: '/article/node.html'
      },
      {
        id: '6',
        title: 'Vue.js 指南',
        date: '2024-11-14',
        category: '开发指南',
        href: '/article/vue.html'
      },
      {
        id: '7',
        title: 'React.js 指南',
        date: '2024-11-14',
        category: '开发指南',
        href: '/article/react.html'
      },
      {
        id: '8',
        title: 'Angular 指南',
        date: '2024-11-14',
        category: '开发指南',
        href: '/article/angular.html'
      },
      {
        id: '9',
        title: 'Svelte 指南',
        date: '2024-11-14',
        category: '开发指南',
        href: '/article/svelte.html'
      },
      {
        id: '10',
        title: 'jQuery 指南',
        date: '2024-11-14',
        category: '开发指南',
        href: '/article/jquery.html'
      },
      {
        id: '11',
        title: 'Ember.js 指南',
        date: '2024-11-14',
        category: '开发指南',
        href: '/article/ember.html'
      },
      {
        id: '12',
        title: '竞赛刷题平台',
        date: '2024-11-14',
        category: '学习资源',
        href: '/article/Brush questions.html'
      },

      // 工具数据 - 2024年12月
      {
        id: 'tool-qrcode',
        title: '二维码生成器',
        date: '2024-12-14',
        category: '实用工具',
        href: '/tools/qrcode'
      },
      {
        id: 'tool-timestamp',
        title: '时间戳转换',
        date: '2024-12-14',
        category: '实用工具',
        href: '/tools/timestamp'
      },
      {
        id: 'tool-image-compress',
        title: '图片压缩',
        date: '2024-12-14',
        category: '实用工具',
        href: '/tools/image-compress'
      },
      {
        id: 'tool-base64',
        title: 'Base64转换',
        date: '2024-12-14',
        category: '实用工具',
        href: '/tools/base64'
      },
      {
        id: 'tool-json-formatter',
        title: 'JSON格式化',
        date: '2024-12-14',
        category: '开发工具',
        href: '/tools/json-formatter'
      },
      {
        id: 'tool-markdown',
        title: 'Markdown编辑器',
        date: '2024-12-14',
        category: '开发工具',
        href: '/tools/markdown'
      },
      {
        id: 'tool-calculator',
        title: '计算器',
        date: '2024-12-14',
        category: '实用工具',
        href: '/tools/calculator'
      },
      {
        id: 'tool-color-converter',
        title: '颜色转换器',
        date: '2024-12-14',
        category: '开发工具',
        href: '/tools/color-converter'
      },
      {
        id: 'tool-converter',
        title: '图片格式转换',
        date: '2024-12-14',
        category: '实用工具',
        href: '/tools/converter'
      },
      {
        id: 'tool-ip-lookup',
        title: 'IP地址查询',
        date: '2024-12-14',
        category: '实用工具',
        href: '/tools/ip-lookup'
      },
      {
        id: 'tool-notepad',
        title: '在线记事本',
        date: '2024-12-14',
        category: '实用工具',
        href: '/tools/notepad'
      },
      {
        id: 'tool-password-generator',
        title: '密码生成器',
        date: '2024-12-14',
        category: '实用工具',
        href: '/tools/password-generator'
      },
      {
        id: 'tool-regex-tester',
        title: '正则表达式测试',
        date: '2024-12-14',
        category: '开发工具',
        href: '/tools/regex-tester'
      },
      {
        id: 'tool-text-diff',
        title: '文本对比工具',
        date: '2024-12-14',
        category: '开发工具',
        href: '/tools/text-diff'
      },
      {
        id: 'tool-translator',
        title: '在线翻译',
        date: '2024-12-14',
        category: '实用工具',
        href: '/tools/translator'
      },
      {
        id: 'tool-unit-converter',
        title: '单位换算器',
        date: '2024-12-14',
        category: '实用工具',
        href: '/tools/unit-converter'
      },
      {
        id: 'tool-url-codec',
        title: 'URL编解码',
        date: '2024-12-14',
        category: '开发工具',
        href: '/tools/url-codec'
      },
      {
        id: 'tool-word-counter',
        title: '字数统计',
        date: '2024-12-14',
        category: '实用工具',
        href: '/tools/word-counter'
      }
    ]

    // 按年月分组
    const groupedArticles: ArticlesByYear = {}
    allArticles.forEach(article => {
      const date = new Date(article.date)
      const year = date.getFullYear().toString()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')

      if (!groupedArticles[year]) {
        groupedArticles[year] = {}
      }
      if (!groupedArticles[year][month]) {
        groupedArticles[year][month] = []
      }
      groupedArticles[year][month].push(article)
    })

    // 排序
    Object.keys(groupedArticles).forEach(year => {
      Object.keys(groupedArticles[year]).forEach(month => {
        groupedArticles[year][month].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      })
    })

    setArticles(groupedArticles)
  }, [])

  // 切换年份折叠状态
  const toggleYear = (year: string) => {
    setCollapsedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }))
  }

  // 切换月份折叠状态
  const toggleMonth = (yearMonth: string) => {
    setCollapsedMonths(prev => ({
      ...prev,
      [yearMonth]: !prev[yearMonth]
    }))
  }

  return (
    <div className="min-h-screen">
      <RandomBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">归档</h1>
          <p className="text-gray-300">按时间线查看所有文章</p>
        </div>

        <div className="space-y-12">
          {Object.entries(articles).reverse().map(([year, months]) => (
            <div key={year} className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              {/* 年份标题和折叠按钮 */}
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleYear(year)}
              >
                <h2 className="text-2xl font-bold text-white">{year}年</h2>
                <button 
                  className="text-white hover:text-blue-400 transition-colors"
                  aria-label={`${collapsedYears[year] ? '展开' : '折叠'}${year}年的内容`}
                >
                  {collapsedYears[year] ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </div>

              {/* 月份列表 */}
              <div 
                className={`space-y-8 mt-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  collapsedYears[year] ? 'max-h-0 opacity-0' : 'max-h-[5000px] opacity-100'
                }`}
              >
                {Object.entries(months).reverse().map(([month, monthArticles]) => (
                  <div key={`${year}-${month}`} className="relative pl-8">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-white/20"></div>
                    <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-blue-500"></div>
                    
                    {/* 月份标题和折叠按钮 */}
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleMonth(`${year}-${month}`)}
                    >
                      <h3 className="text-xl font-semibold text-white">{month}月</h3>
                      <button 
                        className="text-white hover:text-blue-400 transition-colors"
                        aria-label={`${collapsedMonths[`${year}-${month}`] ? '展开' : '折叠'}${month}月的内容`}
                      >
                        <svg 
                          className={`w-5 h-5 transform transition-transform duration-300 ${
                            collapsedMonths[`${year}-${month}`] ? 'rotate-0' : 'rotate-180'
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 9l-7 7-7-7" 
                          />
                        </svg>
                      </button>
                    </div>

                    {/* 文章列表 */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        collapsedMonths[`${year}-${month}`] 
                          ? 'max-h-0 opacity-0 mt-0' 
                          : 'max-h-[2000px] opacity-100 mt-4'
                      }`}
                    >
                      <div className="space-y-4">
                        {monthArticles.map((article) => (
                          <a
                            key={article.id}
                            href={article.href}
                            className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg 
                              border border-white/10 transition-all duration-300 group"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                                  {article.title}
                                </h4>
                                <p className="text-sm text-gray-400">
                                  {article.category} · {new Date(article.date).toLocaleDateString()}
                                </p>
                              </div>
                              <svg 
                                className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors"
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
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}