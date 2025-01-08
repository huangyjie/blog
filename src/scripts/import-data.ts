import { db } from '@/lib/db'
import fs from 'fs'
import path from 'path'

async function importData() {
  try {
    // 创建默认分类
    const categories = [
      ['开发工具 IDE', '各类集成开发环境'],
      ['运行环境', '各种编程语言的运行环境'],
      ['服务器工具', '服务器管理和部署工具'],
      ['数据库工具', '数据库管理和操作工具'],
      ['浏览器', '网页浏览器'],
      ['办公软件', '日常办公软件'],
      ['系统工具', '系统维护和管理工具']
    ]

    // 插入分类
    for (const [name, description] of categories) {
      await db.query(
        'INSERT INTO app_categories (category_name, category_description) VALUES (?, ?)',
        [name, description]
      )
    }

    // 读取文本文档中的数据
    const dataPath = path.join(process.cwd(), 'article/DownloadSite/新建 文本文档.txt')
    const fileContent = fs.readFileSync(dataPath, 'utf8')
    const lines = fileContent.split('\n').filter(line => line.trim())

    // 插入应用数据
    for (const line of lines) {
      const [name, url] = line.split('\t').map(s => s.trim())
      if (!name || !url) continue

      // 根据应用名称判断分类
      let categoryId = 1 // 默认为开发工具
      if (name.includes('Python') || name.includes('Node') || name.includes('JDK') || name.includes('JRE') || name.includes('Mingw')) {
        categoryId = 2 // 运行环境
      } else if (name.includes('宝塔') || name.includes('小皮')) {
        categoryId = 3 // 服务器工具
      } else if (name.includes('Navicat') || name.includes('Datagrip')) {
        categoryId = 4 // 数据库工具
      } else if (name.includes('浏览器') || name.includes('Chrome')) {
        categoryId = 5 // 浏览器
      } else if (name.includes('Office') || name.includes('Notepad++')) {
        categoryId = 6 // 办公软件
      } else if (name.includes('VM') || name.includes('Geek') || name.includes('bindizip')) {
        categoryId = 7 // 系统工具
      }

      await db.query(
        'INSERT INTO apps (category_id, app_name, app_description, download_url) VALUES (?, ?, ?, ?)',
        [categoryId, name, '', url]
      )
    }

    console.log('数据导入成功！')
    process.exit(0)
  } catch (error) {
    console.error('数据导入失败:', error)
    process.exit(1)
  }
}

importData() 