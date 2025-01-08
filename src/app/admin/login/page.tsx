'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RandomBackground } from '@/components/ui/random-background'

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

interface LoginForm {
  username: string
  password: string
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [captcha, setCaptcha] = useState('')
  const [captchaText, setCaptchaText] = useState('')
  const [captchaImage, setCaptchaImage] = useState('')
  const [browserCompatible, setBrowserCompatible] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    try {
      // 检查必要的 API 是否可用
      const features = {
        localStorage: typeof window.localStorage !== 'undefined',
        fetch: typeof window.fetch !== 'undefined',
        json: typeof JSON !== 'undefined'
      }
      
      console.log('浏览器功能检查:', features) // 添加日志
      
      const isCompatible = Object.values(features).every(Boolean)
      setBrowserCompatible(isCompatible)
      
      // 记录浏览器信息
      console.log('浏览器信息:', {
        userAgent: window.navigator.userAgent,
        vendor: window.navigator.vendor,
        platform: window.navigator.platform
      })
    } catch (err) {
      console.error('浏览器兼容性检查失败:', err)
      setBrowserCompatible(false)
    }
  }, [])

  useEffect(() => {
    refreshCaptcha()
  }, [])

  const refreshCaptcha = async () => {
    try {
      const response = await fetch('/api/captcha')
      const data = await response.json()
      setCaptchaImage(data.captcha)
      setCaptchaText(data.text)
    } catch (error) {
      console.error('获取验证码失败:', error)
    }
  }

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCaptcha(value)
    
    if (value.length === captchaText.length) {
      if (value.toLowerCase() !== captchaText.toLowerCase()) {
        setError('验证码错误')
        refreshCaptcha()
        setCaptcha('')
      } else {
        setError('')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('提交登录表单:', form)
    
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      
      const data = await res.json()
      console.log('登录响应:', data)
      
      if (data.success) {
        // 存储登录信息到 localStorage
        const loginInfo = {
          username: form.username,
          role: data.admin.role,
          loginTime: new Date().toLocaleString()
        }
        localStorage.setItem('adminLoginInfo', JSON.stringify(loginInfo))
        
        // 使用 replace 而不是 push，防止用户通过后退按钮返回登录页
        router.replace('/admin')
      } else {
        setError(data.error || '登录失败')
      }
    } catch (error) {
      console.error('登录错误:', error)
      setError('登录失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

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

  if (!browserCompatible) {
    return (
      <div className="min-h-screen">
        <RandomBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="bg-red-500/10 text-red-400 p-6 rounded-lg max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-4">浏览器兼容性问题</h2>
            <p>您的浏览器可能不支持某些必要功能，请尝试：</p>
            <ul className="mt-4 text-left list-disc pl-6">
              <li>更新您的浏览器到最新版本</li>
              <li>使用 Chrome、Firefox 或其他现代浏览器</li>
              <li>检查浏览器是否启用了 JavaScript</li>
              <li>检查浏览器是否允许使用 Cookie 和本地存储</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <RandomBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">管理员登录</h2>
            
            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-200">
                  用户名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src="/icons/Username.svg" alt="username" className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={form.username}
                    onChange={(e) => setForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full pl-10 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    autoFocus={false}
                    data-form-type="other"
                    data-lpignore="true"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-200">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src="/icons/password.svg" alt="password" className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={form.password}
                    onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-12 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    autoFocus={false}
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-pw-field="true"
                    aria-autocomplete="none"
                    inputMode="text"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="captcha" className="block text-sm font-medium mb-2 text-gray-200">
                  验证码
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    id="captcha"
                    value={captcha}
                    onChange={handleCaptchaChange}
                    className="w-full pl-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                    placeholder="请输入验证码"
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <div className="flex items-center gap-2">
                    <img 
                      src={captchaImage} 
                      alt="验证码" 
                      className="h-10 rounded bg-white/10 backdrop-blur-sm p-1 border border-white/20"
                      onClick={refreshCaptcha}
                    />
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      刷新
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? '登录中...' : '登录'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 