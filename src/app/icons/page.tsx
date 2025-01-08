'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Icon {
  name: string
  path: string
  category: string
}

export default function IconsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [copyStatus, setCopyStatus] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // 定义图标分类
  const categories = {
    all: '全部',
    programming: '编程语言',
    framework: '框架和库',
    browser: '浏览器',
    database: '数据库',
    os: '操作系统',
    editor: '编辑器',
    cloud: '云服务',
    social: '社交媒体',
    ui: '界面元素',
    security: '安全工具',
    car: '汽车服务',
    payment: '支付工具',
    logistics: '物流快递',
    music: '音乐平台',
    office: '办公文具',
    other: '其他',
    copyright: '版权相关',
    business: '商业服务',
    user: '用户相关'
  }

  // 为每个图标添加分类
  const icons: Icon[] = [
    // 编程语言
    { name: 'Python', path: '/icons/python.svg', category: 'programming' },
    { name: 'Java', path: '/icons/java.svg', category: 'programming' },
    { name: 'JavaScript', path: '/icons/javascript.svg', category: 'programming' },
    { name: 'TypeScript', path: '/icons/typescript.svg', category: 'programming' },
    { name: 'C', path: '/icons/c.svg', category: 'programming' },
    { name: 'C++', path: '/icons/cpp.svg', category: 'programming' },
    { name: 'C#', path: '/icons/csharp.svg', category: 'programming' },
    { name: 'Go', path: '/icons/go.svg', category: 'programming' },
    { name: 'Ruby', path: '/icons/ruby.svg', category: 'programming' },
    { name: 'Rust', path: '/icons/rust.svg', category: 'programming' },
    { name: 'Swift', path: '/icons/swift.svg', category: 'programming' },
    { name: 'PHP', path: '/icons/php.svg', category: 'programming' },
    { name: 'Kotlin', path: '/icons/kotlin.svg', category: 'programming' },
    { name: 'R', path: '/icons/r.svg', category: 'programming' },
    { name: 'Scala', path: '/icons/scala.svg', category: 'programming' },
    { name: 'Perl', path: '/icons/perl.svg', category: 'programming' },

    // 框架和库
    { name: 'React', path: '/icons/react.svg', category: 'framework' },
    { name: 'Vue', path: '/icons/vue.svg', category: 'framework' },
    { name: 'Angular', path: '/icons/angular.svg', category: 'framework' },
    { name: 'Node.js', path: '/icons/nodejs.svg', category: 'framework' },
    { name: 'Django', path: '/icons/django.svg', category: 'framework' },
    { name: 'Flask', path: '/icons/flask.svg', category: 'framework' },
    { name: 'Spring', path: '/icons/spring.svg', category: 'framework' },
    { name: '.NET', path: '/icons/net.svg', category: 'framework' },
    { name: 'Svelte', path: '/icons/svelte.svg', category: 'framework' },
    { name: 'jQuery', path: '/icons/jquery.svg', category: 'framework' },
    { name: 'Ember', path: '/icons/ember.svg', category: 'framework' },

    // 浏览器
    { name: 'Chrome', path: '/icons/chrome.svg', category: 'browser' },
    { name: 'Firefox', path: '/icons/Firefox.svg', category: 'browser' },
    { name: 'Safari', path: '/icons/safari.svg', category: 'browser' },
    { name: 'Edge', path: '/icons/edge.svg', category: 'browser' },
    { name: 'Opera', path: '/icons/opera.svg', category: 'browser' },
    { name: 'Browser', path: '/icons/browser.svg', category: 'browser' },

    // 数据库
    { name: 'MongoDB', path: '/icons/mongodb.svg', category: 'database' },
    { name: 'MySQL', path: '/icons/mysql.svg', category: 'database' },
    { name: 'PostgreSQL', path: '/icons/postgresql.svg', category: 'database' },
    { name: 'Redis', path: '/icons/redis.svg', category: 'database' },
    { name: 'SQLite', path: '/icons/sqlite.svg', category: 'database' },

    // 操作系统
    { name: 'Windows', path: '/icons/windows.svg', category: 'os' },
    { name: 'Linux', path: '/icons/linux.svg', category: 'os' },
    { name: 'Ubuntu', path: '/icons/ubuntu.svg', category: 'os' },
    { name: 'Mac', path: '/icons/mac.svg', category: 'os' },
    { name: 'Android', path: '/icons/android.svg', category: 'os' },
    { name: 'Kali', path: '/icons/kali.svg', category: 'os' },

    // 编辑器
    { name: 'Visual Studio Code', path: '/icons/vscode.svg', category: 'editor' },
    { name: 'Sublime Text', path: '/icons/sublime-text.svg', category: 'editor' },
    { name: 'JetBrains', path: '/icons/jetbrains.svg', category: 'editor' },
    { name: 'Eclipse', path: '/icons/eclipse.svg', category: 'editor' },
    { name: 'Atom', path: '/icons/atom.svg', category: 'editor' },

    // 云服务
    { name: 'AWS', path: '/icons/aws.svg', category: 'cloud' },
    { name: 'Azure', path: '/icons/azure.svg', category: 'cloud' },
    { name: 'Google Cloud', path: '/icons/google-cloud.svg', category: 'cloud' },

    // 社交媒体
    { name: 'GitHub', path: '/icons/github.svg', category: 'social' },
    { name: 'Facebook', path: '/icons/facebook.svg', category: 'social' },
    { name: 'Instagram', path: '/icons/instagram.svg', category: 'social' },
    { name: 'LinkedIn', path: '/icons/linkedIn.svg', category: 'social' },
    { name: 'X', path: '/icons/x.svg', category: 'social' },
    { name: 'QQ 1', path: '/icons/QQ-1.svg', category: 'social' },
    { name: 'QQ 2', path: '/icons/QQ-2.svg', category: 'social' },
    { name: 'QQ', path: '/icons/qq.svg', category: 'social' },
    { name: '微信 1', path: '/icons/微信-1.svg', category: 'social' },
    { name: '微信 2', path: '/icons/微信-2.svg', category: 'social' },
    { name: '微信 3', path: '/icons/微信-3.svg', category: 'social' },
    { name: '微信', path: '/icons/微信.svg', category: 'social' },
    { name: '抖音 1', path: '/icons/抖音-1.svg', category: 'social' },
    { name: '抖音 2', path: '/icons/抖音-2.svg', category: 'social' },
    { name: '快手', path: '/icons/快手.svg', category: 'social' },
    { name: 'Links', path: '/icons/Links.svg', category: 'social' },
    { name: 'Message Boards', path: '/icons/Message-boards.svg', category: 'social' },

    // 界面元素
    { name: 'Sun', path: '/icons/sun.svg', category: 'ui' },
    { name: 'Moon', path: '/icons/moon.svg', category: 'ui' },
    { name: 'Sun High', path: '/icons/sun-high.svg', category: 'ui' },
    { name: 'Sun Low', path: '/icons/sun-low.svg', category: 'ui' },
    { name: 'Sunrise', path: '/icons/sunrise.svg', category: 'ui' },
    { name: 'Sunset', path: '/icons/sunset.svg', category: 'ui' },
    { name: 'Brush', path: '/icons/brush.svg', category: 'ui' },
    { name: 'Download', path: '/icons/download.svg', category: 'ui' },
    { name: 'Link', path: '/icons/link.svg', category: 'ui' },
    { name: 'Return', path: '/icons/return.svg', category: 'ui' },
    { name: '全部', path: '/icons/全部.svg', category: 'ui' },
    { name: '关闭', path: '/icons/关闭.svg', category: 'ui' },
    { name: '消息', path: '/icons/消息.svg', category: 'ui' },
    { name: '设置', path: '/icons/设置.svg', category: 'ui' },
    { name: '首页', path: '/icons/首页.svg', category: 'ui' },
    { name: 'Extract', path: '/icons/extract.svg', category: 'ui' },
    { name: 'Cog', path: '/icons/cog.svg', category: 'ui' },
    { name: 'Flushed', path: '/icons/flushed.svg', category: 'ui' },
    { name: 'Stats', path: '/icons/stats.svg', category: 'ui' },
    { name: 'Notification', path: '/icons/notification.svg', category: 'ui' },
    { name: 'Search', path: '/icons/search.svg', category: 'ui' },
    { name: 'Theme', path: '/icons/theme.svg', category: 'ui' },

    // 安全工具
    { name: 'VPN', path: '/icons/vpn.svg', category: 'security' },
    { name: 'Firewall', path: '/icons/firewall.svg', category: 'security' },
    { name: 'Encryption', path: '/icons/encryption.svg', category: 'security' },
    { name: 'Password', path: '/icons/password.svg', category: 'security' },
    { name: 'Hacker', path: '/icons/hacker.svg', category: 'security' },

    // 其他
    { name: 'Admin', path: '/icons/admin.svg', category: 'user' },
    { name: 'Admins', path: '/icons/admins.svg', category: 'user' },
    { name: 'AI', path: '/icons/ai.svg', category: 'other' },
    { name: 'Article', path: '/icons/article.svg', category: 'other' },
    { name: 'Chat', path: '/icons/chat.svg', category: 'other' },
    { name: 'Chat Room', path: '/icons/chat-room.svg', category: 'other' },
    { name: 'Computer', path: '/icons/computer.svg', category: 'other' },
    { name: 'Email', path: '/icons/email.svg', category: 'other' },
    { name: 'Feedback', path: '/icons/feedback.svg', category: 'other' },
    { name: 'Git', path: '/icons/git.svg', category: 'other' },
    { name: 'Internet', path: '/icons/internet.svg', category: 'other' },
    { name: 'JNGK', path: '/icons/jngk.svg', category: 'other' },
    { name: 'JSON', path: '/icons/json.svg', category: 'other' },
    { name: 'Mail', path: '/icons/mail.svg', category: 'other' },
    { name: 'Message', path: '/icons/message.svg', category: 'other' },
    { name: 'Opening', path: '/icons/opening.svg', category: 'other' },
    { name: 'Pigeonhole', path: '/icons/pigeonhole.svg', category: 'other' },
    { name: 'Record', path: '/icons/Record.svg', category: 'other' },
    { name: 'Resource', path: '/icons/resource.svg', category: 'other' },
    { name: 'Root', path: '/icons/root.svg', category: 'user' },
    { name: 'Statistics', path: '/icons/Statistics.svg', category: 'other' },
    { name: 'Talk', path: '/icons/talk.svg', category: 'other' },
    { name: 'Technical Articles', path: '/icons/Technical-Articles.svg', category: 'other' },
    { name: 'Terminal', path: '/icons/terminal.svg', category: 'other' },
    { name: 'Toolbox', path: '/icons/toolbox.svg', category: 'other' },
    { name: 'User', path: '/icons/user.svg', category: 'user' },
    { name: 'Username', path: '/icons/Username.svg', category: 'user' },
    { name: 'Iconfont 1', path: '/icons/iconfont-1.svg', category: 'other' },
    { name: 'Iconfont 2', path: '/icons/iconfont-2.svg', category: 'other' },
    { name: 'Iconfont 3', path: '/icons/Iconfont-3.svg', category: 'other' },
    { name: 'Iconfont 4', path: '/icons/Iconfont-4.svg', category: 'other' },
    { name: 'Iconfont 5', path: '/icons/iconfont-5.svg', category: 'other' },
    { name: 'Iconfont 6', path: '/icons/iconfont-6.svg', category: 'other' },
    { name: 'Iconfont Icon1', path: '/icons/iconfont-icon1.svg', category: 'other' },
    { name: 'Iconfont Icon2', path: '/icons/iconfont-icon2.svg', category: 'other' },
    { name: 'Iconfont Icon3', path: '/icons/iconfont-icon3.svg', category: 'other' },
    { name: 'Iconfont Icon4', path: '/icons/iconfont-icon4.svg', category: 'other' },
    { name: 'Iconfont Iconqq', path: '/icons/iconfont-iconqq.svg', category: 'other' },
    { name: 'Iconfont Info', path: '/icons/iconfont-info.svg', category: 'other' },
    { name: 'Iconfont Phone', path: '/icons/iconfont-phone.svg', category: 'other' },
    { name: 'Iconfont', path: '/icons/iconfont.svg', category: 'other' },
    { name: 'API', path: '/icons/API.svg', category: 'other' },
    { name: 'Beian', path: '/icons/beian.svg', category: 'other' },
    { name: 'Concerning', path: '/icons/concerning.svg', category: 'other' },

    // 汽车服务
    { name: '买车险', path: '/icons/买车险.svg', category: 'car' },
    { name: '保养手册', path: '/icons/保养手册.svg', category: 'car' },
    { name: '做保养', path: '/icons/做保养.svg', category: 'car' },
    { name: '发现好车', path: '/icons/发现好车.svg', category: 'car' },
    { name: '年检代办', path: '/icons/年检代办.svg', category: 'car' },
    { name: '换轮胎', path: '/icons/换轮胎.svg', category: 'car' },
    { name: '新车必备', path: '/icons/新车必备.svg', category: 'car' },
    { name: '新车报价', path: '/icons/新车报价.svg', category: 'car' },
    { name: '查违章', path: '/icons/查违章.svg', category: 'car' },
    { name: '油卡充值', path: '/icons/油卡充值.svg', category: 'car' },
    { name: '爱车估价', path: '/icons/爱车估价.svg', category: 'car' },
    { name: '维修', path: '/icons/维修.svg', category: 'car' },
    { name: '自助洗车', path: '/icons/自助洗车.svg', category: 'car' },
    { name: '金融买车', path: '/icons/金融买车.svg', category: 'car' },
    { name: '驾照查分', path: '/icons/驾照查分.svg', category: 'car' },
    { name: '罚款代缴', path: '/icons/罚款代缴.svg', category: 'car' },

    // 物流快递
    { name: '中通 1', path: '/icons/中通-1.svg', category: 'logistics' },
    { name: '中通 2', path: '/icons/中通-2.svg', category: 'logistics' },
    { name: '申通 1', path: '/icons/申通-1.svg', category: 'logistics' },
    { name: '顺丰 1', path: '/icons/顺丰-1.svg', category: 'logistics' },
    { name: '顺丰 2', path: '/icons/顺丰-2.svg', category: 'logistics' },
    { name: '快递', path: '/icons/快递.svg', category: 'logistics' },

    // 音乐平台
    { name: 'QQ音乐 1', path: '/icons/QQ音乐-1.svg', category: 'music' },
    { name: 'QQ音乐 2', path: '/icons/QQ音乐-2.svg', category: 'music' },
    { name: '网易云音乐 1', path: '/icons/网易云音乐-1.svg', category: 'music' },
    { name: '网易云音乐 2', path: '/icons/网易云音乐-2.svg', category: 'music' },
    { name: '酷狗音乐 1', path: '/icons/酷狗音乐-1.svg', category: 'music' },
    { name: '酷狗音乐 2', path: '/icons/酷狗音乐-2.svg', category: 'music' },

    // 办公文具
    { name: '剪刀', path: '/icons/剪刀.svg', category: 'office' },
    { name: '单位', path: '/icons/单位.svg', category: 'office' },
    { name: '印章', path: '/icons/印章.svg', category: 'office' },
    { name: '圆规', path: '/icons/圆规.svg', category: 'office' },
    { name: '夹子', path: '/icons/夹子.svg', category: 'office' },
    { name: '尺子', path: '/icons/尺子.svg', category: 'office' },
    { name: '胶带', path: '/icons/胶带.svg', category: 'office' },
    { name: '画板', path: '/icons/画板.svg', category: 'office' },
    { name: 'U盘', path: '/icons/U盘.svg', category: 'office' },
    { name: '光盘', path: '/icons/光盘.svg', category: 'office' },

    // 版权相关
    { name: '版权', path: '/icons/版权.svg', category: 'copyright' },
    { name: '版权保护', path: '/icons/版权保护.svg', category: 'copyright' },
    { name: '版权服务', path: '/icons/版权服务.svg', category: 'copyright' },

    // 支付工具
    { name: '京东 1', path: '/icons/京东-1.svg', category: 'payment' },
    { name: '京东 2', path: '/icons/京东-2.svg', category: 'payment' },
    { name: '京东 3', path: '/icons/京东-3.svg', category: 'payment' },
    { name: '购买', path: '/icons/购买.svg', category: 'payment' },

    // 商业服务
    { name: '义乌恒风项目', path: '/icons/义乌恒风项目.svg', category: 'business' },
    { name: '专家答疑', path: '/icons/专家答疑.svg', category: 'business' },
    { name: '门店', path: '/icons/门店.svg', category: 'business' },
    { name: '直播买车', path: '/icons/直播买车.svg', category: 'business' },

    // 用户相关
    { name: '个人中心', path: '/icons/个人中心.svg', category: 'user' },
    { name: '我的', path: '/icons/我的.svg', category: 'user' },
    { name: '我的砍价', path: '/icons/我的砍价.svg', category: 'user' },
    { name: '权益中心', path: '/icons/权益中心.svg', category: 'user' },
    { name: '用户反馈', path: '/icons/用户反馈.svg', category: 'user' },

    // 在 UI 元素类别中添加新图标
    { name: 'Document', path: '/icons/document.svg', category: 'ui' },
    { name: 'Chart', path: '/icons/chart.svg', category: 'ui' },
    { name: 'Calendar', path: '/icons/calendar.svg', category: 'ui' },
    { name: 'Settings Gear', path: '/icons/settings-gear.svg', category: 'ui' }
  ]

  // 处理图标下载
  const handleDownload = async (icon: Icon) => {
    try {
      const response = await fetch(icon.path)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${icon.name}.svg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('下载失败:', error)
    }
  }

  // 复制 SVG 内容
  const handleCopy = async (icon: Icon) => {
    try {
      const response = await fetch(icon.path)
      const text = await response.text()
      await navigator.clipboard.writeText(text)
      setCopyStatus(`已复制 ${icon.name}`)
      setTimeout(() => setCopyStatus(''), 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  // 过滤图标
  const filteredIcons = icons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">图标下载</h1>
      
      {/* 分类选择器 */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 rounded-full text-sm transition-colors duration-200
              ${selectedCategory === key 
                ? 'bg-violet-500 text-white' 
                : 'bg-white/10 hover:bg-white/20'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 搜索框和统计信息 */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="搜索图标..."
          className="w-full max-w-md mx-auto block px-4 py-2 rounded-lg 
            bg-white/10 backdrop-blur-sm border border-white/20
            focus:outline-none focus:ring-2 focus:ring-violet-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <p className="text-center text-gray-400 mt-4">
          共 {icons.length} 个图标
          {searchTerm && ` • 找到 ${filteredIcons.length} 个结果`}
          {selectedCategory !== 'all' && ` • ${categories[selectedCategory]}`}
        </p>
      </div>

      {/* 图标网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredIcons.map((icon) => (
          <motion.div
            key={icon.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group p-4 rounded-lg 
              bg-white/5 backdrop-blur-sm border border-white/10
              hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex flex-col items-center space-y-2">
              <img src={icon.path} alt={icon.name} className="w-12 h-12 mb-2" />
              <span className="text-sm text-center">{icon.name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(icon)}
                  className="p-2 rounded-lg bg-violet-500/80 hover:bg-violet-600/80
                    text-white text-sm transition-colors duration-200"
                >
                  下载
                </button>
                <button
                  onClick={() => handleCopy(icon)}
                  className="p-2 rounded-lg bg-blue-500/80 hover:bg-blue-600/80
                    text-white text-sm transition-colors duration-200"
                >
                  复制
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 复制状态提示 */}
      {copyStatus && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg">
          {copyStatus}
        </div>
      )}
    </div>
  )
} 