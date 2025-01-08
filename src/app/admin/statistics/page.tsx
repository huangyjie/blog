'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { AnimatedNumber } from '@/components/ui/animated-number'

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalApps: 0,
    totalMessages: 0,
    totalFriends: 0,
    totalAnnouncements: 0,
    totalDownloads: 0,
    totalFeedback: 0,
    totalTalks: 0,
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
  })

  // 获取所有统计数据的函数
  const fetchAllStats = async () => {
    try {
      // 获取系统状态
      const systemRes = await fetch('/api/admin/system-stats')
      if (!systemRes.ok) throw new Error('获取系统状态失败')
      const systemData = await systemRes.json()

      // 获取各种统计数据
      const endpoints = [
        'articles',
        'apps',
        'messages',
        'friends',
        'announcements',
        'downloads',
        'feedback',
        'talks'
      ]

      const results = await Promise.all(
        endpoints.map(endpoint => 
          fetch(`/api/admin/${endpoint}/count`)
            .then(res => res.json())
            .then(data => ({ [`total${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`]: data.count }))
            .catch(() => ({ [`total${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`]: 0 }))
        )
      )

      const countsData = results.reduce((acc, curr) => ({ ...acc, ...curr }), {})

      setStats(prev => ({
        ...prev,
        ...systemData,
        ...countsData
      }))
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  useEffect(() => {
    fetchAllStats()
    const timer = setInterval(fetchAllStats, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-8 mb-8 border border-white/10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-3">
            数据统计
          </h1>
          <p className="text-gray-300">
            实时查看系统各项数据统计信息
          </p>
        </div>

        {/* 系统状态卡片 */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
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
                <span>{stats.cpuUsage}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.cpuUsage}%` }}
                />
              </div>
            </div>
            
            {/* 内存使用率 */}
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>内存</span>
                <span>{stats.memoryUsage}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.memoryUsage}%` }}
                />
              </div>
            </div>
            
            {/* 磁盘使用率 */}
            {Array.isArray(stats.diskUsage) && stats.diskUsage.map((disk, index) => (
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
                {index < stats.diskUsage.length - 1 && <div className="my-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* 数据统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-blue-400">
              <AnimatedNumber value={stats.totalArticles} />
            </div>
            <div className="text-sm text-gray-400 mt-2">文章总数</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-purple-400">
              <AnimatedNumber value={stats.totalApps} />
            </div>
            <div className="text-sm text-gray-400 mt-2">应用总数</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-green-400">
              <AnimatedNumber value={stats.totalFriends} />
            </div>
            <div className="text-sm text-gray-400 mt-2">友链总数</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-yellow-400">
              <AnimatedNumber value={stats.totalDownloads} />
            </div>
            <div className="text-sm text-gray-400 mt-2">下载量</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-orange-400">
              <AnimatedNumber value={stats.totalAnnouncements} />
            </div>
            <div className="text-sm text-gray-400 mt-2">公告总数</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-pink-400">
              <AnimatedNumber value={stats.totalMessages} />
            </div>
            <div className="text-sm text-gray-400 mt-2">留言总数</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-indigo-400">
              <AnimatedNumber value={stats.totalFeedback} />
            </div>
            <div className="text-sm text-gray-400 mt-2">反馈总数</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-cyan-400">
              <AnimatedNumber value={stats.totalTalks} />
            </div>
            <div className="text-sm text-gray-400 mt-2">说说总数</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}