'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { RandomBackground } from '@/components/ui/random-background'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'

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

interface Talk {
  talk_id: number
  author: string
  title: string
  content: string
  email: string
  created_at: string
  is_hidden: number
}

interface ExpandedState {
  [key: number]: boolean
}

interface EditingState {
  [key: number]: boolean
}

// 添加快捷标记按钮组件
const QuickMarkButtons = ({ targetRef }: { targetRef: React.RefObject<HTMLTextAreaElement> }) => {
  const insertMark = (startTag: string, endTag: string) => {
    if (!targetRef.current) return;
    
    const start = targetRef.current.selectionStart;
    const end = targetRef.current.selectionEnd;
    const text = targetRef.current.value;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + 
      `<${startTag}<${selectedText}>${endTag}>` + 
      text.substring(end);
    
    targetRef.current.value = newText;
    targetRef.current.focus();
  };

  const insertTable = () => {
    if (!targetRef.current) return;
    const tableTemplate = `<表格<
  <行<
    <表头<标题1>表头><表头<标题2>表头>
  >行>
  <行<
    <格<内容1>格><格<内容2>格>
  >行>
>表格>`;
    const start = targetRef.current.selectionStart;
    targetRef.current.value = 
      targetRef.current.value.slice(0, start) + 
      tableTemplate + 
      targetRef.current.value.slice(start);
  };

  const insertList = () => {
    if (!targetRef.current) return;
    const listTemplate = `<列表<
  <项<列表项1>项>
  <项<列表项2>项>
>列表>`;
    const start = targetRef.current.selectionStart;
    targetRef.current.value = 
      targetRef.current.value.slice(0, start) + 
      listTemplate + 
      targetRef.current.value.slice(start);
  };

  const insertCode = () => {
    if (!targetRef.current) return;
    const codeTemplate = `<代码<
\`\`\`语言
在这里输入代码...
\`\`\`
>代码>`;
    const start = targetRef.current.selectionStart;
    targetRef.current.value = 
      targetRef.current.value.slice(0, start) + 
      codeTemplate + 
      targetRef.current.value.slice(start);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {/* 文本样式 */}
      <button
        type="button"
        onClick={() => insertMark('加粗', '加粗')}
        className="px-2 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded"
      >
        加粗
      </button>
      <button
        type="button"
        onClick={() => insertMark('斜体', '斜体')}
        className="px-2 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded"
      >
        斜体
      </button>
      <button
        type="button"
        onClick={() => insertMark('删除', '删除')}
        className="px-2 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded"
      >
        删除线
      </button>
      <button
        type="button"
        onClick={() => insertMark('下划线', '下划线')}
        className="px-2 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded"
      >
        下划线
      </button>
      <button
        type="button"
        onClick={() => insertMark('上标', '上标')}
        className="px-2 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded"
      >
        上标
      </button>
      <button
        type="button"
        onClick={() => insertMark('下标', '下标')}
        className="px-2 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded"
      >
        下标
      </button>

      {/* 链接 */}
      <button
        type="button"
        onClick={() => {
          const url = prompt('请输入链接地址：');
          if (url) {
            insertMark(`a(${url})`, 'a');
          }
        }}
        className="px-2 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        链接
      </button>

      {/* 布局 */}
      <button
        type="button"
        onClick={() => insertMark('居中', '居中')}
        className="px-2 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded"
      >
        居中
      </button>
      <button
        type="button"
        onClick={() => insertMark('两端对齐', '两端对齐')}
        className="px-2 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded"
      >
        两端对齐
      </button>

      {/* 结构 */}
      <button
        type="button"
        onClick={insertTable}
        className="px-2 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded"
      >
        表格
      </button>
      <button
        type="button"
        onClick={insertList}
        className="px-2 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
      >
        列表
      </button>
      <button
        type="button"
        onClick={() => insertMark('引用', '引用')}
        className="px-2 py-1 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded"
      >
        引用
      </button>
      <button
        type="button"
        onClick={insertCode}
        className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
      >
        代码块
      </button>
      <button
        type="button"
        onClick={() => insertMark('段落', '段落')}
        className="px-2 py-1 text-sm bg-pink-600 hover:bg-pink-700 text-white rounded"
      >
        段落
      </button>
      <button
        type="button"
        onClick={() => insertMark('缩进', '缩进')}
        className="px-2 py-1 text-sm bg-pink-600 hover:bg-pink-700 text-white rounded"
      >
        缩进
      </button>
    </div>
  );
};

export default function AdminTalksPage() {
  const { isValidating, isAuthenticated } = useAdminAuth()
  const [talks, setTalks] = useState<Talk[]>([])
  const router = useRouter()
  const [expandedTalks, setExpandedTalks] = useState<ExpandedState>({})
  const [editingTalks, setEditingTalks] = useState<EditingState>({})
  const newContentRef = useRef<HTMLTextAreaElement>(null)
  const editContentRefs = useRef<{ [key: number]: HTMLTextAreaElement | null }>({})

  useEffect(() => {
    if (isAuthenticated) {
      loadTalks()
    }
  }, [isAuthenticated])

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

  const loadTalks = async () => {
    try {
      const response = await fetch('/api/admin/talks')
      const data = await response.json()
      if (data.talks) {
        setTalks(data.talks)
      }
    } catch (error) {
      console.error('加载说说失败:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      const response = await fetch('/api/admin/talks', {
        method: 'POST',
        body: JSON.stringify({
          author: formData.get('author'),
          title: formData.get('title'),
          content: formData.get('content'),
          email: formData.get('email')
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        alert('发表成功')
        loadTalks()
        form.reset()
      } else {
        alert('发表失败：' + data.error)
      }
    } catch (error) {
      alert('发表失败')
    }
  }

  const toggleTalk = async (talkId: number, currentStatus: number) => {
    try {
      const response = await fetch('/api/admin/talks/toggle', {
        method: 'POST',
        body: JSON.stringify({ 
          talk_id: talkId, 
          is_hidden: currentStatus === 1 ? 0 : 1 
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        loadTalks()
      } else {
        alert('操作失败：' + data.error)
      }
    } catch (error) {
      alert('操作失败')
    }
  }

  const deleteTalk = async (talkId: number) => {
    if (!confirm('确定要删除这条说说吗？')) return

    try {
      const response = await fetch('/api/admin/talks/delete', {
        method: 'POST',
        body: JSON.stringify({ talk_id: talkId }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        loadTalks()
      } else {
        alert('删除失败：' + data.error)
      }
    } catch (error) {
      alert('删除失败')
    }
  }

  const toggleExpand = (talkId: number) => {
    setExpandedTalks(prev => ({
      ...prev,
      [talkId]: !prev[talkId]
    }))
  }

  const startEditing = (talkId: number) => {
    setEditingTalks(prev => ({
      ...prev,
      [talkId]: true
    }))
  }

  const cancelEditing = (talkId: number) => {
    setEditingTalks(prev => ({
      ...prev,
      [talkId]: false
    }))
  }

  const handleEdit = async (talkId: number, formData: FormData) => {
    try {
      const response = await fetch('/api/admin/talks/edit', {
        method: 'POST',
        body: JSON.stringify({
          talk_id: talkId,
          author: formData.get('author'),
          title: formData.get('title'),
          content: formData.get('content'),
          email: formData.get('email')
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        alert('编辑成功')
        loadTalks()
        cancelEditing(talkId)
      } else {
        alert('编辑失败：' + data.error)
      }
    } catch (error) {
      alert('编辑失败')
    }
  }

  if (isValidating) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">验证中...</div>
        </div>
      </AdminLayout>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">说说管理</h1>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-white">发表说说</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-200">发表人</label>
                <input
                  type="text"
                  name="author"
                  required
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                  placeholder="请输入发表人姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-200">联系方式</label>
                <input
                  type="text"
                  name="email"
                  required
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                  placeholder="请输入联系方式，可使用超链接标记，如：<a(mailto:xxx@qq.com)<邮箱>a>"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">标题</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                placeholder="请输入说说标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">正文</label>
              <textarea
                name="content"
                required
                rows={5}
                ref={newContentRef}
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                placeholder="请输入说说内容"
              />
              <QuickMarkButtons targetRef={newContentRef} />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
            >
              发表说说
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6 text-white">说说列表</h2>
          <div className="space-y-6">
            {talks.map(talk => (
              <div 
                key={talk.talk_id} 
                className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 hover:bg-white/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{talk.title}</h3>
                    <p className="text-sm text-gray-300">
                      {talk.author} · {talk.email} · {new Date(talk.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => toggleTalk(talk.talk_id, talk.is_hidden)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                    >
                      {talk.is_hidden ? '显示' : '隐藏'}
                    </button>
                    <button
                      onClick={() => editingTalks[talk.talk_id] ? cancelEditing(talk.talk_id) : startEditing(talk.talk_id)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors"
                    >
                      {editingTalks[talk.talk_id] ? '取消' : '编辑'}
                    </button>
                    <button
                      onClick={() => deleteTalk(talk.talk_id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
                {editingTalks[talk.talk_id] ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleEdit(talk.talk_id, new FormData(e.currentTarget))
                    }} 
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-200">发表人</label>
                        <input
                          type="text"
                          name="author"
                          defaultValue={talk.author}
                          required
                          title="作者名称"
                          placeholder="请输入作者名称"
                          className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-200">联系方式</label>
                        <input
                          type="text"
                          name="email"
                          defaultValue={talk.email}
                          required
                          title="联系方式"
                          placeholder="请输入联系方式，可使用超链接标记，如：<a(mailto:xxx@qq.com)<邮箱>a>"
                          className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-200">标题</label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={talk.title}
                        required
                        title="说说标题"
                        placeholder="请输入说说标题"
                        className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-200">内容</label>
                      <textarea
                        name="content"
                        defaultValue={talk.content}
                        required
                        title="说说内容"
                        placeholder="请输入说说内容"
                        rows={5}
                        ref={el => editContentRefs.current[talk.talk_id] = el}
                        className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                      />
                      <QuickMarkButtons 
                        targetRef={{ current: editContentRefs.current[talk.talk_id] }} 
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      保存修改
                    </button>
                  </form>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-200 whitespace-pre-wrap">
                      {expandedTalks[talk.talk_id] 
                        ? talk.content 
                        : talk.content.length > 100 
                          ? `${talk.content.slice(0, 100)}...` 
                          : talk.content
                      }
                    </p>
                    {talk.content.length > 100 && (
                      <button
                        onClick={() => toggleExpand(talk.talk_id)}
                        className="text-blue-400 hover:text-blue-300 text-sm mt-2"
                      >
                        {expandedTalks[talk.talk_id] ? '收起' : '展开'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 