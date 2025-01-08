'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'

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

// 修改类型定义
type AdminRole = 'super_admin' | 'admin' | 'editor'

interface Administrator {
  admin_id: number
  username: string
  email: string | null
  nickname: string | null
  avatar_url: string | null
  role: AdminRole
  last_login: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdministratorsPage() {
  const [administrators, setAdministrators] = useState<Administrator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    nickname: '',
    role: 'admin' as const
  })
  const [editingAdmin, setEditingAdmin] = useState<Administrator | null>(null)
  const [editForm, setEditForm] = useState<{
    username: string
    email: string
    nickname: string
    role: AdminRole
    is_active: boolean
  }>({
    username: '',
    email: '',
    nickname: '',
    role: 'admin',
    is_active: true
  })

  const fetchAdministrators = async () => {
    try {
      const response = await fetch('/api/admin/administrators')
      const data = await response.json()
      if (Array.isArray(data)) {
        setAdministrators(data)
      }
    } catch (error) {
      console.error('获取管理员列表失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAdministrators()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('两次输入的密码不一致')
      return
    }

    try {
      const response = await fetch('/api/admin/administrators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email || null,
          nickname: formData.nickname || null,
          role: formData.role
        })
      })

      if (response.ok) {
        setShowAddForm(false)
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          email: '',
          nickname: '',
          role: 'admin'
        })
        fetchAdministrators()
      } else {
        const data = await response.json()
        alert(data.error || '添加管理员失败')
      }
    } catch (error) {
      console.error('添加管理员失败:', error)
      alert('添加管理员失败')
    }
  }

  const handleDelete = async (adminId: number) => {
    if (!confirm('确定要删除这个管理员吗？')) return

    try {
      const response = await fetch(`/api/admin/administrators/${adminId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchAdministrators()
      } else {
        const data = await response.json()
        alert(data.error || '删除管理员失败')
      }
    } catch (error) {
      console.error('删除管理员失败:', error)
      alert('删除管理员失败')
    }
  }

  const toggleActive = async (adminId: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/administrators/${adminId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isActive })
      })

      if (response.ok) {
        fetchAdministrators()
      }
    } catch (error) {
      console.error('切换管理员状态失败:', error)
    }
  }

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

  return (
    <AdminLayout>
      <div className="p-8">
        {/* 顶部标题栏 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">管理员设置</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              添加管理员
            </button>
          </div>
        </div>

        {/* 管理员列表 */}
        {isLoading ? (
          <div className="text-center text-white">加载中...</div>
        ) : (
          <div className="space-y-4">
            {administrators.map(admin => (
              <div
                key={admin.admin_id}
                className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      {admin.avatar_url && (
                        <img 
                          src={admin.avatar_url} 
                          alt={admin.username} 
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {admin.username}
                          <span className="ml-2 px-2 py-1 text-xs rounded" style={{
                            backgroundColor: admin.role === 'super_admin' 
                              ? 'rgb(234 179 8)' 
                              : admin.role === 'admin'
                              ? 'rgb(59 130 246)'
                              : 'rgb(99 102 241)',
                            color: 'white'
                          }}>
                            {admin.role === 'super_admin' ? '超级管理员' : admin.role === 'admin' ? '管理员' : '编辑'}
                          </span>
                        </h3>
                        {admin.nickname && (
                          <p className="text-sm text-gray-300">昵称: {admin.nickname}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      {admin.email && (
                        <p className="text-sm text-gray-300">邮箱: {admin.email}</p>
                      )}
                      <p className="text-sm text-gray-300">
                        创建时间: {new Date(admin.created_at).toLocaleString()}
                      </p>
                      {admin.last_login && (
                        <p className="text-sm text-gray-300">
                          最后登录: {new Date(admin.last_login).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {admin.role !== 'super_admin' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setEditingAdmin(admin)
                          setEditForm({
                            username: admin.username,
                            email: admin.email || '',
                            nickname: admin.nickname || '',
                            role: admin.role,
                            is_active: admin.is_active
                          })
                        }}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => toggleActive(admin.admin_id, admin.is_active)}
                        className={`px-3 py-1 text-white text-sm rounded-lg transition-colors ${
                          admin.is_active
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {admin.is_active ? '禁用' : '启用'}
                      </button>
                      <button
                        onClick={() => handleDelete(admin.admin_id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 添加管理员表单模态框 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">添加管理员</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    用户名
                  </label>
                  <input
                    title="用户名"
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    密码
                  </label>
                  <input
                    title="密码"
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    确认密码
                  </label>
                  <input
                    title="确认密码"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    邮箱
                  </label>
                  <input
                    title="邮箱"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    昵称
                  </label>
                  <input
                    title="昵称"
                    type="text"
                    value={formData.nickname}
                    onChange={e => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    角色
                  </label>
                  <div className="relative">
                    <select
                      title="角色"
                      value={formData.role}
                      onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'editor' }))}
                      className="w-full px-4 py-2 bg-white/10 text-white rounded-lg appearance-none"
                    >
                      <option value="admin" className="bg-gray-800 text-white">管理员</option>
                      <option value="editor" className="bg-gray-800 text-white">编辑</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    添加
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 添加编辑表单模态框 */}
        {editingAdmin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">编辑管理员</h2>
              <form onSubmit={async (e) => {
                e.preventDefault()
                try {
                  const response = await fetch(`/api/admin/administrators/${editingAdmin.admin_id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editForm)
                  })

                  if (!response.ok) {
                    throw new Error('更新失败')
                  }

                  await fetchAdministrators()
                  setEditingAdmin(null)
                } catch (error) {
                  console.error('更新管理员失败:', error)
                  alert('更新失败，请重试')
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={e => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    昵称
                  </label>
                  <input
                    type="text"
                    value={editForm.nickname}
                    onChange={e => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    角色
                  </label>
                  <select
                    value={editForm.role}
                    onChange={e => setEditForm(prev => ({ 
                      ...prev, 
                      role: e.target.value as AdminRole 
                    }))}
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg appearance-none"
                  >
                    <option value="admin" className="bg-gray-800 text-white">管理员</option>
                    <option value="editor" className="bg-gray-800 text-white">编辑</option>
                  </select>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                    <input
                      type="checkbox"
                      checked={editForm.is_active}
                      onChange={e => setEditForm(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 rounded"
                    />
                    账号启用
                  </label>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingAdmin(null)}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}