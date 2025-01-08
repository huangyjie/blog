import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'QQ',
  auth: {
    user: '1703440290@qq.com',     // 发送邮箱
    pass: 'fhsodspidkncbfab'       // 授权码
  }
})

export async function POST(request: Request) {
  try {
    const { from, to, subject, name, email, message } = await request.json()

    // 创建HTML格式的邮件内容
    const htmlContent = `
      <div style="
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
        color: #333;
      ">
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        ">
          <h1 style="
            color: white;
            margin: 0;
            font-size: 24px;
          ">新的反馈消息</h1>
        </div>

        <div style="
          background: #ffffff;
          padding: 20px;
          border-radius: 0 0 10px 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        ">
          <div style="margin-bottom: 20px;">
            <h2 style="
              color: #4a5568;
              font-size: 18px;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 2px solid #edf2f7;
            ">发送者信息</h2>
            <p style="margin: 5px 0;"><strong>姓名：</strong>${name}</p>
            <p style="margin: 5px 0;"><strong>邮箱：</strong>${email}</p>
          </div>

          <div>
            <h2 style="
              color: #4a5568;
              font-size: 18px;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 2px solid #edf2f7;
            ">反馈内容</h2>
            <div style="
              background: #f7fafc;
              padding: 15px;
              border-radius: 5px;
              white-space: pre-wrap;
            ">${message}</div>
          </div>
        </div>

        <div style="
          text-align: center;
          margin-top: 20px;
          color: #718096;
          font-size: 14px;
        ">
          <p>此邮件由系统自动发送，请勿直接回复</p>
          <p>发送时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
        </div>
      </div>
    `

    const mailOptions = {
      from: `${name} <1703440290@qq.com>`,
      to,
      subject,
      html: htmlContent
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      status: 'success',
      message: '邮件发送成功'
    })
  } catch (error) {
    console.error('发送邮件失败:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: '发送邮件失败'
      },
      { status: 500 }
    )
  }
} 