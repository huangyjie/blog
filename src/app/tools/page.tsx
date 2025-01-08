'use client'

import { RandomBackground } from '@/components/ui/random-background'
import { useState, useMemo, useEffect } from 'react'
import { pinyin } from 'pinyin-pro'

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

interface Tool {
  name: string
  description: string
  icon: string
  href: string
  status: 'available' | 'coming' | 'maintenance'
  category: string
}

const categories = [
  '文本处理',
  '编码转换',
  '图片处理',
  '开发工具',
  '实用工具',
  '其他'
] as const

export const tools: Tool[] = [
  {
    name: '二维码生成器',
    description: '生成自定义文本、链接的二维码',
    icon: '🔲',
    href: '/tools/qrcode',
    status: 'available',
    category: '编码转换'
  },
  {
    name: '时间戳转换',
    description: '时间戳与日期格式互转',
    icon: '⏰',
    href: '/tools/timestamp',
    status: 'available',
    category: '文本处理'
  },
  {
    name: '图片压缩',
    description: '在线压缩图片文件大小',
    icon: '🖼️',
    href: '/tools/image-compress',
    status: 'available',
    category: '图片处理'
  },
  {
    name: '格式转换',
    description: '常用文件格式在线转换',
    icon: '🔄',
    href: '/tools/converter',
    status: 'available',
    category: '编码转换'
  },
  {
    name: 'IP地址查询',
    description: 'IP地址物理位置查询',
    icon: '🌍',
    href: '/tools/ip-lookup',
    status: 'available',
    category: '文本处理'
  },
  {
    name: '中英互译',
    description: '在线中英互译',
    icon: '🔤',
    href: '/tools/translator',
    status: 'available',
    category: '文本处理'
  },
  {
    name: '字数统计',
    description: '文本字数和字符统计',
    icon: '📝',
    href: '/tools/word-counter',
    status: 'available',
    category: '文本处理'
  },
  {
    name: '随机密码',
    description: '生成安全的随机密码',
    icon: '🔑',
    href: '/tools/password-generator',
    status: 'available',
    category: '编码转换'
  },
  {
    name: '颜色转换',
    description: 'RGB/HEX颜色互转',
    icon: '🎨',
    href: '/tools/color-converter',
    status: 'available',
    category: '编码转换'
  },
  {
    name: '单位换算',
    description: '常用单位在线换算',
    icon: '📏',
    href: '/tools/unit-converter',
    status: 'available',
    category: '编码转换'
  },
  {
    name: 'JSON格式化',
    description: 'JSON美化和压缩',
    icon: '📋',
    href: '/tools/json-formatter',
    status: 'available',
    category: '编码转换'
  },
  {
    name: 'Base64转换',
    description: '文本/图片Base64编解码',
    icon: '🔄',
    href: '/tools/base64',
    status: 'available',
    category: '编码转换'
  },
  {
    name: 'Markdown预览',
    description: 'Markdown实时预览',
    icon: '📝',
    href: '/tools/markdown',
    status: 'available',
    category: '文本处理'
  },
  {
    name: '正则测试',
    description: '正则表达式在线测试',
    icon: '🔍',
    href: '/tools/regex-tester',
    status: 'available',
    category: '编码转换'
  },
  {
    name: '计算器',
    description: '科学计算器',
    icon: '🧮',
    href: '/tools/calculator',
    status: 'available',
    category: '编码转换'
  },
  {
    name: '文本对比',
    description: '文本差异对比工具',
    icon: '🔍',
    href: '/tools/text-diff',
    status: 'available',
    category: '文本处理'
  },
  {
    name: 'URL编解码',
    description: 'URL编码/解码工具',
    icon: '🔗',
    href: '/tools/url-codec',
    status: 'available',
    category: '编码转换'
  },
  {
    name: '在线记事本',
    description: '临时文本存储和分享',
    icon: '📝',
    href: '/tools/notepad',
    status: 'available',
    category: '文本处理'
  },
  {
    name: "蓝奏云解析",
    description: "解析蓝奏云分享链接，获取直接下载地址",
    icon: "🔗",
    href: "/tools/lanzou",
    status: "available",
    category: '编码转换'
  },
  {
    name: '音频转换',
    description: '在线音频格式转换',
    icon: '🎵',
    href: '/tools/audio-converter',
    status: 'available',
    category: '编码转换'
  },
  {
    name: '代码格式化',
    description: '支持多语言代码格式化',
    icon: '📝',
    href: '/tools/code-formatter',
    status: 'available',
    category: '编码转换'
  },
  {
    name: '文本哈希',
    description: 'MD5/SHA1/SHA256计算',
    icon: '🔒',
    href: '/tools/file-hash',
    status: 'available',
    category: '编码转换'
  },
  {
    name: '短链生成',
    description: '生成短网址链接',
    icon: '🔗',
    href: '/tools/url-shortener', 
    status: 'available',
    category: '编码转换'
  },
  {
    name: '文本加密',
    description: '文本加密/解密工具',
    icon: '🔐',
    href: '/tools/text-crypto',
    status: 'available',
    category: '编码转换'
  },
  {
    name: '文本去重',
    description: '文本内容去重工具',
    icon: '📋',
    href: '/tools/text-dedup',
    status: 'available',
    category: '文本处理'
  },
  {
    name: '文本排序',
    description: '文本行排序工具',
    icon: '📊',
    href: '/tools/text-sort',
    status: 'available',
    category: '文本处理'
  },
  {
    name: '进制转换',
    description: '任意进制数转换',
    icon: '🔢',
    href: '/tools/radix-converter',
    status: 'available',
    category: '编码转换'
  },
  {
    name: '颜色提取器',
    description: '从屏幕提取颜色并进行选择',
    icon: '🎨',
    href: '/tools/color-picker',
    status: 'available',
    category: '图片处理'
  },
  {
    name: "条形码生成器",
    description: "生成各种格式的条形码,支持多种编码标准",
    icon: "barcode",
    href: "/tools/barcode",
    status: "available",
    category: '编码转换'
  }
]

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')

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

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const searchLower = searchQuery.toLowerCase()
      
      // 名称或描述包含搜索词
      const textMatch = tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower)
      
      // 转换为拼音后匹配
      const pinyinName = pinyin(tool.name, { toneType: 'none', type: 'array' }).join('')
      const pinyinDesc = pinyin(tool.description, { toneType: 'none', type: 'array' }).join('')
      const pinyinMatch = pinyinName.includes(searchLower) || pinyinDesc.includes(searchLower)
      
      // 首字母匹配
      const firstLetters = pinyin(tool.name, { pattern: 'first', toneType: 'none', type: 'array' }).join('')
      const firstLetterMatch = firstLetters.includes(searchLower)
      
      const matchesSearch = textMatch || pinyinMatch || firstLetterMatch
      const matchesCategory = selectedCategory === '全部' || tool.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">在线工具箱</h1>
        
        <div className="mb-8 space-y-4">
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="搜索工具... (支持拼音/首字母搜索)"
                className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('全部')}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === '全部'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              全部
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="text-center text-gray-300">
            共找到 {filteredTools.length} 个工具
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <div
              key={tool.name}
              className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl">{tool.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                  <p className="text-sm text-gray-300">{tool.description}</p>
                </div>
              </div>

              {tool.status === 'available' ? (
                <a
                  href={tool.href}
                  className="block w-full py-2 text-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  立即使用
                </a>
              ) : tool.status === 'maintenance' ? (
                <button
                  disabled
                  className="block w-full py-2 text-center bg-yellow-500 text-white rounded-lg cursor-not-allowed"
                >
                  维护中
                </button>
              ) : (
                <button
                  disabled
                  className="block w-full py-2 text-center bg-gray-500 text-white rounded-lg cursor-not-allowed"
                >
                  开发中
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 