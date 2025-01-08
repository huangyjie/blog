import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import os from 'os'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'app_download_center'
}

// 获取 CPU 使用率
function getCpuUsage() {
  const cpus = os.cpus()
  let totalIdle = 0
  let totalTick = 0

  cpus.forEach(cpu => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times]
    }
    totalIdle += cpu.times.idle
  })

  return Math.floor((1 - totalIdle / totalTick) * 100)
}

// 获取内存使用情况
function getMemoryUsage() {
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  return Math.floor(((totalMem - freeMem) / totalMem) * 100)
}

// 获取系统信息
function getSystemInfo() {
  const totalMem = os.totalmem()
  const cpus = os.cpus()
  
  return {
    cpuModel: cpus[0].model,
    memTotal: `${Math.floor(totalMem / (1024 * 1024 * 1024))}GB`,
    osVersion: `${os.type()} ${os.release()}`,
    platform: os.platform(),
    arch: os.arch()
  }
}

// 添加固定的系统启动时间
const SYSTEM_START_TIME = new Date('2024-12-13T00:00:00')

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig)

    // 获取数据库统计数据
    const [articleRows] = await connection.execute('SELECT COUNT(*) as count FROM articles WHERE is_visible = 1')
    const [appRows] = await connection.execute('SELECT COUNT(*) as count FROM apps WHERE is_hidden = 0')
    const [messageRows] = await connection.execute('SELECT COUNT(*) as count FROM messages WHERE is_hidden = 0')
    const [downloadRows] = await connection.execute('SELECT SUM(download_count) as total FROM apps')

    // 获取系统信息
    const sysInfo = getSystemInfo()
    const cpuUsage = getCpuUsage()
    const memoryUsage = getMemoryUsage()

    // 使用固定的启动时间计算运行时间
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - SYSTEM_START_TIME.getTime())
    const runningDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const runningHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    await connection.end()

    // 计算磁盘使用率（Windows 和 Linux 通用方式）
    const diskUsage = 65 // 固定值，因为 Node.js 没有直接获取磁盘使用率的方法

    return NextResponse.json({
      // 统计数据
      totalArticles: (articleRows as any)[0].count,
      totalApps: (appRows as any)[0].count,
      totalMessages: (messageRows as any)[0].count,
      totalDownloads: (downloadRows as any)[0].total || 0,
      
      // 系统信息
      instanceName: os.hostname(),
      os: sysInfo.osVersion,
      cpuConfig: sysInfo.cpuModel,
      memorySize: sysInfo.memTotal,
      diskSize: '系统盘 C:',
      bandwidth: '4Mbps',
      region: process.env.SERVER_REGION || '成都一区',
      expireDate: process.env.SERVER_EXPIRE_DATE || '2025-10-12',
      runningDays,
      runningHours,
      lastBackupTime: '未备份',
      
      // 系统状态
      systemStatus: cpuUsage > 80 || memoryUsage > 90 ? 'warning' : 'normal',
      cpuUsage,
      memoryUsage,
      diskUsage,

      // 额外的系统信息
      platform: sysInfo.platform,
      arch: sysInfo.arch,
      uptime: os.uptime(),
      networkInterfaces: os.networkInterfaces()
    })

  } catch (error) {
    console.error('获取系统状态失败:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 