'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { RandomBackground } from '@/components/ui/random-background'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isTyping?: boolean
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  lastUpdated: number
}

// 添加错误边界组件
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">出现了一点点问题</h2>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              刷新页面
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function AIChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions')
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions))
    }
  }, [])

  useEffect(() => {
    if (sessions.length > 0 && !currentSessionId) {
      setCurrentSessionId(sessions[0].id)
    }
  }, [sessions, currentSessionId])

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      lastUpdated: Date.now()
    }
    setSessions(prev => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
  }

  const currentSession = sessions.find(s => s.id === currentSessionId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !currentSessionId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      setSessions(prev => prev.map(session => 
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage],
              lastUpdated: Date.now()
            }
          : session
      ))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [...currentSession!.messages, userMessage].map(({ role, content }) => ({
            role,
            content
          }))
        })
      })

      if (!response.ok) throw new Error('API request failed')

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: Date.now()
      }

      setSessions(prev => prev.map(session => 
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, assistantMessage],
              lastUpdated: Date.now()
            }
          : session
      ))
    } catch (error) {
      console.error('发送消息失败:', error)
      setSessions(prev => prev.map(session => 
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, {
                id: Date.now().toString(),
                role: 'assistant',
                content: '抱歉，发送消息失败，请稍后重试。', 
                timestamp: Date.now()
              }],
              lastUpdated: Date.now()
            }
          : session
      ))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setInput('')
    setIsLoading(false)
  }, [currentSessionId])

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (currentSessionId === sessionId) {
      setCurrentSessionId('')
    }
  }

  const updateSessionTitle = (sessionId: string, newTitle: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId
        ? { ...session, title: newTitle }
        : session
    ))
  }

  const parseMessage = (content: string) => {
    const segments = []
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        })
      }

      segments.push({
        type: 'code',
        language: match[1] || 'plaintext',
        content: match[2].trim()
      })

      lastIndex = match.index + match[0].length
    }

    if (lastIndex < content.length) {
      segments.push({
        type: 'text',
        content: content.slice(lastIndex)
      })
    }

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
          className="absolute right-2 top-2 p-2 rounded-lg bg-gray-700/70 hover:bg-gray-600/70 
                     text-gray-300 hover:text-white transition-all duration-300 opacity-0 
                     group-hover:opacity-100 backdrop-blur-sm"
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
          className="rounded-lg !bg-gray-800/70 !mt-0 border border-white/10"
          customStyle={{
            padding: '1.25rem',
            margin: 0,
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    )
  }

  const handleClearSessions = () => {
    if (confirm('确定要清空所有对话记录吗？此操作不可恢复！')) {
      setSessions([])
      setCurrentSessionId('')
      localStorage.removeItem('chatSessions')
    }
  }

  // 添加 useEffect 来监听 sessions 变化并保存到 localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions))
    }
  }, [sessions])

  return (
    <div className="relative min-h-screen">
      <RandomBackground />
      
      <div className="relative z-10 flex h-screen bg-gradient-to-br from-gray-900/70 to-gray-800/70 backdrop-blur-sm">
        <div className="w-72 bg-gradient-to-b from-gray-800/30 to-gray-900/30 backdrop-blur-xl 
                        flex flex-col border-r border-white/10">
          <div className="flex-none p-4 space-y-6 border-b border-white/10">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 
                              blur-lg opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm 
                              rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                <h1 className="text-2xl font-bold text-white mb-3">AI 助手</h1>
                <p className="text-sm text-gray-300">与 AI 展开对话，探索无限可能</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={createNewSession}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 
                           hover:from-blue-600 hover:to-blue-700
                           text-white rounded-lg transition-all duration-200
                           flex items-center justify-center space-x-2
                           shadow-lg shadow-blue-500/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>新对话</span>
              </button>
              
              <button
                onClick={handleClearSessions}
                className="p-2.5 bg-gradient-to-r from-red-500 to-red-600
                           hover:from-red-600 hover:to-red-700
                           text-white rounded-lg transition-all duration-200
                           shadow-lg shadow-red-500/25"
                title="清空所有对话"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {sessions.map(session => (
              <div
                key={session.id}
                className="group relative flex items-center"
              >
                <button
                  onClick={() => setCurrentSessionId(session.id)}
                  className={`flex-1 px-4 py-3 rounded-lg text-left truncate
                             transition-all duration-300 ${
                               session.id === currentSessionId
                                 ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-white shadow-lg border border-white/10'
                                 : 'text-gray-300 hover:bg-white/5'
                             }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="truncate">{session.title}</span>
                  </div>
                </button>
                
                <div className="absolute right-2 hidden group-hover:flex items-center space-x-1 bg-gray-800/90 
                              backdrop-blur-sm rounded-lg p-1 shadow-lg">
                  <button
                    onClick={() => {
                      const newTitle = prompt('输入新的标题', session.title)
                      if (newTitle) {
                        updateSessionTitle(session.id, newTitle)
                      }
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 
                             transition-all duration-200"
                    title="编辑标题"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm('确定要删除这个对话吗？')) {
                        deleteSession(session.id)
                      }
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10
                             transition-all duration-200"
                    title="删除对话"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm">
          {currentSession ? (
            <>
              <div className="px-6 py-4 border-b border-white/10 bg-gray-800/30 backdrop-blur-xl">
                <h2 className="text-lg font-semibold text-white">{currentSession.title}</h2>
                <p className="text-sm text-gray-400">
                  {currentSession.messages.length} 条消息 · 
                  {new Date(currentSession.lastUpdated).toLocaleString()}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin 
                             scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {currentSession.messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl p-4 shadow-xl backdrop-blur-sm 
                                  ${message.role === 'user'
                                    ? 'bg-gradient-to-br from-blue-500/90 via-blue-600/90 to-blue-700/90 text-white'
                                    : 'bg-gradient-to-br from-gray-700/90 via-gray-800/90 to-gray-900/90 text-gray-100'
                                  } border border-white/10 hover:border-white/20 transition-all duration-300`}>
                      {message.role === 'assistant' ? (
                        <div className="space-y-4">
                          {parseMessage(message.content).map((segment, i) => (
                            <div key={i}>
                              {segment.type === 'code' ? (
                                <CodeBlock
                                  code={segment.content}
                                  language={segment.language}
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
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                      <div className="mt-2 text-xs opacity-70 text-right">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} 
                    className="p-4 border-t border-white/10 bg-gradient-to-b from-gray-800/30 to-gray-900/30 backdrop-blur-xl
                             shadow-lg">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="输入消息..."
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 text-white rounded-xl 
                             border border-white/10 focus:outline-none focus:ring-2 
                             focus:ring-blue-500/50 focus:border-transparent
                             placeholder-gray-400 backdrop-blur-sm transition-all duration-300
                             hover:border-white/20 shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500/90 via-blue-600/90 to-blue-700/90
                             hover:from-blue-600/90 hover:via-blue-700/90 hover:to-blue-800/90
                             text-white rounded-xl transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed
                             shadow-lg shadow-blue-500/25 backdrop-blur-sm
                             hover:shadow-xl hover:shadow-blue-500/30
                             border border-white/10 hover:border-white/20
                             flex items-center space-x-3"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>发送中...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>发送</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400
                          bg-white/5 backdrop-blur-sm">
              <div className="p-8 rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-white/10
                            shadow-lg">
                <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-xl font-semibold mb-2">开始新的对话</p>
                <p className="text-sm opacity-75">选择左侧会话或创建新对话</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 只在包装组件上使用 export default
export default function AIChatPageWrapper() {
  return (
    <ErrorBoundary>
      <AIChatPage />
    </ErrorBoundary>
  )
} 