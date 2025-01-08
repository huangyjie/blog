'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Talk {
  talk_id: number
  author: string
  title: string
  content: string
  email: string
  created_at: string
  is_hidden: number
}

export default function TalkDetailPage({ params }: { params: { id: string } }) {
  const [talk, setTalk] = useState<Talk | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadTalk()
    
    // 增强的复制保护
    const preventActions = (e: any) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    // 禁用更多可能用于复制的事件
    const events = [
      'copy', 'contextmenu', 'selectstart', 'select',
      'dragstart', 'beforecopy', 'mousedown', 'mouseup'
    ]
    
    events.forEach(event => {
      document.addEventListener(event, preventActions, { capture: true })
    })
    
    // 禁用快捷键
    const preventKeyboard = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'C')) || // 禁用 Ctrl+C
        (e.metaKey && (e.key === 'c' || e.key === 'C')) || // 禁用 Command+C
        e.key === 'F12' || // 禁用 F12
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // 禁用 Ctrl+Shift+I
        (e.ctrlKey && e.key === 'u' || e.key === 'U') // 禁用 Ctrl+U
      ) {
        e.preventDefault()
        return false
      }
    }
    
    document.addEventListener('keydown', preventKeyboard, { capture: true })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, preventActions)
      })
      document.removeEventListener('keydown', preventKeyboard)
    }
  }, [params.id])

  const loadTalk = async () => {
    try {
      const response = await fetch(`/api/talks/${params.id}`)
      const data = await response.json()
      if (data.talk) {
        setTalk(data.talk)
      }
    } catch (error) {
      console.error('加载说说失败:', error)
    }
  }

  // 处理格式化文本的函数
  const formatText = (text: string) => {
    let processedText = text;
    
    // 处理居中标记 <居中<文本>居中>
    processedText = processedText.replace(
      /<居中<([^>]*?)>居中>/gsi,
      '<div class="text-center my-4">$1</div>'
    );

    // 处理标题标记 <标题<文本>标题>
    processedText = processedText.replace(
      /<标题<([^>]*?)>标题>/gsi,
      '<h2 class="text-2xl font-bold my-4 text-gray-900 dark:text-gray-100">$1</h2>'
    );

    // 处理引用标记 <引用<文本>引用>
    processedText = processedText.replace(
      /<引用<([^>]*?)>引用>/gsi,
      '<blockquote class="pl-4 border-l-4 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r italic text-gray-700 dark:text-gray-300">$1</blockquote>'
    );
    
    // 处理加粗标记 <加粗<文本>加粗>
    processedText = processedText.replace(
      /<加粗<([^>]*?)>加粗>/gsi,
      '<strong class="font-bold">$1</strong>'
    );
    
    // 处理斜体标记 <斜体<文本>斜体>
    processedText = processedText.replace(
      /<斜体<([^>]*?)>斜体>/gsi,
      '<em class="italic">$1</em>'
    );
    
    // 处理删除线标记 <删除<文本>删除> 或 <D<文本>D>
    processedText = processedText.replace(
      /<(删除|D)<(.*?)>\1>/gsi,
      '<del>$2</del>'
    );
    
    // 处理下划线标记 <下划线<文本>下划线> 或 <U<文本>U>
    processedText = processedText.replace(
      /<(下划线|U)<(.*?)>\1>/gsi,
      '<u>$2</u>'
    );
    
    // 处理上标标记 <上标<文本>上标> 或 <S<文本>S>
    processedText = processedText.replace(
      /<(上标|S)<(.*?)>\1>/gsi,
      '<sup>$2</sup>'
    );
    
    // 处理下标标记 <下标<文本>下标> 或 <L<文本>L>
    processedText = processedText.replace(
      /<(下标|L)<(.*?)>\1>/gsi,
      '<sub>$2</sub>'
    );
    
    // 处理超链接标记 <a(连接)<显示文字>a>
    processedText = processedText.replace(
      /<a\(([^)]*)\)<([^>]*)>a>/gsi,
      (match, url, displayText) => {
        // 如果 url 以 mailto: 开头，直接使用
        const href = url.trim().startsWith('mailto:') ? url.trim() : 
          // 否则，如果看起来像邮箱地址，添加 mailto:
          url.trim().includes('@') ? `mailto:${url.trim()}` : url.trim();
        
        return `<a 
          href="${href}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="text-blue-500 cursor-pointer" 
          style="pointer-events: auto; position: relative; z-index: 30; text-decoration: none;"
        >${displayText.trim()}</a>`;
      }
    );
    
    // 处理字体标记 <宋体<文本>宋体>
    processedText = processedText.replace(
      /<(宋体|黑体|楷体|微软雅黑|仿宋)<([^>]*?)>\1>/gsi,
      (match, font, text) => {
        const fontMap: { [key: string]: string } = {
          '宋体': 'SimSun',
          '黑体': 'SimHei',
          '楷体': 'KaiTi',
          '微软雅黑': 'Microsoft YaHei',
          '仿宋': 'FangSong'
        };

        if (fontMap[font]) {
          return `<span style="font-family: ${fontMap[font]}">${text}</span>`;
        }
        return match;
      }
    );

    // 移除自动URL转换功能
    processedText = processedText.replace(
      /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g,
      url => url
    );

    // 处理表格标记 <表格<内容>表格> 或 <table<内容>table>
    processedText = processedText.replace(
      /<(表格|table)<(.*?)>\1>/gsi,
      '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">$2</table></div>'
    );

    // 处理表格行标记 <行<内容>行> 或 <tr<内容>tr>
    processedText = processedText.replace(
      /<(行|tr)<(.*?)>\1>/gsi,
      '<tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">$2</tr>'
    );

    // 处理表格标题单元格标记 <表头<内容>表头> 或 <th<内容>th>
    processedText = processedText.replace(
      /<(表头|th)<(.*?)>\1>/gsi,
      '<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-700">$2</th>'
    );

    // 处理表格单元格标记 <格<内容>格> 或 <td<内容>td>
    processedText = processedText.replace(
      /<(格|td)<(.*?)>\1>/gsi,
      '<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">$2</td>'
    );

    // 处理列表标记 <列表<内容>列表> 或 <ul<内容>ul>
    processedText = processedText.replace(
      /<(列表|ul)<(.*?)>\1>/gsi,
      '<ul class="list-disc pl-6 space-y-2">$2</ul>'
    );

    // 处理列表项标记 <项<内容>项> 或 <li<内容>li>
    processedText = processedText.replace(
      /<(项|li)<(.*?)>\1>/gsi,
      '<li>$2</li>'
    );

    // 处理有序列表标记 <数字列表<内容>数字列表> 或 <ol<内容>ol>
    processedText = processedText.replace(
      /<(数字列表|ol)<(.*?)>\1>/gsi,
      '<ol class="list-decimal pl-6 space-y-2">$2</ol>'
    );

    // 处理分割线标记 <分割线> 或<hr>
    processedText = processedText.replace(
      /<(分割线|hr)>/gsi,
      '<hr class="my-4 border-t border-gray-300 dark:border-gray-600">'
    );

    // 处理段落标记 <段落<内容>段落> 或 <p<内容>p>
    processedText = processedText.replace(
      /<(段落|p)<(.*?)>\1>/gsi,
      '<p class="mb-4">$2</p>'
    );

    // 处理缩进标记 <缩进<内容>缩进> 或 <indent<内容>indent>
    processedText = processedText.replace(
      /<(缩进|indent)<(.*?)>\1>/gsi,
      '<div class="pl-8">$2</div>'
    );

    // 处理两端对齐标记 <两端对齐<内容>两端对齐> 或 <justify<内容>justify>
    processedText = processedText.replace(
      /<(两端对齐|justify)<(.*?)>\1>/gsi,
      '<div class="text-justify">$2</div>'
    );

    // 处理代码块标记
    processedText = processedText.replace(
      /<代码<([\s\S]*?)>代码>/gsi,
      (match, codeContent) => {
        const lines = codeContent.trim().split('\n');
        let language = 'plaintext';
        let code = codeContent;
        
        if (lines[0].startsWith('```')) {
          language = lines[0].slice(3).trim();
          code = lines.slice(1, -1).join('\n').trim();
        }
        
        // 过滤掉空行，只保留有内容的行
        const codeLines = code.split('\n').filter(line => line.trim() !== '');
        const codeId = Math.random().toString(36).substring(7); // 生成唯一ID
        
        return `<pre class="relative rounded-lg bg-[#1e1e1e] dark:bg-[#1e1e1e] p-1 overflow-x-auto my-1 group max-w-[calc(100vw-4rem)]">
          <div class="flex justify-between items-center px-1 h-4">
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-gray-400/80">${language}</span>
            </div>
            <div class="flex items-center gap-2">
              <button 
                onclick="(() => {
                  const code = document.getElementById('code-${codeId}').innerText;
                  navigator.clipboard.writeText(code);
                  const btn = document.getElementById('copy-btn-${codeId}');
                  btn.innerHTML = '已复制';
                  setTimeout(() => btn.innerHTML = '复制', 2000);
                })()"
                id="copy-btn-${codeId}"
                class="text-[10px] text-gray-400/80 hover:text-gray-300/80 cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors"
                style="pointer-events: auto;"
              >
                复制
              </button>
              <div class="flex gap-1">
                <span class="w-[6px] h-[6px] rounded-full bg-[#ff5f56]"></span>
                <span class="w-[6px] h-[6px] rounded-full bg-[#ffbd2e]"></span>
                <span class="w-[6px] h-[6px] rounded-full bg-[#27c93f]"></span>
              </div>
            </div>
          </div>
          <div class="relative">
            <code id="code-${codeId}" class="block text-[12px] leading-[1.2] font-mono text-[#d4d4d4] font-normal whitespace-pre overflow-x-auto">
              ${codeLines.map((line, i) => 
                `<div class="flex hover:bg-[#2a2d2e] border-l border-transparent hover:border-[#007acc] transition-colors py-[1px]">
                  <span class="inline-block min-w-[1.2rem] text-right text-[#858585] select-none text-[10px] opacity-60">${i + 1}</span>
                  <span class="flex-1 pl-2">${line}</span>
                </div>`
              ).join('')}
            </code>
          </div>
        </pre>`;
      }
    );

    return processedText;
  };

  // 处理段落缩进
  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      // 如果段落以特殊标记开始，则不添加缩进
      const hasSpecialTag = /^<(居中|标题|代码|表格|列表|引用)</.test(paragraph);
      return (
        <p 
          key={index} 
          className={`mb-4 last:mb-0 whitespace-pre-wrap ${!hasSpecialTag ? 'indent-8' : ''}`}
          dangerouslySetInnerHTML={{ __html: formatText(paragraph) }}
        />
      );
    });
  };

  if (!talk) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 transition-colors"
        >
          ← 返回说说列表
        </button>

        <article 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 select-none relative border border-gray-100 dark:border-gray-700"
          onMouseDown={e => {
            if (!(e.target as HTMLElement).closest('a')) {
              e.preventDefault()
            }
          }}
        >
          <div 
            className="absolute inset-0 z-10" 
            style={{
              background: 'transparent',
              pointerEvents: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
            onClick={e => {
              if (!(e.target as HTMLElement).closest('a')) {
                e.preventDefault()
              }
            }}
          />
          <div 
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              mixBlendMode: 'difference',
              opacity: 0.01
            }}
          />

          <div className="relative z-0">
            <div 
              className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100"
            >
              {formatContent(talk.title)}
            </div>

            <div 
              className="prose dark:prose-invert max-w-none prose-gray prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300"
              style={{
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
                userSelect: 'none'
              }}
            >
              {formatContent(talk.content)}
            </div>

            <footer className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span 
                    className="font-medium"
                    dangerouslySetInnerHTML={{ __html: formatText(talk.author) }}
                  />
                  <span className="mx-2 text-gray-400 dark:text-gray-600">·</span>
                  <time dateTime={talk.created_at} className="text-gray-500 dark:text-gray-500">
                    {new Date(talk.created_at).toLocaleString()}
                  </time>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>联系方式：</strong>
                  <span
                    dangerouslySetInnerHTML={{ 
                      __html: formatText(talk.email)
                    }}
                    style={{
                      pointerEvents: 'auto',
                      position: 'relative',
                      zIndex: 30
                    }}
                  />
                </div>
              </div>
            </footer>
          </div>
        </article>
      </div>
    </div>
  )
}
