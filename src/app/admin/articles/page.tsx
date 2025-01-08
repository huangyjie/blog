'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useRouter } from 'next/navigation'
import { Edit, Eye, EyeOff, Download, Trash2 } from 'lucide-react'

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

interface Article {
  id: number
  title: string
  description: string
  file_path: string
  icon: string
  created_at: string
  is_visible: boolean
}

// 图标选择模态框组件
function IconModal({ isOpen, onClose, onSelect, icons }: {
  isOpen: boolean
  onClose: () => void
  onSelect: (icon: string) => void
  icons: { name: string; icon: string; category: string }[]
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  if (!isOpen) return null

  const categories = Array.from(new Set(icons.map(icon => icon.category)))

  const filteredIcons = icons.filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? icon.category === selectedCategory : true)
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-white mb-4">选择图标</h2>
        <input
          type="text"
          placeholder="搜索图标..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-white/10 text-white rounded-lg"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-700 text-white rounded-lg border border-white/30 focus:border-white/50 focus:outline-none transition-colors"
        >
          <option value="">所有分类</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <div className="grid grid-cols-4 gap-4 max-h-60 overflow-y-auto">
          {filteredIcons.map((icon) => (
            <button
              key={icon.icon}
              type="button"
              onClick={() => {
                onSelect(icon.icon)
                onClose()
              }}
              className="flex flex-col items-center gap-2 hover:bg-white/10 transition-colors p-2 rounded-lg"
              aria-label={`选择 ${icon.name}`}
            >
              <img 
                src={`/icons/${icon.icon}.svg`}
                alt={icon.name}
                className="w-8 h-8"
              />
              <span className="text-white text-sm">{icon.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          关闭
        </button>
      </div>
    </div>
  )
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
    icon: ''
  })
  const [icons] = useState([
    { name: 'Angular', icon: 'angular', category: '编程语言' },
    { name: 'Brush', icon: 'brush', category: '其他' },
    { name: 'Computer', icon: 'computer', category: '其他' },
    { name: 'CSS3', icon: 'css3', category: '编程语言' },
    { name: 'Docker', icon: 'docker', category: '工具和平台' },
    { name: 'Download', icon: 'download', category: '其他' },
    { name: 'Eclipse', icon: 'eclipse', category: '工具和平台' },
    { name: 'Ember', icon: 'ember', category: '框架和库' },
    { name: 'Git', icon: 'git', category: '工具和平台' },
    { name: 'HTML5', icon: 'html5', category: '编程语言' },
    { name: 'Java', icon: 'java', category: '编程语言' },
    { name: 'Javascript', icon: 'javascript', category: '编程语言' },
    { name: 'JetBrains', icon: 'jetbrains', category: '工具和平台' },
    { name: 'jQuery', icon: 'jquery', category: '框架和库' },
    { name: 'MongoDB', icon: 'mongodb', category: '工具和平台' },
    { name: 'MySQL', icon: 'mysql', category: '工具和平台' },
    { name: 'Node.js', icon: 'nodejs', category: '框架和库' },
    { name: 'React', icon: 'react', category: '框架和库' },
    { name: 'Svelte', icon: 'svelte', category: '框架和库' },
    { name: 'Terminal', icon: 'terminal', category: '工具和平台' },
    { name: 'Typescript', icon: 'typescript', category: '编程语言' },
    { name: 'Vue', icon: 'vue', category: '框架和库' },
    { name: 'Python', icon: 'python', category: '编程语言' },
    { name: '.NET', icon: 'net', category: '编程语言' },
    { name: 'C#', icon: 'csharp', category: '编程语言' },
    { name: 'C++', icon: 'cpp', category: '编程语言' },
    { name: 'C', icon: 'c', category: '编程语言' },
    { name: 'Go', icon: 'go', category: '编程语言' },
    { name: 'PHP', icon: 'php', category: '编程语言' },
    { name: 'Ruby', icon: 'ruby', category: '编程语言' },
    { name: 'Swift', icon: 'swift', category: '编程语言' },
    { name: 'Kotlin', icon: 'kotlin', category: '编程语言' },
    { name: 'Kali', icon: 'kali', category: '其他' },
    { name: 'Linux', icon: 'linux', category: '操作系统' },
    { name: 'Windows', icon: 'windows', category: '操作系统' },
    { name: 'Mac', icon: 'mac', category: '操作系统' },
    { name: 'Rust', icon: 'rust', category: '编程语言' },
    { name: 'Android', icon: 'android', category: '操作系统' },
    { name: 'Internet', icon: 'internet', category: '其他' },
    { name: 'Hacker', icon: 'hacker', category: '其他' },
    { name: 'AI', icon: 'ai', category: '其他' },
    { name: 'Opening', icon: 'opening', category: '其他' },
    { name: 'Edge', icon: 'edge', category: '浏览器' },
    { name: 'Browser', icon: 'browser', category: '浏览器' },
    { name: 'Chrome', icon: 'chrome', category: '浏览器' },
    { name: 'Firefox', icon: 'firefox', category: '浏览器' },
    { name: 'Safari', icon: 'safari', category: '浏览器' },
    { name: 'Opera', icon: 'opera', category: '浏览器' },
    { name: 'Facebook', icon: 'facebook', category: '社交媒体' },
    { name: 'X', icon: 'x', category: '社交媒体' },
    { name: 'LinkedIn', icon: 'linkedIn', category: '社交媒体' },
    { name: 'Instagram', icon: 'instagram', category: '社交媒体' },
    { name: 'AWS', icon: 'aws', category: '云服务' },
    { name: 'Azure', icon: 'azure', category: '云服务' },
    { name: 'Google Cloud', icon: 'google-cloud', category: '云服务' },
    { name: 'PostgreSQL', icon: 'postgresql', category: '工具和平台' },
    { name: 'SQLite', icon: 'sqlite', category: '工具和平台' },
    { name: 'Redis', icon: 'redis', category: '工具和平台' },
    { name: 'VSCode', icon: 'vscode', category: '工具和平台' },
    { name: 'Sublime Text', icon: 'sublime-text', category: '工具和平台' },
    { name: 'Atom', icon: 'atom', category: '工具和平台' },
    { name: 'Spring', icon: 'spring', category: '框架和库' },
    { name: '防火墙', icon: 'firewall', category: '其他' },
    { name: '加密', icon: 'encryption', category: '其他' },
    { name: 'VPN', icon: 'vpn', category: '其他' }
  ])
  const [isIconModalOpen, setIsIconModalOpen] = useState(false)
  
  // 获取文章列表
  const fetchArticles = async () => {
    const res = await fetch('/api/admin/articles')
    const data = await res.json()
    setArticles(data.articles)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  // 处理文件上传
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 如果是新增文章，需要检查文件
    if (!editingArticle && !formData.file) {
      alert('请选择要上传的文件')
      return
    }

    try {
      if (editingArticle) {
        // 更新文章信息
        const res = await fetch(`/api/admin/articles/${editingArticle.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            icon: formData.icon
          })
        })

        if (res.ok) {
          fetchArticles()
          setFormData({ title: '', description: '', file: null, icon: '' })
          setEditingArticle(null)
        } else {
          const error = await res.json()
          alert(error.message || '更新失败')
        }
      } else {
        // 新增文章
        const formDataToSend = new FormData()
        formDataToSend.append('title', formData.title)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('icon', formData.icon)
        formDataToSend.append('file', formData.file!)

        const res = await fetch('/api/admin/articles', {
          method: 'POST',
          body: formDataToSend
        })

        if (res.ok) {
          fetchArticles()
          setFormData({ title: '', description: '', file: null, icon: '' })
        } else {
          const error = await res.json()
          alert(error.message || '添加失败')
        }
      }
    } catch (error) {
      console.error('操作失败:', error)
      alert('操作失败')
    }
  }

  // 切换文章可见性
  const toggleVisibility = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/articles/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        fetchArticles() // 重新获取文章列表
      }
    } catch (error) {
      console.error('切换文章可见性失败:', error)
    }
  }

  // 删除文章
  const deleteArticle = async (id: number) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        fetchArticles()
      }
    } catch (error) {
      console.error('删除文章失败:', error)
    }
  }

  // 编辑文章
  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      description: article.description,
      file: null,
      icon: article.icon
    })
  }

  // 添加取消编辑的函数
  const handleCancel = () => {
    setEditingArticle(null)
    setFormData({
      title: '',
      description: '',
      file: null,
      icon: ''
    })
  }

  // 下载文章
  const downloadArticle = (filePath: string) => {
    window.open(filePath, '_blank')
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
            <h1 className="text-2xl font-bold text-white">文章管理</h1>
          </div>
        </div>

        {/* 添加文章表单 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-white">
            {editingArticle ? '编辑文章' : '添加文章'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">标题</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                placeholder="请输入文章标题"
                title="文章标题"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                placeholder="请输入文章描述"
                title="文章描述"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">文件</label>
              {!editingArticle && (
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files ? e.target.files[0] : null })}
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/80 file:text-white hover:file:bg-blue-600"
                  title="选择文件"
                  required
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">图标</label>
              <button
                type="button"
                onClick={() => setIsIconModalOpen(true)}
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {formData.icon ? (
                    <>
                      <img 
                        src={`/icons/${formData.icon}.svg`}
                        alt="Selected icon"
                        className="w-5 h-5"
                      />
                      <span>{icons.find(i => i.icon === formData.icon)?.name || '选择图标'}</span>
                    </>
                  ) : (
                    <span>选择图标</span>
                  )}
                </div>
              </button>
            </div>
            <div className="flex justify-end gap-4">
              {editingArticle && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-500/80 hover:bg-gray-600 text-white rounded-full transition-all duration-200 flex items-center gap-2 hover:scale-105"
                >
                  取消
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-full transition-all duration-200 flex items-center gap-2 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {editingArticle ? '更新' : '添加'}
              </button>
            </div>
          </form>
        </div>

        {/* 图标选择模态框 */}
        <IconModal
          isOpen={isIconModalOpen}
          onClose={() => setIsIconModalOpen(false)}
          onSelect={(icon) => setFormData(prev => ({ ...prev, icon }))}
          icons={icons}
        />

        {/* 文章列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <div 
              key={article.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={`/icons/${article.icon}.svg`}
                  alt={article.title}
                  className="w-8 h-8"
                />
                <h3 className="text-xl font-semibold text-white flex-1">{article.title}</h3>
              </div>
              <p className="text-gray-300 mb-4">{article.description}</p>
              <div className="text-sm text-gray-400 mb-4">
                {new Date(article.created_at).toLocaleString()}
              </div>
              
              {/* 操作按钮组 */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => handleEdit(article)}
                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-full transition-colors"
                  title="编辑"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => toggleVisibility(article.id)}
                  className={`p-2 rounded-full transition-colors ${
                    article.is_visible 
                      ? 'text-green-400 hover:bg-green-500/20' 
                      : 'text-gray-400 hover:bg-gray-500/20'
                  }`}
                  title={article.is_visible ? '隐藏' : '显示'}
                >
                  {article.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() => downloadArticle(article.file_path)}
                  className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-full transition-colors"
                  title="下载"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => deleteArticle(article.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"
                  title="删除"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
} 