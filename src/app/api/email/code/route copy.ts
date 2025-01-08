import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// CORS 头配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
}

// 使用内存存储替代
export const codeStore = new Map();

// 生成随机验证码 
function generateCode(length = 6) {
  return Math.random().toString().slice(2, 2 + length)
}

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  service: 'QQ',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// 处理 OPTIONS 请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Access-Control-Max-Age': '86400',
    }
  })
}

// 添加设备检测函数
function isMobileDevice(userAgent: string) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export async function POST(request: Request) {
  console.log('收到验证码请求')
  
  try {
    const headers = {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }

    const { email, length = 6, expire = 5, userAgent = '' } = await request.json()
    const isMobile = isMobileDevice(userAgent)
    
    // 验证邮箱格式
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new NextResponse(JSON.stringify({
        status: 'error',
        message: '邮箱格式不正确'
      }), { status: 400, headers })
    }

    // 检查发送频率
    const existingCode = codeStore.get(email)
    if (existingCode) {
      const timeSinceLastSend = Date.now() - existingCode.createTime
      if (timeSinceLastSend < 60000) {
        return new NextResponse(JSON.stringify({
          status: 'error',
          message: '发送太频繁，请稍后再试'
        }), { status: 429, headers })
      }
    }

    const code = generateCode(length)
    console.log('生成的验证码:', code)

    // 修改邮件发送部分
    try {
      console.log('开始发送邮件...')
      const info = await transporter.sendMail({
        from: '"H\'s blog circle 验证服务" <1703440290@qq.com>',
        to: email,
        subject: '【H\'s blog circle】您的验证码',
        html: `
          <div style="max-width: ${isMobile ? '100%' : '600px'}; margin: 0 auto; padding: ${isMobile ? '15px' : '20px'}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <!-- 头部 Logo 区域 -->
            <div style="background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%); padding: ${isMobile ? '20px 15px' : '30px 20px'}; border-radius: ${isMobile ? '12px' : '16px'}; color: white; text-align: center; margin-bottom: ${isMobile ? '20px' : '24px'}; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h1 style="margin: 0; font-size: ${isMobile ? '24px' : '28px'}; font-weight: 700;">H's blog circle</h1>
              <p style="margin: 8px 0 0; font-size: ${isMobile ? '14px' : '16px'}; opacity: 0.9;">安全验证服务</p>
            </div>
            
            <!-- 主要内容区域 -->
            <div style="background: white; padding: ${isMobile ? '24px 16px' : '32px'}; border-radius: ${isMobile ? '12px' : '16px'}; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
              <h2 style="color: #1F2937; font-size: ${isMobile ? '20px' : '22px'}; margin: 0 0 24px; text-align: center;">
                您的验证码已生成
              </h2>
              
              ${isMobile ? `
                <!-- 移动端验证码样式 -->
                <div style="background: linear-gradient(145deg, #F3F4F6, #E5E7EB); padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                  <div style="font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #4F46E5; margin: 0; user-select: all; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">
                    ${code}
                  </div>
                  <p style="margin: 8px 0 0; color: #6B7280; font-size: 12px;">
                    点击验证码即可复制 | ${expire}分钟内有效
                  </p>
                </div>
              ` : `
                <!-- PC端验证码样式 -->
                <div style="background: linear-gradient(145deg, #F3F4F6, #E5E7EB); padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center; position: relative; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                  <div style="position: relative; z-index: 1;">
                    <div style="font-family: 'Courier New', monospace; font-size: 42px; font-weight: 700; letter-spacing: 12px; color: #4F46E5; margin: 0; user-select: all; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">
                      ${code}
                    </div>
                    <p style="margin: 12px 0 0; color: #6B7280; font-size: 14px;">
                      点击验证码即可复制 | ${expire}分钟内有效
                    </p>
                  </div>
                </div>
              `}
              
              <!-- 倒计时提示 -->
              <div style="text-align: center; margin-bottom: ${isMobile ? '20px' : '24px'};">
                <p style="color: #6B7280; font-size: ${isMobile ? '12px' : '14px'};">
                  验证码有效期剩余 <span style="color: #4F46E5; font-weight: 600;">${expire}:00</span> 分钟
                </p>
              </div>
              
              <!-- 重要提示 -->
              <div style="margin: ${isMobile ? '20px 0' : '24px 0'}; padding: ${isMobile ? '12px' : '16px'}; border-left: 4px solid #4F46E5; background: #F3F4F6; border-radius: 0 8px 8px 0;">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <span style="width: 6px; height: 6px; background: #000; border-radius: 50%; margin-right: 8px;"></span>
                  <h3 style="margin: 0; color: #1F2937; font-size: ${isMobile ? '14px' : '16px'}; font-weight: 600;">
                    重要提示
                  </h3>
                </div>
                <ul style="margin: 0; padding-left: ${isMobile ? '16px' : '20px'}; color: #4B5563; line-height: 1.6; font-size: ${isMobile ? '12px' : '14px'};">
                  <li>验证码有效期：<strong>${expire}</strong> 分钟</li>
                  <li>为保障账号安全，请勿泄露验证码</li>
                  <li>如非本人操作，请忽略此邮件</li>
                  <li>验证码区分大小写，请准确输入</li>
                </ul>
              </div>
              
              <!-- 验证服务说明 -->
              <div style="margin: ${isMobile ? '20px 0' : '24px 0'}; padding: ${isMobile ? '12px' : '16px'}; background: #F3F4F6; border-radius: 12px;">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <span style="width: 6px; height: 6px; background: #000; border-radius: 50%; margin-right: 8px;"></span>
                  <h3 style="margin: 0; color: #1F2937; font-size: ${isMobile ? '14px' : '16px'}; font-weight: 600;">
                    验证服务说明
                  </h3>
                </div>
                <ul style="margin: 0; padding-left: ${isMobile ? '16px' : '20px'}; color: #4B5563; line-height: 1.6; font-size: ${isMobile ? '12px' : '14px'};">
                  <li>本验证码用于 H's blog circle 的账号验证服务</li>
                  <li>验证码有效期为 ${expire} 分钟，请及时验证</li>
                  <li>如果这不是您的操作，请忽略此邮件</li>
                </ul>
              </div>

              <!-- 安全提醒 -->
              <div style="margin-top: ${isMobile ? '20px' : '24px'}; padding: ${isMobile ? '16px' : '24px'}; background: #FEF2F2; border-radius: 12px; border: 1px solid #FEE2E2;">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <span style="width: 6px; height: 6px; background: #000; border-radius: 50%; margin-right: 8px;"></span>
                  <h3 style="margin: 0; color: #DC2626; font-size: ${isMobile ? '14px' : '16px'}; font-weight: 600;">
                    安全警告
                  </h3>
                </div>
                <ul style="margin: 0; padding-left: ${isMobile ? '16px' : '20px'}; color: #991B1B; font-size: ${isMobile ? '12px' : '14px'}; line-height: 1.6;">
                  <li><strong>请注意：</strong>H's blog circle 工作人员不会以任何理由要求您提供验证码</li>
                  <li><strong>切勿泄露：</strong>验证码仅用于验证您的身份，请勿向任何人透露</li>
                  <li><strong>防止诈骗：</strong>谨防冒充客服或工作人员的诈骗行为</li>
                  <li><strong>安全建议：</strong>定期更改密码，开启双重认证等安全措施</li>
                </ul>
              </div>

              <!-- 帮助支持 -->
              <div style="margin-top: ${isMobile ? '16px' : '20px'}; padding: ${isMobile ? '12px' : '16px'}; background: #ECFDF5; border-radius: 12px;">
                <p style="margin: 0; color: #059669; font-size: ${isMobile ? '12px' : '13px'}; text-align: center;">
                  遇到问题？请联系客服支持
                  <a href="mailto:1401466869@qq.com" style="color: #059669; text-decoration: underline; font-weight: 500;">1401466869@qq.com</a>
                </p>
              </div>
            </div>
            
            <!-- 页脚区域 -->
            <div style="margin-top: ${isMobile ? '20px' : '24px'}; text-align: center;">
              <div style="padding: ${isMobile ? '12px' : '16px'}; background: rgba(79, 70, 229, 0.05); border-radius: 12px;">
                <p style="margin: 0 0 8px; color: #6B7280; font-size: ${isMobile ? '11px' : '13px'};">
                  此邮件由系统自动发送，请勿回复
                </p>
                <p style="margin: 0; color: #4B5563; font-size: ${isMobile ? '11px' : '13px'};">
                  © ${new Date().getFullYear()} H's blog circle | 
                  <a href="http://hsbogk.icu" style="color: #4F46E5; text-decoration: none; font-weight: 500;">访问官网</a>
                </p>
                <div style="margin: ${isMobile ? '8px 0 0' : '12px 0 0'}; padding-top: ${isMobile ? '8px' : '12px'}; border-top: 1px solid rgba(79, 70, 229, 0.1);">
                  <p style="margin: 0; color: #9CA3AF; font-size: ${isMobile ? '10px' : '12px'};">
                    开发者：H | 
                    <a href="mailto:1401466869@qq.com" style="color: #4F46E5; text-decoration: none;">联系我们</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        `
      })
      console.log('邮件发送成功，返回信息:', info)
    } catch (sendError) {
      console.error('邮件发送失败:', sendError)
      throw sendError
    }

    // 保存验证码
    const codeInfo = {
      code,
      expireTime: Date.now() + (expire * 60 * 1000),
      createTime: Date.now()
    }
    codeStore.set(email, codeInfo)
    console.log('验证码已保存')

    return new NextResponse(JSON.stringify({
      status: 'success',
      message: '验证码已发送',
      data: {
        email,
        expire: expire * 60
      }
    }), { status: 200, headers })

  } catch (error: any) {
    console.error('处理请求失败:', error)
    return new NextResponse(JSON.stringify({
      status: 'error',
      message: `发送失败: ${error.message}`,
      error: {
        code: error.code,
        name: error.name
      }
    }), { status: 500, headers: corsHeaders })
  }
}