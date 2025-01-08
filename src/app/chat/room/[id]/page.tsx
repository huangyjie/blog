'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { RandomBackground } from '@/components/ui/random-background'
import { EmojiPicker } from '@/components/ui/emoji-picker'

interface ChatRoom {
  room_id: number
  room_name: string
  room_number: string
  description: string
}

interface ChatMessage {
  message_id: number
  sender_name: string
  content: string
  type: 'text' | 'image'
  created_at: string
}

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

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showImageMenu, setShowImageMenu] = useState<{
    id: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    loadRoom()
    // 如果没有用户名，提示输入
    const savedUsername = localStorage.getItem('chat_username')
    if (savedUsername) {
      setUsername(savedUsername)
    } else {
      const name = prompt('请输入您的昵称:')
      if (name) {
        localStorage.setItem('chat_username', name)
        setUsername(name)
      } else {
        router.push('/chat')
      }
    }
  }, [params.id])

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 添加自动刷新消息的功能
  useEffect(() => {
    const interval = setInterval(() => {
      if (room) {
        loadMessages()
      }
    }, 3000) // 每3秒刷新一次

    return () => clearInterval(interval)
  }, [room])

  const loadRoom = async () => {
    try {
      const response = await fetch(`/api/chatrooms/${params.id}`)
      const data = await response.json()
      if (data.room) {
        setRoom(data.room)
        // 加载聊天记录
        loadMessages()
      }
    } catch (error) {
      console.error('加载聊天室失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/chatrooms/${params.id}/messages`)
      const data = await response.json()
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('加载消息失败:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证消息内容和用户名
    if (!newMessage.trim()) {
      alert('请输入消息内容')
      return
    }
    
    if (!username) {
      alert('请先设置昵称')
      const name = prompt('请输入您的昵称:')
      if (name) {
        localStorage.setItem('chat_username', name)
        setUsername(name)
      }
      return
    }

    try {
      console.log('发送消息:', {
        sender_name: username,
        content: newMessage,
        room_id: params.id
      })

      const response = await fetch(`/api/chatrooms/${params.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_name: username,
          content: newMessage.trim()
        })
      })

      const data = await response.json()
      console.log('服务器响应:', data)

      if (response.ok) {
        setNewMessage('') // 清空输入框
        // 加新消息到列表
        const newMsg = {
          message_id: Date.now(),
          sender_name: username,
          content: newMessage.trim(),
          created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, newMsg])
      } else {
        alert(data.error || '发送失败，请重试')
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      alert('发送失败，请重试')
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
  }

  // 添加图片上传处理函数
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 验证文件大小（例如限制为2MB）
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB')
      return
    }

    try {
      // 创建预览
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64Image = event.target?.result as string
        setImagePreview(base64Image)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('图片预览失败:', error)
      alert('图片预览失败，请重试')
    }
  }

  // 添加发送图片的函数
  const handleSendImage = async () => {
    if (!imagePreview) return

    try {
      const response = await fetch(`/api/chatrooms/${params.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_name: username,
          content: imagePreview,
          type: 'image'
        })
      })

      if (response.ok) {
        const newMsg = {
          message_id: Date.now(),
          sender_name: username,
          content: imagePreview,
          type: 'image',
          created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, newMsg])
        setImagePreview(null) // 清除预览
      }
    } catch (error) {
      console.error('发送图片失败:', error)
      alert('发送图片失败，请重试')
    }
  }

  const handleImageContextMenu = (e: React.MouseEvent, messageId: number) => {
    e.preventDefault();
    setShowImageMenu({
      id: messageId,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleDownloadImage = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowImageMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 添加撤回消息的函数
  const handleDeleteMessage = async (messageId: number) => {
    try {
      const response = await fetch(`/api/chatrooms/${params.id}/messages/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_id: messageId,
          sender_name: username
        })
      });

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.message_id !== messageId));
        setShowImageMenu(null);
      } else {
        const data = await response.json();
        alert(data.error || '撤回失败');
      }
    } catch (error) {
      console.error('撤回消息失败:', error);
      alert('撤回失败，请重试');
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen">
        <RandomBackground />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center text-white">加载中...</div>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen">
        <RandomBackground />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center text-white">聊天室不存在或已关闭</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 聊天室头部 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">{room.room_name}</h1>
              <p className="text-sm text-gray-300">房间号: {room.room_number}</p>
            </div>
            <button
              onClick={() => router.push('/chat')}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              返回列表
            </button>
          </div>

          {/* 聊天区域 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            {/* 消息列表 */}
            <div className="h-[500px] overflow-y-auto mb-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.message_id}
                  className={`flex flex-col ${
                    message.sender_name === username ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="max-w-[80%] bg-white/20 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      {message.sender_name}
                    </div>
                    {message.type === 'image' ? (
                      <div className="relative">
                        <img 
                          src={message.content} 
                          alt="聊天图片" 
                          className="w-40 h-40 object-contain rounded-lg cursor-pointer"
                          onClick={() => window.open(message.content, '_blank')}
                          onContextMenu={(e) => handleImageContextMenu(e, message.message_id)}
                        />
                        {showImageMenu && showImageMenu.id === message.message_id && (
                          <div 
                            className="fixed bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 py-2 z-50"
                            style={{
                              left: showImageMenu.x,
                              top: showImageMenu.y
                            }}
                          >
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-white/10 text-white"
                              onClick={() => {
                                window.open(message.content, '_blank');
                                setShowImageMenu(null);
                              }}
                            >
                              查看原图
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-white/10 text-white"
                              onClick={() => {
                                handleDownloadImage(
                                  message.content,
                                  `chat-image-${message.message_id}.png`
                                );
                                setShowImageMenu(null);
                              }}
                            >
                              下载图片
                            </button>
                            {/* 只有消息发送者才能看到撤回选项 */}
                            {message.sender_name === username && (
                              <button
                                className="w-full px-4 py-2 text-left hover:bg-white/10 text-red-400"
                                onClick={() => handleDeleteMessage(message.message_id)}
                              >
                                撤回消息
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p 
                        className="text-white break-words"
                        onContextMenu={(e) => {
                          // 只有自己发送的消息才显示右键菜单
                          if (message.sender_name === username) {
                            e.preventDefault();
                            setShowImageMenu({
                              id: message.message_id,
                              x: e.clientX,
                              y: e.clientY
                            });
                          }
                        }}
                      >
                        {message.content}
                      </p>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* 发送消息表单 */}
            <div className="flex gap-2">
              {/* 将表情选择器和输入框包装在一个div中，与表单分开 */}
              <div className="relative flex-1 flex gap-2">
                <div className="relative flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowEmojiPicker(!showEmojiPicker)
                    }}
                    className="px-3 h-full bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                    title="选择表情"
                  >
                    😊
                  </button>
                  {showEmojiPicker && (
                    <EmojiPicker
                      onEmojiSelect={handleEmojiSelect}
                      onClose={() => setShowEmojiPicker(false)}
                    />
                  )}
                  {/* 图片上传按钮 */}
                  <label className="px-3 h-full bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <span className="flex items-center justify-center h-full" title="发送图片">
                      📷
                    </span>
                  </label>
                </div>
                {/* 图片预览区域 */}
                {imagePreview ? (
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-white/10 rounded-lg p-2 flex items-center justify-between">
                      <img 
                        src={imagePreview} 
                        alt="预览图片" 
                        className="h-full object-contain rounded"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                          取消
                        </button>
                        <button
                          type="button"
                          onClick={handleSendImage}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                          发送
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="输入消息..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      发送
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 