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

interface ChatRoom {
  room_id: number
  room_number: string
  room_name: string
  description: string
  is_active: boolean
  created_at: string
}

export default function ChatRoomsPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    room_number: '',
    room_name: '',
    description: ''
  })
  const router = useRouter()

  useEffect(() => {
    loadRooms()
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

  const loadRooms = async () => {
    try {
      const response = await fetch('/api/admin/chatrooms')
      const data = await response.json()
      if (data.rooms) {
        setRooms(data.rooms)
      }
    } catch (error) {
      console.error('加载聊天室失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // 验证表单数据
      if (!formData.room_number.trim() || !formData.room_name.trim()) {
        alert('房间号和房间名称不能为空！')
        return
      }

      console.log('提交的表单数据:', formData) // 添加日志

      const response = await fetch('/api/admin/chatrooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      console.log('服务器响应:', data) // 添加日志

      if (response.ok) {
        alert('聊天室创建成功！')
        setShowCreateForm(false)
        setFormData({ room_number: '', room_name: '', description: '' })
        loadRooms()
      } else {
        alert(data.error || '创建失败，请重试')
      }
    } catch (error) {
      console.error('创建聊天室失败:', error)
      alert('创建失败，请重试：' + (error as Error).message)
    }
  }

  const toggleRoomStatus = async (roomId: number, isActive: boolean) => {
    try {
      await fetch('/api/admin/chatrooms/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room_id: roomId, is_active: !isActive })
      })
      loadRooms()
    } catch (error) {
      console.error('切换聊天室状态失败:', error)
    }
  }

  const deleteRoom = async (roomId: number) => {
    if (!confirm('确定要删除这个聊天室吗？')) return

    try {
      await fetch('/api/admin/chatrooms/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room_id: roomId })
      })
      loadRooms()
    } catch (error) {
      console.error('删除聊天室失败:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">聊天室管理</h1>
            <button
              onClick={() => setShowCreateForm(prev => !prev)}
              className="px-4 py-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-full flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              {showCreateForm ? '取消创建' : '创建聊天室'}
            </button>
          </div>
        </div>

        {/* 创建聊天室表单 */}
        {showCreateForm && (
          <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <h2 className="text-xl font-bold mb-4 text-white">创建新聊天室</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  房间号
                </label>
                <input
                  type="text"
                  value={formData.room_number}
                  onChange={e => setFormData(prev => ({ ...prev, room_number: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-white"
                  placeholder="请输入房间号"
                  title="房间号"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  房间名称
                </label>
                <input
                  type="text"
                  value={formData.room_name}
                  onChange={e => setFormData(prev => ({ ...prev, room_name: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-white"
                  placeholder="请输入房间名称"
                  title="房间名称"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  房间介绍
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-white"
                  placeholder="请输入房间介绍"
                  title="房间介绍"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-500/80 hover:bg-gray-600 text-white rounded-full transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-full transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  创建
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 聊天室列表 */}
        <div className="grid gap-6">
          {isLoading ? (
            // 加载骨架屏
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 animate-pulse">
                <div className="h-6 bg-white/20 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
              </div>
            ))
          ) : rooms.length === 0 ? (
            <div className="text-center text-gray-400 py-8">暂无聊天室</div>
          ) : (
            rooms.map(room => (
              <div
                key={room.room_id}
                className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 hover:bg-white/20 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {room.room_name}
                      </h3>
                      <span className={`
                        px-2 py-1 rounded-full text-xs flex items-center gap-1
                        ${room.is_active 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'}
                      `}>
                        <span className={`w-2 h-2 rounded-full ${room.is_active ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                        {room.is_active ? '运行中' : '已关闭'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">
                      房间号: {room.room_number}
                    </p>
                    <p className="text-gray-200">{room.description || '暂无描述'}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      创建时间: {new Date(room.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleRoomStatus(room.room_id, room.is_active)}
                      className={`
                        px-4 py-1.5 rounded-full text-sm font-medium
                        transition-all duration-200 flex items-center gap-2
                        ${room.is_active
                          ? 'bg-yellow-500/80 hover:bg-yellow-600 text-white'
                          : 'bg-green-500/80 hover:bg-green-600 text-white'}
                      `}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d={room.is_active
                            ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            : "M5 13l4 4L19 7"}
                        />
                      </svg>
                      {room.is_active ? '关闭' : '开启'}
                    </button>
                    <button
                      onClick={() => deleteRoom(room.room_id)}
                      className="px-4 py-1.5 bg-red-500/80 hover:bg-red-600 text-white text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
} 