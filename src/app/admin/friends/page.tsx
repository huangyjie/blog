'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  tags: string[]
  sort_order: number
  is_hidden: boolean
}

export default function AdminFriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    avatar: '',
    tags: '',
    sort_order: 0,
    qq: ''
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchFriends()
  }, [])

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

  const fetchFriends = async () => {
    try {
      const response = await fetch('/api/admin/friends')
      const data = await response.json()
      if (data.links) {
        setFriends(data.links)
      }
    } catch (error) {
      console.error('获取友链失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let submitData = { ...formData }

      // 如果有QQ号但没有头像，先获取QQ头像
      if (formData.qq && !formData.avatar) {
        const avatarUrl = `http://q1.qlogo.cn/g?b=qq&nk=${formData.qq}&s=100`
        submitData = { ...submitData, avatar: avatarUrl }
      }

      const response = await fetch(
        editingId 
          ? `/api/admin/friends/${editingId}`
          : '/api/admin/friends',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...submitData,
            tags: submitData.tags ? submitData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
          })
        }
      )

      if (response.ok) {
        setFormData({
          name: '',
          description: '',
          url: '',
          avatar: '',
          tags: '',
          sort_order: 0,
          qq: ''
        })
        setEditingId(null)
        fetchFriends()
      }
    } catch (error) {
      console.error('保存友链失败:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个友链吗？')) return

    try {
      await fetch(`/api/admin/friends/${id}`, {
        method: 'DELETE'
      })
      fetchFriends()
    } catch (error) {
      console.error('删除友链失败:', error)
    }
  }

  const handleToggleHidden = async (id: number, isHidden: boolean) => {
    try {
      await fetch('/api/admin/friends/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link_id: id, is_hidden: !isHidden })
      })
      fetchFriends()
    } catch (error) {
      console.error('切换状态失败:', error)
    }
  }

  const fetchQQAvatar = async (qq: string) => {
    if (!qq) return
    try {
      const avatarUrl = `http://q1.qlogo.cn/g?b=qq&nk=${qq}&s=100`
      return new Promise<void>((resolve) => {
        setFormData(prev => ({ ...prev, avatar: avatarUrl }))
        setTimeout(resolve, 0)
      })
    } catch (error) {
      console.error('获取QQ头像失败:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">友情链接管理</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white mb-2">名称</label>
              <input  
                title="名称"
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/10"
                required
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">URL</label>
              <input
                title="URL"
                type="url"
                value={formData.url}
                onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/10"
                required
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">QQ号</label>
              <div className="flex space-x-2">
                <input
                  title="QQ号"
                  type="text"
                  value={formData.qq}
                  onChange={e => setFormData(prev => ({ ...prev, qq: e.target.value }))}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10"
                  placeholder="输入QQ号自动获取头像"
                />
                <button
                  type="button"
                  onClick={() => fetchQQAvatar(formData.qq)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  获取头像
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-white mb-2">头像URL</label>
              <input
                title="头像URL"
                type="url"
                value={formData.avatar}
                onChange={e => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/10"
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">标签 (用逗号分隔)</label>
              <input
                title="标签"
                type="text"
                value={formData.tags}
                onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/10"
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">排序</label>
              <input
                title="排序"
                type="number"
                value={formData.sort_order}
                onChange={e => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 rounded-lg bg-white/10"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-white mb-2">描述</label>
            <textarea
              title="描述"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-white/10"
              rows={3}
            />
          </div>
          
          <button
            type="submit"
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {editingId ? '更新' : '添加'}
          </button>
        </form>
        
        {loading ? (
          <div className="text-center text-white">加载中...</div>
        ) : friends && friends.length > 0 ? (
          <div className="space-y-4">
            {friends.map(friend => (
              <div
                key={friend.link_id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {friend.avatar && (
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-16 h-16 rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {friend.name}
                      </h3>
                      <p className="text-gray-300 mt-2">{friend.description}</p>
                      <a
                        href={friend.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
                      >
                        {friend.url}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(friend.link_id)
                        setFormData({
                          name: friend.name,
                          description: friend.description,
                          url: friend.url,
                          avatar: friend.avatar,
                          tags: Array.isArray(friend.tags) ? friend.tags.join(',') : '',
                          sort_order: friend.sort_order,
                          qq: ''
                        })
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      编辑
                    </button>
                    
                    <button
                      onClick={() => handleToggleHidden(friend.link_id, friend.is_hidden)}
                      className={`px-3 py-1 rounded-lg ${
                        friend.is_hidden
                          ? 'bg-gray-500 hover:bg-gray-600'
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white`}
                    >
                      {friend.is_hidden ? '显示' : '隐藏'}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(friend.link_id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white">暂无友情链接</div>
        )}
      </div>
    </AdminLayout>
  )
} 