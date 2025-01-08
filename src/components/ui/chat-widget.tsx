'use client'

import { useState, useRef, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion, AnimatePresence } from 'framer-motion'
import { useClickOutside } from '@/hooks/useClickOutside'

interface ChatWidgetProps {
  onClose: () => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  isCode?: boolean
  language?: string
  isTyping?: boolean
  fullContent?: string
  id?: string
}

// 修改代码检测函数，返回包含普通文本和代码块的混合内容
const parseMessage = (content: string) => {
  const segments = []
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // 添加代码块前的文本
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      })
    }

    // 添加代码块
    segments.push({
      type: 'code',
      language: match[1] || 'plaintext',
      content: match[2].trim()
    })

    lastIndex = match.index + match[0].length
  }

  // 添加最后一段文本
  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      content: content.slice(lastIndex)
    })
  }

  // 如果没有找到代码块，检查是否整个内容看起来像代码
  if (segments.length === 0) {
    const codePatterns = [
      /\b(function|const|let|var|if|else|for|while|return|import|export)\b/,
      /[{}\[\]()<>]=?/,
      /\b(class|interface|type|extends|implements)\b/
    ]

    if (codePatterns.some(pattern => pattern.test(content))) {
      return [{
        type: 'code',
        language: 'typescript',
        content: content.trim()
      }]
    }

    return [{
      type: 'text',
      content: content
    }]
  }

  return segments
}

// 添加复制功能组件
const CodeBlock = ({ code, language }: { code: string, language: string }) => {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  
  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 
                   text-gray-300 hover:text-white transition-colors duration-200 opacity-0 
                   group-hover:opacity-100"
        title="复制代码"
      >
        {copied ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        )}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        className="rounded-lg !bg-gray-800/50 !mt-0"
        customStyle={{
          padding: '1rem',
          margin: 0,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export function ChatWidget({ onClose }: ChatWidgetProps) {
  const chatRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  // 从localStorage加载历史消息
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chatMessages')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 保存消息到localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  // 清除所有对话
  const handleClearChat = () => {
    setMessages([])
    localStorage.removeItem('chatMessages')
  }

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 逐字显示文本
  const typeMessage = async (message: Message, fullContent: string) => {
    console.log('开始打字:', fullContent)
    
    // 创建新消息对象
    const newMessage = { 
      ...message, 
      content: '',
      isTyping: true,
      id: `assistant-${Date.now()}`,
      fullContent // 保存完整内容用于比较
    }
    
    // 添加消息到列表
    setMessages(prev => [...prev, newMessage])
    
    // 逐字显示
    let currentText = ''
    const chars = Array.from(fullContent)
    
    for (let i = 0; i < chars.length; i++) {
      currentText += chars[i]
      setMessages(prev => 
        prev.map(msg => 
          // 使用 id 和 fullContent 来确保更新正确的消息
          msg.id === newMessage.id && msg.fullContent === newMessage.fullContent
            ? { ...msg, content: currentText }
            : msg
        )
      )
      
      // 使用 requestAnimationFrame 来优化性能
      await new Promise(resolve => 
        requestAnimationFrame(() => {
          setTimeout(resolve, 20)
        })
      )
    }
    
    // 更新最终状态
    setMessages(prev => 
      prev.map(msg => 
        msg.id === newMessage.id
          ? { 
              ...msg, 
              content: fullContent,
              isTyping: false,
              fullContent: undefined // 清理临时数据
            }
          : msg
      )
    )
  }

  // 发送消息
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)

    // 添加用户消息
    const userMessage = { 
      role: 'user', 
      content: currentInput,
      id: `user-${Date.now()}`
    }
    setMessages(prev => [...prev, userMessage] as Message[])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            ...messages.map(({ role, content }) => ({ role, content })),
            { role: 'user', content: currentInput }
          ]
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      console.log('API Response:', data)

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid API response')
      }

      const aiResponse = data.choices[0].message.content
      const assistantMessage: Message = {
        role: 'assistant',
        content: '',
        isTyping: true,
        id: `assistant-${Date.now()}`
      }

      await typeMessage(assistantMessage, aiResponse)
    } catch (error) {
      console.error('发送消息失败:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请稍后再试。',
        id: `error-${Date.now()}`
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // 使用 useClickOutside hook 处理点击外部
  useClickOutside(chatRef, () => {
    handleClose()
  })

  // 处理关闭动画
  const handleClose = () => {
    setIsVisible(false)
    // 等待动画完成后再调用 onClose
    setTimeout(onClose, 300)
  }

  // 修改动画配置
  const chatAnimation = {
    initial: { 
      opacity: 0, 
      scale: 0,
      transformOrigin: 'bottom right', // 设置变换原点
      x: 32, // 悬浮按钮的中心位置
      y: 32
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      scale: 0,
      x: 32,
      y: 32,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
        duration: 0.2
      }
    }
  }

  // 修改消息列表和入框的动画 
  const contentAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.2
      }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      transition: {
        duration: 0.1
      }
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          ref={chatRef}
          {...chatAnimation}
          className="fixed bottom-24 right-8 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col z-50 overflow-hidden"
        >
          {/* 头部 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center p-4 border-b dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold">AI 助手</h3>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClearChat}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="清除对话"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </motion.div>

          {/* 消息列表 */}
          <motion.div 
            {...contentAnimation}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  {message.role === 'assistant' && !message.isTyping ? (
                    <div className="space-y-4">
                      {parseMessage(message.content).map((segment, i) => (
                        <div key={i}>
                          {segment.type === 'code' ? (
                            <CodeBlock
                              code={segment.content}
                              language={segment.language || 'plaintext'}
                            />
                          ) : (
                            <p className="whitespace-pre-wrap">
                              {segment.content}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">
                      {message.content}
                      {message.isTyping && <span className="animate-pulse">▋</span>}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </motion.div>

          {/* 输入框 */}
          <motion.form 
            {...contentAnimation}
            onSubmit={handleSubmit} 
            className="p-4 border-t dark:border-gray-700"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入消息..."
                className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-400"
              >
                {isLoading ? '发送中...' : '发送'}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 