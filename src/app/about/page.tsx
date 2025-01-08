'use client'

import { useEffect } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import Image from 'next/image'

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

// 定义技术栈接口
interface TechStack {
  name: string
  icon: string
  category: 'frontend' | 'backend' | 'database' | 'tools'
}

// 技术栈数据
const techStacks: TechStack[] = [
  {
    name: 'Next.js',
    icon: 'https://simpleicons.org/icons/nextdotjs.svg',
    category: 'frontend'
  },
  {
    name: 'React',
    icon: 'https://simpleicons.org/icons/react.svg',
    category: 'frontend'
  },
  {
    name: 'TypeScript',
    icon: 'https://simpleicons.org/icons/typescript.svg',
    category: 'frontend'
  },
  {
    name: 'Tailwind CSS',
    icon: 'https://simpleicons.org/icons/tailwindcss.svg',
    category: 'frontend'
  },
  {
    name: 'Node.js',
    icon: 'https://simpleicons.org/icons/nodedotjs.svg',
    category: 'backend'
  },
  {
    name: 'MySQL',
    icon: 'https://simpleicons.org/icons/mysql.svg',
    category: 'database'
  },
  {
    name: 'Prisma',
    icon: 'https://simpleicons.org/icons/prisma.svg',
    category: 'database'
  },
  {
    name: 'Git',
    icon: 'https://simpleicons.org/icons/git.svg',
    category: 'tools'
  },
  {
    name: 'VS Code',
    icon: 'https://simpleicons.org/icons/visualstudiocode.svg',
    category: 'tools'
  }
]

export default function AboutPage() {
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

  // 保留原有的滚动到顶部效果
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  return (
    <div className="min-h-screen">
      <RandomBackground />
      
      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12 text-white text-center">关于我</h1>
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/15">
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                个人介绍
              </h2>
              <p className="text-gray-200 leading-relaxed">
                [输入你的个人介绍]
              </p>
            </section>

            <section className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/15">
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                关于本站
              </h2>
              <p className="text-gray-200 leading-relaxed">
                [输入你的关于本站介绍]
              </p>
            </section>
          </div>

          <section className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/15">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              技术栈
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {techStacks.map((tech) => (
                <div
                  key={tech.name}
                  className="flex flex-col items-center p-4 bg-black/20 rounded-lg transform transition-all duration-300 hover:scale-110 hover:bg-black/30"
                >
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className="w-10 h-10 mb-2 invert"
                  />
                  <span className="text-sm text-gray-200 text-center">{tech.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/15">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              学习线路
            </h2>

            <div className="mb-8 relative">
              <div className="absolute top-8 left-0 w-full h-0.5 bg-blue-500/30"></div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="relative pt-12">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500"></div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-400">第一阶段</h3>
                    <p className="text-sm text-blue-300 mb-2">基础打造</p>
                    <p className="text-gray-300 text-sm">
                      [输入你的学习线路]
                    </p>
                  </div>
                </div>

                <div className="relative pt-12">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-green-500"></div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-400">第二阶段</h3>
                    <p className="text-sm text-green-300 mb-2">Web开发</p>
                    <p className="text-gray-300 text-sm">
                      [输入你的学习线路]
                    </p>
                  </div>
                </div>

                <div className="relative pt-12">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-500"></div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-400">第三阶段</h3>
                    <p className="text-sm text-purple-300 mb-2">框架应用</p>
                    <p className="text-gray-300 text-sm">
                      [输入你的学习线路]
                    </p>
                  </div>
                </div>

                <div className="relative pt-12">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-yellow-500"></div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-400">第四阶段</h3>
                    <p className="text-sm text-yellow-300 mb-2">全栈发展</p>
                    <p className="text-gray-300 text-sm">
                      [输入你的学习线路]
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex-1 min-w-[300px] bg-black/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  编程语言
                </h3>
                <ul className="space-y-3">
                  {[
                    { name: '输入你的编程语言', level: 0 },
                    { name: '输入你的编程语言', level: 0 },
                    { name: '输入你的编程语言', level: 0 },
                    { name: '输入你的编程语言', level: 0 },
                    { name: '输入你的编程语言', level: 0 }
                  ].map(lang => (
                    <li key={lang.name} className="text-gray-200">
                      <div className="flex justify-between mb-1">
                        <span>{lang.name}</span>
                        <span>{lang.level}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${lang.level}%` }}
                        ></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 min-w-[300px] bg-black/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  框架和技术
                </h3>
                <ul className="space-y-3">
                  {[
                    { name: '输入你的框架和技术', level: 0 },
                    { name: '输入你的框架和技术', level: 0 },
                    { name: '输入你的框架和技术', level: 0 },
                    { name: '输入你的框架和技术', level: 0 },
                    { name: '输入你的框架和技术', level: 0 }
                  ].map(tech => (
                    <li key={tech.name} className="text-gray-200">
                      <div className="flex justify-between mb-1">
                        <span>{tech.name}</span>
                        <span>{tech.level}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${tech.level}%` }}
                        ></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 min-w-[300px] bg-black/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                  开发工具
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    '输入你的开发工具',
                    '输入你的开发工具',
                    '输入你的开发工具',
                    '输入你的开发工具',
                    '输入你的开发工具',
                    '输入你的开发工具'
                  ].map(tool => (
                    <div 
                      key={tool}
                      className="flex items-center gap-2 text-gray-200 bg-white/5 p-2 rounded hover:bg-white/10 transition-colors"
                    >
                      <div className="w-4 h-4" />
                      {tool}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 min-w-[300px] bg-black/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  办公软件
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: '输入你的办公软件', checked: false },
                    { name: '输入你的办公软件', checked: false },
                    { name: '输入你的办公软件', checked: false },
                    { name: '输入你的办公软件', checked: false },
                    { name: '输入你的办公软件', checked: false },
                    { name: '输入你的办公软件', checked: false }
                  ].map(software => (
                    <div 
                      key={software.name}
                      className="flex items-center gap-2 text-gray-200 bg-white/5 p-2 rounded hover:bg-white/10 transition-colors"
                    >
                      <div className="w-4 h-4" />
                      {software.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/15">
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
                我的使命
              </h2>
              <p className="text-gray-200 leading-relaxed">
                [输入你的使命]
              </p>
            </section>

            <section className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/15">
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                联系我
              </h2>
              <div className="space-y-4">
                <p className="text-gray-200">
                  [输入你的提示]
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="mailto:[输入你的邮箱]" 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-blue-400">[输入你的邮箱]</span>
                  </a>
                  <a
                    href="https://github.com/[输入你的github账号]"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 rounded-lg hover:bg-gray-500/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">[输入你的github账号]</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 