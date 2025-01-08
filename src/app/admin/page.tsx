'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import type { AdminCard } from '@/types/admin'

// 添加 AdminRole 类型定义
type AdminRole = 'super_admin' | 'admin' | 'editor'

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

  @keyframes heartbeat {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }

  .heartbeat-line {
    animation: heartbeat 3s linear infinite;
  }

  @keyframes number-increment {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-number {
    animation: number-increment 1s ease-out forwards;
  }
`;

// 添加一个数字滚动组件
const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const startValue = displayValue;
    
    const updateNumber = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setDisplayValue(Math.floor(startValue + (value - startValue) * progress));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateNumber);
      }
    };
    
    animationFrame = requestAnimationFrame(updateNumber);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);
  
  return <span>{displayValue}</span>;
};

export default function AdminPage() {
  const { isAuthenticated, role } = useAdminAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adminInfo, setAdminInfo] = useState({ 
    name: '', 
    ip: '', 
    loginTime: '',
    email: '' 
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    nickname: '',
    username: '',
    email: '',
    password: ''
  })
  const [systemStats, setSystemStats] = useState({
    systemStatus: 'normal',
    lastBackupTime: '',
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: [] as Array<{
      name: string;
      path: string;
      total: string;
      used: string;
      usagePercent: number;
      type: string;
    }>,
    instanceName: 'CloudOS_xiaohuang',
    os: 'OpenCloudOS 9.2',
    cpuConfig: '2核',
    memorySize: '2GB',
    diskSize: 'SSD 50GB',
    bandwidth: '4Mbps',
    region: '成都一区',
    expireDate: '2025-10-12',
    runningDays: 0,
    runningHours: 0
  })

  const adminCards: AdminCard[] = [
    // 超级管理员专属功能
    {
      title: '管理员设置',
      description: '管理员账号设置、权限管理',
      icon: 'admin',
      href: '/admin/administrators',
      requiredRole: 'super_admin'
    },
    
    // 管理员级别功能
    {
      title: '数据统计',
      description: '查看系统各项数据统计信息',
      icon: 'stats',
      href: '/admin/statistics',
      requiredRole: 'admin'
    },
    {
      title: '文章管理',
      description: '管理博客文章、创建新文章、编辑已有文章',
      icon: 'article',
      href: '/admin/articles',
      requiredRole: 'admin'
    },
    {
      title: '资源管理',
      description: '管理下载资源、上传新资源、编辑资源信息',
      icon: 'resource',
      href: '/admin/resources',
      requiredRole: 'admin'
    },
    {
      title: '公告管理',
      description: '发布网站公告、管理公告内容',
      icon: 'announcement',
      href: '/admin/announcements',
      requiredRole: 'admin'
    },
    {
      title: '友链管理',
      description: '管理友情链接、添加新链接、编辑链接信息',
      icon: 'link',
      href: '/admin/friends',
      requiredRole: 'admin'
    },
    
    // 普通用户(editor)功能
    {
      title: '聊天室管理',
      description: '管理聊天室、监控聊天内容、处理违规消息',
      icon: 'chat',
      href: '/admin/chatrooms',
      requiredRole: 'editor'
    },
    {
      title: '留言管理',
      description: '查看和回复用户留言、处理反馈信息',
      icon: 'message',
      href: '/admin/messages',
      requiredRole: 'editor'
    },
    {
      title: '反馈管理',
      description: '查看用户反馈、处理用户建议',
      icon: 'feedback',
      href: '/admin/feedback',
      requiredRole: 'editor'
    },
    {
      title: '说说管理',
      description: '发布和管理个人说说、心情随笔',
      icon: 'talk',
      href: '/admin/talks',
      requiredRole: 'editor'
    }
  ]

  // 添加权限检查函数
  const hasPermission = (requiredRole: AdminRole) => {
    if (!role) return false
    const roleHierarchy: Record<AdminRole, number> = {
      super_admin: 3,
      admin: 2,
      editor: 1
    }
    return roleHierarchy[role] >= roleHierarchy[requiredRole]
  }

  useEffect(() => {
    try {
      // 检查浏览器兼容性
      const userAgent = window.navigator.userAgent
      console.log('当前浏览器:', userAgent) // 添加日志
      
      // 检查 localStorage 是否可用
      const testKey = '__test__'
      localStorage.setItem(testKey, testKey)
      localStorage.removeItem(testKey)
      
      setIsLoading(false)
    } catch (err) {
      console.error('浏览器兼容性检查失败:', err)
      setError('您的浏览器可能不支持某些必要功能，请尝试使用其他现代浏览器。')
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isLoading || error) return

    console.log('开始验证管理员身份...')
    fetch('/api/admin/check-auth')
      .then(res => {
        console.log('API响应状态:', res.status)
        if (!res.ok) throw new Error('验证失败')
        return res.json()
      })
      .then(data => {
        console.log('API返回完整数据:', data)
        if (!data.authenticated) {
          console.log('未通过身份验证，跳转到登录页')
          router.push('/admin/login')
        } else {
          console.log('身份验证成功，管理员信息:', {
            name: data.name,
            email: data.email,
            role: data.role,
            loginTime: data.loginTime,
            ip: data.ip
          })
          setAdminInfo({
            name: data.name || '未知用户',
            ip: data.ip || '获取IP中...',
            loginTime: data.loginTime ? new Date(data.loginTime).toLocaleString() : '未知时间',
            email: data.email || '未设置'
          })
        }
      })
      .catch((err) => {
        console.error('验证过程出错:', err)
        router.push('/admin/login')
      })
  }, [router, isLoading, error])

  useEffect(() => {
    if (isLoading || error) return

    // 获取系统状态
    const fetchSystemStats = async () => {
      try {
        const res = await fetch('/api/admin/system-stats')
        if (!res.ok) throw new Error('获取系统状态失败')
        const data = await res.json()
        setSystemStats(prev => ({
          ...prev,
          ...data
        }))
      } catch (error) {
        console.error('获取系统状态失败:', error)
      }
    }

    // 首次加载获取状态
    fetchSystemStats()

    // 定时器设置
    const statsTimer = setInterval(fetchSystemStats, 5000)

    return () => {
      clearInterval(statsTimer)
    }
  }, [isLoading, error])

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

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">加载中...</div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-400 bg-red-500/10 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex gap-8">
          {/* 左侧管理员信息面板 */}
          <div className="w-1/4 space-y-6">
            {/* 管理员信息卡片 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              {!isEditing ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                        <img
                          src={
                            role === 'super_admin' 
                              ? '/icons/root.svg'
                              : role === 'admin'
                              ? '/icons/admins.svg' 
                              : '/icons/user.svg'
                          }
                          alt={`${role} avatar`}
                          className="w-10 h-10"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{adminInfo.name}</h2>
                        <span className="px-2 py-1 text-xs rounded-full" style={{
                          backgroundColor: role === 'super_admin' 
                            ? 'rgb(234 179 8)' 
                            : role === 'admin'
                            ? 'rgb(59 130 246)'
                            : 'rgb(99 102 241)',
                          color: 'white'
                        }}>
                          {role === 'super_admin' ? '超级管理员' : role === 'admin' ? '管理员' : '编辑'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsEditing(true)
                        setEditForm({
                          nickname: adminInfo.name,
                          username: adminInfo.username,
                          email: adminInfo.email,
                          password: ''
                        })
                      }}
                      className="px-3 py-1.5 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                    >
                      编辑信息
                    </button>
                  </div>
                  {/* 显示模式下的信息展示 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-400">邮箱：</span>
                      <span className="flex-1 text-right">{adminInfo.email || '未设置'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span className="text-gray-400">IP地址：</span>
                      <span className="flex-1 text-right">{adminInfo.ip}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-400">登录时间：</span>
                      <span className="flex-1 text-right">{adminInfo.loginTime}</span>
                    </div>
                  </div>
                </>
              ) : (
                // 编辑模式下的表单
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  try {
                    const res = await fetch('/api/admin/update-profile', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(editForm)
                    })
                    
                    if (!res.ok) throw new Error('更新失败')
                    
                    const data = await res.json()
                    setAdminInfo(prev => ({
                      ...prev,
                      name: data.nickname || data.username,
                      email: data.email
                    }))
                    setIsEditing(false)
                  } catch (error) {
                    console.error('更新个人信息失败:', error)
                    alert('更新失败，请重试')
                  }
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">昵称</label>
                    <input
                      type="text"
                      value={editForm.nickname}
                      onChange={(e) => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">用户名</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">邮箱</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">新密码 (留空表示不修改)</label>
                    <input
                      type="password"
                      value={editForm.password}
                      onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      保存
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 系统状态卡片 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                系统状态
              </h3>
              <div className="space-y-4">
                {/* CPU使用率 */}
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>CPU</span>
                    <span>{systemStats.cpuUsage}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${systemStats.cpuUsage}%` }}
                    />
                  </div>
                </div>
                
                {/* 内存使用率 */}
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>内存</span>
                    <span>{systemStats.memoryUsage}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${systemStats.memoryUsage}%` }}
                    />
                  </div>
                </div>
                
                {/* 磁盘使用率 */}
                {Array.isArray(systemStats.diskUsage) && systemStats.diskUsage.map((disk, index) => (
                  <div key={disk.name || disk.path}>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>{disk.name || disk.path} ({disk.type})</span>
                      <span>{disk.usagePercent}% ({disk.used}/{disk.total})</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${disk.usagePercent}%` }}
                      />
                    </div>
                    {index < systemStats.diskUsage.length - 1 && <div className="my-2" />}
                  </div>
                ))}
              </div>
            </div>

            {/* 系统信息卡片 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                系统信息
              </h3>
              <div className="space-y-3">
                <table className="w-full text-sm text-left text-gray-200">
                  <tbody>
                    <tr className="border-b border-gray-700/30">
                      <td className="py-2 font-medium text-gray-400 whitespace-nowrap w-24">实例名称</td>
                      <td className="py-2 pl-4">{systemStats.instanceName}</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="py-2 font-medium text-gray-400 whitespace-nowrap w-24">操作系统</td>
                      <td className="py-2 pl-4">{systemStats.os}</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="py-2 font-medium text-gray-400 whitespace-nowrap w-24">CPU配置</td>
                      <td className="py-2 pl-4 break-words">{systemStats.cpuConfig}</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="py-2 font-medium text-gray-400 whitespace-nowrap w-24">内存大小</td>
                      <td className="py-2 pl-4">{systemStats.memorySize}</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="py-2 font-medium text-gray-400 whitespace-nowrap w-24">系统盘</td>
                      <td className="py-2 pl-4">{systemStats.diskSize}</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="py-2 font-medium text-gray-400 whitespace-nowrap w-24">带宽</td>
                      <td className="py-2 pl-4">{systemStats.bandwidth}</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="py-2 font-medium text-gray-400 whitespace-nowrap w-24">地域</td>
                      <td className="py-2 pl-4">{systemStats.region}</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="py-2 font-medium text-gray-400 whitespace-nowrap w-24">系统状态</td>
                      <td className="py-2 pl-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          systemStats.systemStatus === 'normal' 
                            ? 'bg-green-500/20 text-green-400'
                            : systemStats.systemStatus === 'warning'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {systemStats.systemStatus === 'normal' ? '正常' : systemStats.systemStatus === 'warning' ? '警告' : '错误'}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="py-2 font-medium text-gray-400 whitespace-nowrap w-24">最后备份</td>
                      <td className="py-2 pl-4">{systemStats.lastBackupTime || '未备份'}</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="py-2 font-medium text-gray-400 whitespace-nowrap w-24">运行时间</td>
                      <td className="py-2 pl-4">{`${systemStats.runningDays}天${systemStats.runningHours}小时`}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-gray-400 whitespace-nowrap w-24">到期时间</td>
                      <td className="py-2 pl-4">{systemStats.expireDate}</td>
                    </tr>
                  </tbody>
                </table>

                {/* 添加心电图样式的系统状态指示器 */}
                <div className="w-full mt-4 p-4 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-300">系统运行状态</span>
                    </div>
                    <div className="flex-1 relative h-12 overflow-hidden">
                      <svg
                        className="heartbeat-line absolute top-0 left-full"
                        viewBox="0 0 300 100" 
                        preserveAspectRatio="none"
                      >
                        <path 
                          className="heartbeat-path"
                          d="M0,50 L30,50 L35,50 L40,44 L45,56 L50,40 L55,60 L60,50 L65,50 L70,50 L75,50 L80,20 L85,80 L90,20 L95,50 L100,50 L105,50 L300,50"
                          fill="none"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="text-green-500"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧内容区域 */}
          <div className="flex-1">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-8 mb-8 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-3">
                    管理控制台
                  </h1>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <span>欢迎回来：</span>
                      <span className="font-semibold text-white">{adminInfo.name}</span>
                    </div>
                    <span className="text-gray-500">|</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date().toLocaleDateString('zh-CN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        weekday: 'long' 
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 功能卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminCards.map((card) => {
                const isDisabled = !hasPermission(card.requiredRole)
                return (
                  <a
                    key={card.title}
                    href={isDisabled ? '#' : card.href}
                    onClick={(e) => {
                      if (isDisabled) {
                        e.preventDefault()
                      }
                    }}
                    className={`group relative bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 
                      overflow-hidden transition-all duration-300 p-6
                      ${isDisabled 
                        ? 'cursor-not-allowed opacity-60' 
                        : 'hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg'
                      }`}
                  >
                    <div className="flex items-start">
                      <div className={`p-3 rounded-lg mr-4 transition-colors ${
                        isDisabled 
                          ? 'bg-gray-500/10' 
                          : 'bg-white/10 group-hover:bg-white/20'
                      }`}>
                        <img
                          src={`/icons/${card.icon}.svg`}
                          alt={card.title}
                          className={`w-8 h-8 transition-transform group-hover:scale-110 ${
                            isDisabled ? 'opacity-50' : ''
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-2 transition-colors
                          ${isDisabled 
                            ? 'text-gray-400' 
                            : 'text-white group-hover:text-blue-400'
                          }`}
                        >
                          {card.title}
                          {isDisabled && (
                            <span className="ml-2 text-xs bg-gray-500/20 px-2 py-1 rounded-full">
                              无权限
                            </span>
                          )}
                        </h3>
                        
                        <p className={`text-sm mb-4 ${
                          isDisabled ? 'text-gray-500' : 'text-gray-300'
                        }`}>
                          {card.description}
                        </p>

                        <button 
                          className={`text-sm px-4 py-1.5 rounded-lg border transition-all
                            ${isDisabled 
                              ? 'bg-gray-500/10 border-gray-500/20 text-gray-400 cursor-not-allowed' 
                              : 'bg-white/10 border-white/20 hover:bg-white/20 hover:scale-105'
                            }`}
                          disabled={isDisabled}
                        >
                          {isDisabled ? '无权访问' : '进入管理'}
                        </button>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 