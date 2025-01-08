'use client'

import { useEffect, useState, useMemo } from 'react'
import { pinyin } from 'pinyin-pro'
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

// 添加排序选项类型
type SortOption = 'download_count' | 'app_name';
type SortDirection = 'asc' | 'desc';

// 添加折叠状态类型
type CollapsedState = { [key: number]: boolean };

// 添加描述展开状态类型
type ExpandedDescriptions = { [key: number]: boolean };

interface Resource {
  id: number            // 对应数据库的 app_id
  name: string          // 对应 app_name
  description: string   // 对应 app_description
  downloadUrl: string   // 对应 download_url
  isActive: boolean     // 对应 !is_hidden
  downloadCount: number // 对应 download_count
  categoryId: number    // 对应 category_id
}

interface Category {
  id: number
  name: string
  description: string
  apps: Resource[]
}

// 添加搜索建议接口
interface SearchSuggestion {
  id: number
  name: string
  type: 'app' | 'category'
}

export default function ResourcesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalApps, setTotalApps] = useState(0) // 添加总应用状态

  // 添加筛选和排序状态
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('download_count')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // 添加折叠状态
  const [collapsed, setCollapsed] = useState<CollapsedState>({})

  // 添加描述展开状态
  const [expandedDescriptions, setExpandedDescriptions] = useState<ExpandedDescriptions>({})

  // 添加搜索建议状态
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // 创建应用和分类的拼音索引
  const pinyinIndex = useMemo(() => {
    const index: { [key: string]: SearchSuggestion } = {}
    
    // 为所有应用创建拼音索引
    categories.forEach(category => {
      // 添加分类名称的拼音索引
      const categoryPinyin = pinyin(category.name, { toneType: 'none' })
      const categoryPinyinFirst = pinyin(category.name, { pattern: 'first', toneType: 'none' })
      
      index[category.name.toLowerCase()] = {
        id: category.id,
        name: category.name,
        type: 'category'
      }
      index[categoryPinyin.toLowerCase()] = {
        id: category.id,
        name: category.name,
        type: 'category'
      }
      index[categoryPinyinFirst.toLowerCase()] = {
        id: category.id,
        name: category.name,
        type: 'category'
      }

      // 添加应用名称的拼音索引
      category.apps.forEach(app => {
        const appPinyin = pinyin(app.name, { toneType: 'none' })
        const appPinyinFirst = pinyin(app.name, { pattern: 'first', toneType: 'none' })
        
        index[app.name.toLowerCase()] = {
          id: app.id,
          name: app.name,
          type: 'app'
        }
        index[appPinyin.toLowerCase()] = {
          id: app.id,
          name: app.name,
          type: 'app'
        }
        index[appPinyinFirst.toLowerCase()] = {
          id: app.id,
          name: app.name,
          type: 'app'
        }
      })
    })
    
    return index
  }, [categories])

  useEffect(() => {
    fetch('/api/resources')
      .then(res => res.json())
      .then(data => {
        console.log('获取到的资源数据:', data)
        setCategories(data)
        setLoading(false)
        const total = data.reduce((sum: number, category: Category) => sum + category.apps.length, 0)
        setTotalApps(total)
        // 修改这里：初始化折叠状态，默认全部折叠
        const initialCollapsed = data.reduce((acc: CollapsedState, category: Category) => ({
          ...acc,
          [category.id]: true  // 改为 true 表示默认折叠
        }), {})
        setCollapsed(initialCollapsed)
      })
      .catch(err => {
        console.error('Failed to fetch resources:', err)
        setError('加载资源失败')
        setLoading(false)
      })
  }, [])

  // 修改搜索时的展开逻辑
  useEffect(() => {
    if (searchTerm) {  // 只在有搜索词时才自动展开
      const newCollapsed = { ...collapsed }
      categories.forEach(category => {
        const hasMatchingApps = category.apps.some(app => 
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        // 如果分类包含匹配的应用，则展开；否则保持折叠
        newCollapsed[category.id] = !hasMatchingApps
      })
      setCollapsed(newCollapsed)
    } else {
      // 当搜索词为空时，恢复所有分类为折叠状态
      const newCollapsed = categories.reduce((acc, category) => ({
        ...acc,
        [category.id]: true
      }), {})
      setCollapsed(newCollapsed)
    }
  }, [searchTerm, categories])

  // 添加切换折叠状态的函数
  const toggleCollapse = (categoryId: number) => {
    setCollapsed(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  // 添加切换描述展开状态的函数
  const toggleDescription = (appId: number) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [appId]: !prev[appId]
    }))
  }

  // 获取所有应用的扁平列表
  const allApps = categories.flatMap(category => 
    category.apps.map(app => ({
      ...app,
      categoryId: category.id
    }))
  )

  // 添加筛选和排序逻辑
  const filteredAndSortedApps = allApps
    .filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || app.categoryId === selectedCategory
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'download_count') {
        return sortDirection === 'desc' ? 
          b.downloadCount - a.downloadCount : 
          a.downloadCount - b.downloadCount
      }
      if (sortBy === 'app_name') {
        return sortDirection === 'desc' ? 
          b.name.localeCompare(a.name) : 
          a.name.localeCompare(b.name)
      }
      return 0
    })

  // 添加新的处理下载的函数
  const handleDownload = async (appId: number, downloadUrl: string) => {
    try {
      // 先发送请求更新下载次数
      await fetch(`/api/resources/${appId}/download`, {
        method: 'POST',
      })
      
      // 然后打开下载链接
      window.open(downloadUrl, '_blank')
      
      // 更新本地状态
      setCategories(categories.map(category => ({
        ...category,
        apps: category.apps.map(app => 
          app.id === appId 
            ? { ...app, downloadCount: app.downloadCount + 1 }
            : app
        )
      })))
    } catch (error) {
      console.error('更新下载次数失败:', error)
    }
  }

  // 处理搜索输入
  const handleSearchInput = (value: string) => {
    setSearchTerm(value)
    
    if (!value.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // 搜索匹配项
    const matchedSuggestions = new Set<SearchSuggestion>()
    const searchValue = value.toLowerCase()
    
    Object.entries(pinyinIndex).forEach(([key, item]) => {
      if (key.includes(searchValue)) {
        matchedSuggestions.add(item)
      }
    })

    setSuggestions(Array.from(matchedSuggestions))
    setShowSuggestions(true)
  }

  // 处理建议项点击
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.name)
    setShowSuggestions(false)
    
    if (suggestion.type === 'category') {
      setSelectedCategory(suggestion.id)
    }
  }

  // 添加点击外部关闭下拉框的处理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen">
        <RandomBackground />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center text-white">加载中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <RandomBackground />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">资源下载</h1>
          <p className="text-gray-300 mt-2">
            当前共收录 {totalApps} 个应用
          </p>
        </div>

        {/* 添加筛选工具栏 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 搜索框容器 */}
            <div className="relative search-container z-50">
              <label className="block text-sm font-medium mb-2 text-gray-200">搜索</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="搜索应用名称或描述..."
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg 
                  border border-white/20 focus:border-blue-500 focus:outline-none transition-colors"
              />
              
              {/* 搜索建议下拉框 */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  className="fixed w-[calc(100%-2rem)] md:w-auto md:min-w-full mt-1 bg-gray-800/95 
                    backdrop-blur-sm rounded-lg border border-white/20 shadow-lg max-h-60 
                    overflow-y-auto z-[9999]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.type}-${suggestion.id}-${index}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white flex items-center gap-2"
                    >
                      <span className={`text-sm ${
                        suggestion.type === 'app' ? 'text-blue-400' : 'text-green-400'
                      }`}>
                        {suggestion.type === 'app' ? '应用' : '分类'}:
                      </span>
                      <span>{suggestion.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 分类筛选 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">分类筛选</label>
              <div className="relative">
                <select 
                  title="分类筛选"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg 
                    border border-white/20 focus:border-blue-500 focus:outline-none 
                    transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">所有分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 排序方式 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">排序方式</label>
              <select
                title="排序方式"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg 
                  border border-white/20 focus:border-blue-500 focus:outline-none 
                  transition-colors appearance-none cursor-pointer"
              >
                <option value="download_count">下载次数</option>
                <option value="app_name">应用名称</option>
              </select>
            </div>

            {/* 排序方向 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">排序方向</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setSortDirection('desc')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    sortDirection === 'desc' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  降序
                </button>
                <button
                  onClick={() => setSortDirection('asc')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    sortDirection === 'asc' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  升序
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 显示筛选后的应用列表 */}
        <div className="space-y-8 relative z-10">
          {categories
            .filter(category => {
              // 首先检查分类筛选
              const matchesCategory = selectedCategory === 'all' || category.id === selectedCategory
              // 然后检查是否包含匹配搜索词的应用
              const hasMatchingApps = category.apps.some(app =>
                app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
              // 只显示符合分类筛选且包含匹配应用的分类
              return matchesCategory && (searchTerm === '' || hasMatchingApps)
            })
            .map(category => (
              <div 
                key={category.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
              >
                {/* 分类标题和折叠按钮 */}
                <div 
                  className="mb-6 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCollapse(category.id)}
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                    {category.description && (
                      <p className="mt-2 text-gray-300">{category.description}</p>
                    )}
                  </div>
                  <button 
                    title="折叠/展开"
                    className="text-gray-300 hover:text-white transition-colors">
                    <svg
                      className={`w-6 h-6 transform transition-transform duration-200 
                        ${collapsed[category.id] ? '' : 'rotate-180'}`}
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
                
                {/* 该分类下的应用列表，使用过渡动画 */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden
                  ${collapsed[category.id] ? 'max-h-0 opacity-0' : 'max-h-[5000px] opacity-100'}`}
                >
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.apps
                      .filter(app => {
                        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            app.description.toLowerCase().includes(searchTerm.toLowerCase())
                        return matchesSearch
                      })
                      .sort((a, b) => {
                        if (sortBy === 'download_count') {
                          return sortDirection === 'desc' ? 
                            b.downloadCount - a.downloadCount : 
                            a.downloadCount - b.downloadCount
                        }
                        if (sortBy === 'app_name') {
                          return sortDirection === 'desc' ? 
                            b.name.localeCompare(a.name) : 
                            a.name.localeCompare(b.name)
                        }
                        return 0
                      })
                      .map((app) => (
                        <div
                          key={app.id}
                          className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6
                            hover:bg-white/20 transition-all duration-300"
                        >
                          <h3 className="text-xl font-semibold text-white mb-2">{app.name}</h3>
                          
                          {/* 修改描述部分 */}  
                          <div className="relative">
                            <p className={`text-gray-200 mb-4 ${
                              !expandedDescriptions[app.id] ? 'line-clamp-1' : 'line-clamp-none'
                            }`}>
                              {app.description || '暂无描述'}
                            </p>
                            
                            {/* 只在描述超过1行时显示展开/收起按钮 */}
                            {app.description && app.description.length > 40 && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  toggleDescription(app.id)
                                }}
                                className="text-blue-400 hover:text-blue-300 text-sm mt-1 transition-colors"
                              >
                                {expandedDescriptions[app.id] ? '收起' : '展开'}
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-300">下载次数:</span>
                              <span className="text-blue-400">{app.downloadCount}</span>
                            </div>
                          </div>
                          
                          {app.isActive ? (
                            <button
                              onClick={() => handleDownload(app.id, app.downloadUrl)}
                              className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 
                                text-white rounded-lg transition-colors"
                            >
                              下载
                            </button>
                          ) : (
                            <span className="inline-block px-4 py-2 bg-gray-500 
                              text-white rounded-lg cursor-not-allowed">
                              暂不可用
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                  
                  {/* 空状态提示 */}
                  {category.apps.filter(app => 
                    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.description.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      该分类下没有匹配的应用
                    </div>
                  )}
                </div>
              </div>
            ))}
          {/* 当没有匹配的分类时显示提示 */}
          {categories.filter(category => {
            const matchesCategory = selectedCategory === 'all' || category.id === selectedCategory
            const hasMatchingApps = category.apps.some(app =>
              app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              app.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            return matchesCategory && (searchTerm === '' || hasMatchingApps)
          }).length === 0 && (
            <div className="text-center text-gray-400 py-8">
              没有找到匹配的应用
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 