'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import type { AdminRole } from '@/types/admin'

export default function Sidebar() {
  const pathname = usePathname()
  const { role } = useAdminAuth()

  // 定义每个路径需要的权限
  const pathPermissions: Record<string, AdminRole> = {
    '/admin/administrators': 'super_admin',
    '/admin/statistics': 'admin',
    '/admin/articles': 'admin',
    '/admin/resources': 'admin',
    '/admin/announcements': 'admin',
    '/admin/friends': 'admin',
    '/admin/chatrooms': 'editor',
    '/admin/messages': 'editor',
    '/admin/feedback': 'editor',
    '/admin/talks': 'admin'
  }

  // 权限检查函数
  const hasPermission = (path: string) => {
    const requiredRole = pathPermissions[path]
    if (!requiredRole) return true
    if (!role) return false

    const roleHierarchy: Record<AdminRole, number> = {
      super_admin: 3,
      admin: 2,
      editor: 1
    }

    return roleHierarchy[role] >= roleHierarchy[requiredRole]
  }

  const handleNavigation = (path: string) => {
    if (!hasPermission(path)) {
      alert('您没有权限访问此功能')
      return
    }
    window.location.href = path
  }

  return (
    <motion.div 
      className="w-64 bg-white/10 backdrop-blur-sm h-screen fixed left-0 top-0 p-4 border-r border-white/20"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4 mb-20 overflow-y-auto h-[calc(100%-5rem)]">
        <motion.button
          onClick={() => handleNavigation('/admin')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
            pathname === '/admin' ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="font-medium">控制台</span>
        </motion.button>

        <motion.button
          onClick={() => handleNavigation('/admin/statistics')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
            pathname === '/admin/statistics' ? 'bg-white/20' : 'hover:bg-white/10'
          } ${!hasPermission('/admin/statistics') ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`}
          whileHover={hasPermission('/admin/statistics') ? { scale: 1.02 } : {}}
          whileTap={hasPermission('/admin/statistics') ? { scale: 0.98 } : {}}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="font-medium">
            数据统计
            {!hasPermission('/admin/statistics') && (
              <span className="ml-2 text-xs bg-gray-500/20 px-2 py-1 rounded-full">
                无权限
              </span>
            )}
          </span>
        </motion.button>

        <motion.button
          onClick={() => handleNavigation('/admin/resources')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
            pathname === '/admin/resources' ? 'bg-white/20' : 'hover:bg-white/10'
          } ${!hasPermission('/admin/resources') ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`}
          whileHover={hasPermission('/admin/resources') ? { scale: 1.02 } : {}}
          whileTap={hasPermission('/admin/resources') ? { scale: 0.98 } : {}}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="font-medium">
            资源管理
            {!hasPermission('/admin/resources') && (
              <span className="ml-2 text-xs bg-gray-500/20 px-2 py-1 rounded-full">
                无权限
              </span>
            )}
          </span>
        </motion.button>

        <motion.button
          onClick={() => handleNavigation('/admin/announcements')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
            pathname === '/admin/announcements' ? 'bg-white/20' : 'hover:bg-white/10'
          } ${!hasPermission('/admin/announcements') ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`}
          whileHover={hasPermission('/admin/announcements') ? { scale: 1.02 } : {}}
          whileTap={hasPermission('/admin/announcements') ? { scale: 0.98 } : {}}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <span className="font-medium">
            公告管理
            {!hasPermission('/admin/announcements') && (
              <span className="ml-2 text-xs bg-gray-500/20 px-2 py-1 rounded-full">
                无权限
              </span>
            )}
          </span>
        </motion.button>

        <motion.button
          onClick={() => handleNavigation('/admin/articles')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
            pathname === '/admin/articles' ? 'bg-white/20' : 'hover:bg-white/10'
          } ${!hasPermission('/admin/articles') ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`}
          whileHover={hasPermission('/admin/articles') ? { scale: 1.02 } : {}}
          whileTap={hasPermission('/admin/articles') ? { scale: 0.98 } : {}}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" />
          </svg>
          <span className="font-medium">
            文章管理
            {!hasPermission('/admin/articles') && (
              <span className="ml-2 text-xs bg-gray-500/20 px-2 py-1 rounded-full">
                无权限
              </span>
            )}
          </span>
        </motion.button>

        <motion.button
          onClick={() => handleNavigation('/admin/chatrooms')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
            pathname === '/admin/chatrooms' ? 'bg-white/20' : 'hover:bg-white/10'
          } ${!hasPermission('/admin/chatrooms') ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`}
          whileHover={hasPermission('/admin/chatrooms') ? { scale: 1.02 } : {}}
          whileTap={hasPermission('/admin/chatrooms') ? { scale: 0.98 } : {}}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <span className="font-medium">
            聊天室管理
            {!hasPermission('/admin/chatrooms') && (
              <span className="ml-2 text-xs bg-gray-500/20 px-2 py-1 rounded-full">
                无权限
              </span>
            )}
          </span>
        </motion.button>

        <motion.button
          onClick={() => handleNavigation('/admin/messages')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
            pathname === '/admin/messages' ? 'bg-white/20' : 'hover:bg-white/10'
          } ${!hasPermission('/admin/messages') ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`}
          whileHover={hasPermission('/admin/messages') ? { scale: 1.02 } : {}}
          whileTap={hasPermission('/admin/messages') ? { scale: 0.98 } : {}}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="font-medium">
            留言管理
            {!hasPermission('/admin/messages') && (
              <span className="ml-2 text-xs bg-gray-500/20 px-2 py-1 rounded-full">
                无权限
              </span>
            )}
          </span>
        </motion.button>

        <motion.button
          onClick={() => handleNavigation('/admin/friends')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
            pathname === '/admin/friends' ? 'bg-white/20' : 'hover:bg-white/10'
          } ${!hasPermission('/admin/friends') ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`}
          whileHover={hasPermission('/admin/friends') ? { scale: 1.02 } : {}}
          whileTap={hasPermission('/admin/friends') ? { scale: 0.98 } : {}}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="font-medium">
            友链管理
            {!hasPermission('/admin/friends') && (
              <span className="ml-2 text-xs bg-gray-500/20 px-2 py-1 rounded-full">
                无权限
              </span>
            )}
          </span>
        </motion.button>

        <motion.button
          onClick={() => handleNavigation('/admin/feedback')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
            pathname === '/admin/feedback' ? 'bg-white/20' : 'hover:bg-white/10'
          } ${!hasPermission('/admin/feedback') ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`}
          whileHover={hasPermission('/admin/feedback') ? { scale: 1.02 } : {}}
          whileTap={hasPermission('/admin/feedback') ? { scale: 0.98 } : {}}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span className="font-medium">
            反馈管理
            {!hasPermission('/admin/feedback') && (
              <span className="ml-2 text-xs bg-gray-500/20 px-2 py-1 rounded-full">
                无权限
              </span>
            )}
          </span>
        </motion.button>

        <motion.button
          onClick={() => handleNavigation('/admin/talks')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
            pathname === '/admin/talks' ? 'bg-white/20' : 'hover:bg-white/10'
          } ${!hasPermission('/admin/talks') ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`}
          whileHover={hasPermission('/admin/talks') ? { scale: 1.02 } : {}}
          whileTap={hasPermission('/admin/talks') ? { scale: 0.98 } : {}}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium">
            说说管理
            {!hasPermission('/admin/talks') && (
              <span className="ml-2 text-xs bg-gray-500/20 px-2 py-1 rounded-full">
                无权限
              </span>
            )}
          </span>
        </motion.button>

        <motion.button
          onClick={() => handleNavigation('/admin/administrators')}
          className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
            pathname === '/admin/administrators' ? 'bg-white/20' : 'hover:bg-white/10'
          } ${!hasPermission('/admin/administrators') ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`}
          whileHover={hasPermission('/admin/administrators') ? { scale: 1.02 } : {}}
          whileTap={hasPermission('/admin/administrators') ? { scale: 0.98 } : {}}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="font-medium">
            管理员设置
            {!hasPermission('/admin/administrators') && (
              <span className="ml-2 text-xs bg-gray-500/20 px-2 py-1 rounded-full">
                无权限
              </span>
            )}
          </span>
        </motion.button>
      </div>

      <motion.button
        onClick={async () => {
          await fetch('/api/admin/logout', { method: 'POST' })
          window.location.href = '/admin/login'
        }}
        className="absolute bottom-4 left-4 right-4 flex items-center w-[calc(100%-2rem)] px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-red-500"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="font-medium">退出登录</span>
      </motion.button>
    </motion.div>
  )
} 