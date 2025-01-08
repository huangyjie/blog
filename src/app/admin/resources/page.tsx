'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RandomBackground } from '@/components/ui/random-background'

interface Category {
  category_id: number
  category_name: string
  category_description: string
  is_hidden: number
}

interface App {
  app_id: number
  app_name: string
  app_description: string
  download_url: string
  category_id: number
  download_count: number
  is_hidden: number
  created_at: string
}

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

export default function AdminResourcesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApps, setSelectedApps] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all')
  const [sortField, setSortField] = useState<'app_name' | 'download_count'>('app_name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [stats, setStats] = useState({
    totalApps: 0,
    totalDownloads: 0,
    hiddenApps: 0
  })
  const [editingApp, setEditingApp] = useState<App | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false)
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const [newApp, setNewApp] = useState({
    app_name: '',
    app_description: '',
    download_url: '',
    category_id: 0
  })
  const [newCategory, setNewCategory] = useState({
    category_name: '',
    category_description: ''
  })
  const [showHidden, setShowHidden] = useState<'all' | 'visible' | 'hidden'>('all')
  const router = useRouter()

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

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [categoriesRes, appsRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/apps')
        ])
        const categoriesData = await categoriesRes.json()
        const appsData = await appsRes.json()
        
        setCategories(categoriesData.categories)
        setApps(appsData.apps)
        
        // 计算统计数据
        const stats = {
          totalApps: appsData.apps.length,
          totalDownloads: appsData.apps.reduce((sum: number, app: App) => sum + app.download_count, 0),
          hiddenApps: appsData.apps.filter((app: App) => app.is_hidden).length
        }
        setStats(stats)
      } catch (error) {
        console.error('加载数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // 修改单个操作函数
  const handleToggleHidden = async (appId: number, isHidden: boolean) => {
    try {
      const response = await fetch('/api/admin/apps/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: appId, is_hidden: isHidden ? 0 : 1 })
      })

      if (!response.ok) throw new Error('操作失败')

      // 更新本地数据
      setApps(apps.map(app => 
        app.app_id === appId 
          ? { ...app, is_hidden: isHidden ? 0 : 1 }
          : app
      ))
    } catch (error) {
      console.error('切换显示状态失败:', error)
    }
  }

  const handleDelete = async (appId: number) => {
    if (!confirm('确定要删除这个应用吗？')) return

    try {
      const response = await fetch('/api/admin/apps/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: appId })
      })

      if (!response.ok) throw new Error('删除失败')

      // 更新本地数据
      setApps(apps.filter(app => app.app_id !== appId))
    } catch (error) {
      console.error('删除应用失败:', error)
    }
  }

  // 修改批量操作函数
  const handleBatchOperation = async (operation: 'hide' | 'show' | 'delete') => {
    if (!selectedApps.length) return
    
    try {
      const promises = selectedApps.map(appId => {
        switch (operation) {
          case 'hide':
          case 'show':
            return fetch('/api/admin/apps/toggle', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                app_id: appId, 
                is_hidden: operation === 'hide' ? 1 : 0 
              })
            })
          case 'delete':
            return fetch('/api/admin/apps/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ app_id: appId })
            })
        }
      })
      
      await Promise.all(promises)
      
      // 更新本地数据
      if (operation === 'delete') {
        setApps(apps.filter(app => !selectedApps.includes(app.app_id)))
      } else {
        setApps(apps.map(app => 
          selectedApps.includes(app.app_id)
            ? { ...app, is_hidden: operation === 'hide' ? 1 : 0 }
            : app
        ))
      }
      setSelectedApps([]) // 清空选择
    } catch (error) {
      console.error('批量操作失败:', error)
    }
  }

  // 过滤和排序应用
  const filteredApps = apps
    .filter(app => {
      const matchesSearch = app.app_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.app_description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || app.category_id === categoryFilter
      const matchesVisibility = showHidden === 'all' 
        ? true 
        : showHidden === 'hidden' 
          ? app.is_hidden === 1
          : app.is_hidden === 0
      
      return matchesSearch && matchesCategory && matchesVisibility
    })
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1
      if (sortField === 'app_name') {
        return order * a.app_name.localeCompare(b.app_name)
      }
      return order * (a.download_count - b.download_count)
    })

  // 添加编辑相关函数
  const handleEdit = (app: App) => {
    setEditingApp(app)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingApp) return

    try {
      const response = await fetch(`/api/admin/apps/${editingApp.app_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingApp)
      })

      if (!response.ok) throw new Error('更新失败')

      // 更新本地数据
      setApps(apps.map(app => 
        app.app_id === editingApp.app_id ? editingApp : app
      ))
      setIsEditModalOpen(false)
      setEditingApp(null)
    } catch (error) {
      console.error('更新应用失败:', error)
    }
  }

  // 添加分类统计计算
  const categoryStats = categories.map(category => ({
    ...category,
    appCount: apps.filter(app => app.category_id === category.category_id).length,
    downloadCount: apps
      .filter(app => app.category_id === category.category_id)
      .reduce((sum, app) => sum + app.download_count, 0)
  }))

  // 添加新应用
  const handleAddApp = async () => {
    try {
      const response = await fetch('/api/admin/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      })

      if (!response.ok) throw new Error('添加失败')
      const data = await response.json()

      setApps([...apps, data.app])
      setIsAddAppModalOpen(false)
      setNewApp({ app_name: '', app_description: '', download_url: '', category_id: 0 })
    } catch (error) {
      console.error('添加应用失败:', error)
    }
  }

  // 添加新分类
  const handleAddCategory = async () => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      })

      if (!response.ok) throw new Error('添加失败')
      const data = await response.json()

      setCategories([...categories, data.category])
      setIsAddCategoryModalOpen(false)
      setNewCategory({ category_name: '', category_description: '' })
    } catch (error) {
      console.error('添加分类失败:', error)
    }
  }

  // 修改删除分类的处理函数
  const handleDeleteCategory = async (categoryId: number) => {
    const appsInCategory = apps.filter(app => app.category_id === categoryId)
    const message = appsInCategory.length > 0 
      ? `该分类下有 ${appsInCategory.length} 个应用，删除分类将同时删除这些应用，确定要继续吗？` 
      : '确定要删除这个分类吗？'

    if (!confirm(message)) return

    try {
      const response = await fetch('/api/admin/categories/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_id: categoryId })
      })

      if (!response.ok) throw new Error('删除失败')

      // 更新本地数据
      setCategories(categories.filter(category => category.category_id !== categoryId))
      setApps(apps.filter(app => app.category_id !== categoryId))
    } catch (error) {
      console.error('删除分类失败:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-end mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setIsAddAppModalOpen(true)}
              className="px-4 py-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-full flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              添加应用
            </button>
            <button
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="px-4 py-2 bg-green-500/80 hover:bg-green-600 text-white rounded-full flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              添加分类
            </button>
          </div>
        </div>

        {/* 添加应用模态框 */}
        {isAddAppModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">添加新应用</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-200 mb-2">应用名称</label>
                  <input
                    title="应用名称"
                    type="text"
                    value={newApp.app_name}
                    onChange={e => setNewApp({ ...newApp, app_name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">应用描述</label>
                  <textarea
                    title="应用描述"
                    value={newApp.app_description}
                    onChange={e => setNewApp({ ...newApp, app_description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 rounded-lg text-white h-32"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">下载链接</label>
                  <input
                    title="下载链接"
                    type="text"
                    value={newApp.download_url}
                    onChange={e => setNewApp({ ...newApp, download_url: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">分类</label>
                  <select
                    title="分类"
                    value={newApp.category_id}
                    onChange={e => setNewApp({ ...newApp, category_id: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-white/10 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white"
                  >
                    <option value={0}>请选择分类</option>
                    {categories.map(category => (
                      <option key={category.category_id} value={category.category_id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setIsAddAppModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAddApp}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    添加
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 添加分类模态框 */}
        {isAddCategoryModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">添加新分类</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-200 mb-2">分类名称</label>
                  <input
                    title="分类名称"
                    type="text"
                    value={newCategory.category_name}
                    onChange={e => setNewCategory({ ...newCategory, category_name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">分类描述</label>
                  <textarea
                    title="分类描述"
                    value={newCategory.category_description}
                    onChange={e => setNewCategory({ ...newCategory, category_description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 rounded-lg text-white h-32"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setIsAddCategoryModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  >
                    添加
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 总体统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-200 mb-2">总应用数</h3>
            <p className="text-3xl font-bold text-white">{stats.totalApps}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-200 mb-2">总下载量</h3>
            <p className="text-3xl font-bold text-white">{stats.totalDownloads}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-200 mb-2">隐藏应用</h3>
            <p className="text-3xl font-bold text-white">{stats.hiddenApps}</p>
          </div>
        </div>

        {/* 分类统计 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">分类统计</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats.map(category => (
              <div 
                key={category.category_id}
                className={`p-4 rounded-lg border border-white/10 
                  ${categoryFilter === category.category_id ? 'bg-white/10' : 'hover:bg-white/5'} 
                  transition-all duration-200`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-white">
                    {category.category_name}
                  </h3>
                  <div className="flex gap-2">
                    {category.is_hidden ? (
                      <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded-full">
                        已隐藏
                      </span>
                    ) : null}
                    <button
                      title="删除分类"
                      onClick={(e) => {
                        e.stopPropagation() // 防止触发分类筛选
                        handleDeleteCategory(category.category_id)
                      }}
                      className="p-1 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-full transition-colors"
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div 
                  onClick={() => setCategoryFilter(
                    categoryFilter === category.category_id ? 'all' : category.category_id
                  )}
                  className="cursor-pointer"
                >
                  <p className="text-sm text-gray-300 mb-3">
                    {category.category_description || '暂无描述'}
                  </p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>应用数: {category.appCount}</span>
                    <span>总下载: {category.downloadCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 搜索和筛选工具栏 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="搜索应用..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 bg-white/10 rounded-lg text-white placeholder-gray-400"
            />
            <select
              title="分类"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-4 py-2 bg-white/10 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white"
            >
              <option value="all">所有分类</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            <select
              title="显示隐藏"
              value={showHidden}
              onChange={e => setShowHidden(e.target.value as 'all' | 'visible' | 'hidden')}
              className="px-4 py-2 bg-white/10 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white"
            >
              <option value="all">全部应用</option>
              <option value="visible">仅显示可见</option>
              <option value="hidden">仅显示隐藏</option>
            </select>
            <select
              title="排序"
              value={sortField}
              onChange={e => setSortField(e.target.value as 'app_name' | 'download_count')}
              className="px-4 py-2 bg-white/10 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white"
            >
              <option value="app_name">按名称</option>
              <option value="download_count">按下载量</option>
            </select>
            <button
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 bg-white/10 rounded-lg text-white"
            >
              {sortOrder === 'asc' ? '升序' : '降序'}
            </button>
          </div>
        </div>

        {/* 批量操作工具栏 */}
        {selectedApps.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-white">已选择 {selectedApps.length} 个应用</span>
              <button
                onClick={() => handleBatchOperation('hide')}
                className="px-4 py-1.5 bg-yellow-500/80 hover:bg-yellow-600 text-white text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                批量隐藏
              </button>
              <button
                onClick={() => handleBatchOperation('show')}
                className="px-4 py-1.5 bg-green-500/80 hover:bg-green-600 text-white text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                批量显示
              </button>
              <button
                onClick={() => handleBatchOperation('delete')}
                className="px-4 py-1.5 bg-red-500/80 hover:bg-red-600 text-white text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                批量删除
              </button>
              <button
                onClick={() => setSelectedApps([])}
                className="px-4 py-1.5 bg-gray-500/80 hover:bg-gray-600 text-white text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                取消选择
              </button>
            </div>
          </div>
        )}

        {/* 编辑模态框 */}
        {isEditModalOpen && editingApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">编辑应用</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-200 mb-2">应用名称</label>
                  <input  
                    title="应用名称"
                    type="text"
                    value={editingApp.app_name}
                    onChange={e => setEditingApp({
                      ...editingApp,
                      app_name: e.target.value
                    })}
                    className="w-full px-4 py-2 bg-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">应用描述</label>
                  <textarea
                    title="应用描述"
                    value={editingApp.app_description}
                    onChange={e => setEditingApp({
                      ...editingApp,
                      app_description: e.target.value
                    })}
                    className="w-full px-4 py-2 bg-white/10 rounded-lg text-white h-32"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">下载链接</label>
                  <input
                    title="下载链接"
                    type="text"
                    value={editingApp.download_url}
                    onChange={e => setEditingApp({
                      ...editingApp,
                      download_url: e.target.value
                    })}
                    className="w-full px-4 py-2 bg-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">分类</label>
                  <select
                    title="分类"
                    value={editingApp.category_id}
                    onChange={e => setEditingApp({
                      ...editingApp,
                      category_id: Number(e.target.value)
                    })}
                    className="w-full px-4 py-2 bg-white/10 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white"
                  >
                    {categories.map(category => (
                      <option key={category.category_id} value={category.category_id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 应用列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // 加载骨架屏
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-white/20 rounded mb-4"></div>
                <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
              </div>
            ))
          ) : filteredApps.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">
              没有找到匹配的应用
            </div>
          ) : (
            filteredApps.map(app => (
              <div 
                key={app.app_id}
                className={`bg-white/10 backdrop-blur-sm rounded-lg p-6 transition-all duration-300 
                  ${app.is_hidden ? 'opacity-50' : ''} 
                  ${selectedApps.includes(app.app_id) ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <label className="relative flex items-center">
                    <input
                      title="选择应用"
                      type="checkbox"
                      checked={selectedApps.includes(app.app_id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedApps(prev => [...prev, app.app_id])
                        } else {
                          setSelectedApps(prev => prev.filter(id => id !== app.app_id))
                        }
                      }}
                      className="peer sr-only" // 隐藏原始复选框
                    />
                    <div className="w-5 h-5 border-2 border-gray-400 rounded 
                      peer-checked:bg-blue-500 peer-checked:border-blue-500 
                      transition-all duration-200">
                      <svg 
                        className="w-4 h-4 text-white scale-0 peer-checked:scale-100 transition-transform duration-200"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </label>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{app.app_name}</h3>
                    <p className="text-gray-300 mb-4">{app.app_description || '暂无描述'}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>下载量: {app.download_count}</span>
                      <span>分类: {categories.find(c => c.category_id === app.category_id)?.category_name}</span>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(app)}
                        className="px-4 py-1.5 bg-blue-500/80 hover:bg-blue-600 text-white text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2"
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                          />
                        </svg>
                        编辑
                      </button>
                      <button
                        title="隐藏/显示"
                        onClick={() => handleToggleHidden(app.app_id, app.is_hidden)}
                        className={`
                          px-4 py-1.5 rounded-full text-sm font-medium
                          transition-all duration-200 flex items-center gap-2
                          ${app.is_hidden 
                            ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                            : 'bg-blue-500/80 hover:bg-blue-600 text-white'}
                        `}
                      >
                        <span className={`w-2 h-2 rounded-full ${app.is_hidden ? 'bg-gray-400' : 'bg-green-400'}`}></span>
                        {app.is_hidden ? '已隐藏' : '已显示'}
                      </button>
                      <button
                        title="删除"
                        onClick={() => handleDelete(app.app_id)}
                        className="px-4 py-1.5 bg-red-500/80 hover:bg-red-600 text-white text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2"
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                          />
                        </svg>
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 添加悬浮返回按钮 */}
        <button
          onClick={() => router.push('/admin')}
          className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 group"
        >
          <svg 
            className="w-5 h-5 transform rotate-180 group-hover:-translate-x-1 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
          返回管理页面
        </button>
      </div>
    </AdminLayout>
  )
} 