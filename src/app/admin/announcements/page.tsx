'use client';

import { useState, memo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import AnnouncementForm from '@/components/admin/AnnouncementForm'
import useSWR from 'swr'

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

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'An error occurred')
  }
  return data
}

// 修改 AnnouncementItem 组件的类型定义
interface AnnouncementItemProps {
  announcement: {
    id: number
    title: string
    content: string
    is_pinned: boolean
    created_at: string
  }
  onRefresh: () => void
}

const AnnouncementItem = memo(({ announcement, onRefresh }: AnnouncementItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: announcement.title,
    content: announcement.content,
    is_pinned: announcement.is_pinned
  })

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/announcements/${announcement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        setIsEditing(false)
        onRefresh()
      } else {
        const error = await response.json()
        alert(error.message || '更新失败')
      }
    } catch (error) {
      console.error('更新失败:', error)
      alert('更新失败')
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">标题</label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">内容</label>
            <textarea
              value={editForm.content}
              onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 min-h-[100px]"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editForm.is_pinned}
              onChange={(e) => setEditForm(prev => ({ ...prev, is_pinned: e.target.checked }))}
              className="w-4 h-4 rounded"
            />
            <label className="text-sm font-medium text-gray-200">置顶</label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            {announcement.title}
            {announcement.is_pinned && (
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
                置顶
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-300 mt-1">
            发布时间: {new Date(announcement.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-1.5 bg-blue-500/80 hover:bg-blue-600 text-white text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            编辑
          </button>
          <button
            onClick={async () => {
              try {
                const response = await fetch(`/api/announcements/${announcement.id}/pin`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ is_pinned: !announcement.is_pinned })
                });
                if (response.ok) {
                  onRefresh();
                }
              } catch (error) {
                console.error('操作失败:', error);
              }
            }}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200 flex items-center gap-2
              ${announcement.is_pinned 
                ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                : 'bg-yellow-500/80 hover:bg-yellow-600 text-white'}
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d={announcement.is_pinned 
                  ? "M19 14l-7 7m0 0l-7-7m7 7V3" 
                  : "M5 15l7-7 7 7"} 
              />
            </svg>
            {announcement.is_pinned ? '取消置顶' : '置顶'}
          </button>
          <button
            onClick={async () => {
              if (confirm('确定要删除这条公告吗？')) {
                try {
                  const response = await fetch(`/api/announcements/${announcement.id}`, {
                    method: 'DELETE'
                  });
                  if (response.ok) {
                    onRefresh();
                  }
                } catch (error) {
                  console.error('删除失败:', error);
                }
              }
            }}
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
      <p className="text-gray-200 whitespace-pre-wrap">{announcement.content}</p>
    </div>
  )
})

// 添加组件名称以避免 memo 警告
AnnouncementItem.displayName = 'AnnouncementItem'

export default function AnnouncementsPage() {
  const router = useRouter()
  const { data, error, mutate } = useSWR('/api/announcements', fetcher, {
    refreshInterval: 0,
    revalidateOnMount: true
  })

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
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8">
          <h1 className="text-2xl font-bold text-white">公告管理</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">发布新公告</h2>
          <AnnouncementForm 
            onSubmitSuccess={() => mutate()}
          />
        </div>

        {error ? (
          <div className="text-center text-red-500">加载失败: {error.message}</div>
        ) : !data?.announcements?.length ? (
          <div className="text-center text-white">暂无公告</div>
        ) : (
          <div className="space-y-4">
            {data.announcements.map((announcement) => (
              <AnnouncementItem 
                key={announcement.id}
                announcement={announcement}
                onRefresh={() => mutate()}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 