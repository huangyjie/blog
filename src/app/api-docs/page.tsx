'use client'

import { useState, useEffect, useMemo } from 'react'
import { RandomBackground } from '@/components/ui/random-background'

interface ApiEndpoint {
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  description: string
  parameters?: {
    name: string
    type: string
    required: boolean
    description: string
  }[]
  response?: {
    success: string
    error: string
  }
  examples?: {
    language: string
    code: string
  }[]
  categories?: {
    name: string
    endpoint: string
  }[]
  notes?: string[]
}

// 导出 API 接口列表
export const apiEndpoints: ApiEndpoint[] = [
  {
    name: '随机励志语录',
    method: 'GET',
    endpoint: 'http://api.[输入你的域名].icu/YIYAN/',
    description: '获取一条随机的中文励志语录，包含励志、科技、企业家、科学家等多个领域的名言警句。',
    parameters: [],
    response: {
      success: `{
    "status": "success",
    "quote": "努力不一定成功，但放弃一定失败。"
}`,
      error: `{
    "status": "error",
    "message": "服务器内部错误"
}`
    },
    examples: [
      {
        language: 'JavaScript (Fetch)',
        code: `fetch('http://api.[输入你的域名].icu/YIYAN/')
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success') {
            console.log(data.quote);
        } else {
            console.error(data.message);
        }
    })
    .catch(error => console.error('Error:', error));`
      },
      {
        language: 'Python',
        code: `import requests

try:
    response = requests.get('http://api.[输入你的域名].icu/YIYAN/')
    data = response.json()
    
    if data['status'] == 'success':
        print(data['quote'])
    else:
        print(data['message'])
except Exception as e:
    print('Error:', str(e))`
      },
      {
        language: 'PHP',
        code: `<?php
$response = file_get_contents('http://api.[输入你的域名].icu/YIYAN/');
$data = json_decode($response, true);

if($data['status'] === 'success') {
    echo $data['quote'];
} else {
    echo $data['message'];
}
?>`
      },
      {
        language: 'HTML',
        code: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>随机励志语录</title>
</head>
<body>
    <div id="quote"></div>
    <button onclick="getQuote()">获取新语录</button>

    <script>
    function getQuote() {
        fetch('http://api.[输入你的域名].icu/YIYAN/')
            .then(response => response.json())
            .then(data => {
                if(data.status === 'success') {
                    document.getElementById('quote').innerText = data.quote;
                } else {
                    document.getElementById('quote').innerText = '获取失败：' + data.message;
                }
            })
            .catch(error => {
                document.getElementById('quote').innerText = '请求错误：' + error;
            });
    }
    
    getQuote(); // 页面加载时获取一次
    </script>
</body>
</html>`
      }
    ]
  },
  {
    name: '随机背景图片',
    method: 'GET',
    endpoint: 'http://api.[输入你的域名].icu/QB/',
    description: '返回一张随机全屏背景图片。支持jpg、jpeg、png、gif格式，图片会自动适应全屏显示。',
    parameters: [
      {
        name: 'category',
        type: 'string',
        required: false,
        description: '可选的背景图片分类，不传则随机返回任意分类'
      }
    ],
    categories: [
      {
        name: '创意背景',
        endpoint: 'http://api.[输入你的域名].icu/imgs/CY/'
      },
      {
        name: '动漫背景',
        endpoint: 'http://api.[输入你的域名].icu/imgs/DM/'
      },
      {
        name: '风景背景',
        endpoint: 'http://api.[输入你的域名].icu/imgs/FJ/'
      },
      {
        name: '绘画背景',
        endpoint: 'http://api.[输入你的域名].icu/imgs/HH/'
      },
      {
        name: '跑车背景',
        endpoint: 'http://api.[输入你的域名].icu/imgs/PC/'
      },
      {
        name: '其他背景',
        endpoint: 'http://api.[输入你的域名].icu/imgs/QT/'
      },
      {
        name: '影视背景',
        endpoint: 'http://api.[输入你的域名].icu/imgs/YS/'
      },
      {
        name: '游戏背景',
        endpoint: 'http://api.[输入你的域名].icu/imgs/YX/'
      }
    ],
    response: {
      success: '直接返回图片HTML页面',
      error: '返回错误信息HTML页面'
    },
    examples: [
      {
        language: 'HTML (iframe)',
        code: `<iframe
    src="http://api.[输入你的域名].icu/QB/"
    frameborder="0"
    style="width: 100%; height: 100vh;">
</iframe>`
      },
      {
        language: 'JavaScript',
        code: `// 在现有页面中动态加载随机背景
function loadRandomBackground() {
    document.body.style.backgroundImage = url('http://api.[输入你的域名].icu/QB/');
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
}

loadRandomBackground(); // 调用函数加载背景`
      },
      {
        language: 'Python',
        code: `import requests

response = requests.get('http://api.[输入你的域名].icu/QB/')
if response.status_code == 200:
    print('成功获取随机图片')
    # 处理响应内容
else:
    print('请求失败，状态码：', response.status_code)`
      },
      {
        language: 'PHP',
        code: `<?php
$response = file_get_contents('http://api.[输入你的域名].icu/QB/');
if ($response !== false) {
    echo '成功获取随机图片';
    # 处理响应内容
} else {
    echo '请求失败';
}
?>`
      }
    ]
  },
  {
    name: 'QQ头像获取',
    method: 'GET',
    endpoint: 'http://q1.qlogo.cn/g?b=qq&nk={QQ号码}&s=640',
    description: '获取指定QQ号码的头像图片。支持不同尺寸，可通过修改参数s的值来获取不同大小的头像。s可选值：640、100、40。',
    parameters: [
      {
        name: 'b',
        type: 'string',
        required: true,
        description: '固定值为"qq"'
      },
      {
        name: 'nk',
        type: 'string',
        required: true,
        description: 'QQ号码'
      },
      {
        name: 's',
        type: 'number',
        required: true,
        description: '头像尺寸，可选值：640(大)、100(中)、40(小)'
      }
    ],
    response: {
      success: '直接返回图片文件',
      error: '返回默认头像图片'
    },
    examples: [
      {
        language: 'HTML',
        code: `<!-- 直接在img标签中使用 -->
<img 
  src="http://q1.qlogo.cn/g?b=qq&nk=QQ号&s=640" 
  alt="QQ头像"
  style="width: 200px; height: 200px;"
/>`
      },
      {
        language: 'JavaScript (Fetch)',
        code: `// 获取QQ头像URL
function getQQAvatar(qqNumber, size = 640) {
    return \`http://q1.qlogo.cn/g?b=qq&nk=\${qqNumber}&s=\${size}\`;
}

// 使用示例
const avatarUrl = getQQAvatar('QQ号', 100);
const imgElement = document.createElement('img');
imgElement.src = avatarUrl;
imgElement.alt = 'QQ头像';
document.body.appendChild(imgElement);`
      },
      {
        language: 'React',
        code: `function QQAvatar({ qqNumber, size = 640 }) {
    const avatarUrl = \`http://q1.qlogo.cn/g?b=qq&nk=\${qqNumber}&s=\${size}\`;
    
    return (
        <img 
            src={avatarUrl}
            alt="QQ头像"
            className="rounded-full"
            width={size}
            height={size}
        />
    );
}

// 使用示例
<QQAvatar qqNumber="QQ号" size={100} />`
      },
      {
        language: 'Vue',
        code: `<!-- 组件模板 -->
<template>
    <img 
        :src="avatarUrl"
        :alt="'QQ: ' + qqNumber"
        class="rounded-full"
        :width="size"
        :height="size"
    />
</template>

<script>
export default {
    props: {
        qqNumber: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            default: 640
        }
    },
    computed: {
        avatarUrl() {
            return \`http://q1.qlogo.cn/g?b=qq&nk=\${this.qqNumber}&s=\${this.size}\`;
        }
    }
}
</script>`
      },
      {
        language: 'Python',
        code: `import requests
from PIL import Image
from io import BytesIO

def get_qq_avatar(qq_number: str, size: int = 640) -> Image:
    url = f'http://q1.qlogo.cn/g?b=qq&nk={qq_number}&s={size}'
    response = requests.get(url)
    
    if response.status_code == 200:
        # 将响应内容转换为图片对象
        return Image.open(BytesIO(response.content))
    else:
        raise Exception('获取头像失败')`
      },
      {
        language: 'PHP',
        code: `<?php
function getQQAvatar($qqNumber, $size = 640) {
    return "http://q1.qlogo.cn/g?b=qq&nk={$qqNumber}&s={$size}";
}

// 在HTML中使用
$avatarUrl = getQQAvatar('QQ号', 100);
echo "<img src='{$avatarUrl}' alt='QQ头像' />";

// 下载头像
$avatarData = file_get_contents(getQQAvatar('QQ号'));
if ($avatarData !== false) {
    file_put_contents('qq_avatar.jpg', $avatarData);
    echo '头像下载成功';
}
?>`
      }
    ]
  },
  {
    name: 'QQ添加好友/群',
    method: 'GET',
    endpoint: 'tencent://message/?uin={QQ号码}&Site=&Menu=yes',
    description: '打开QQ并跳转到指定好友或群的聊天窗口，支持添加好友和加入群聊两种场景。',  
    parameters: [
      {
        name: 'uin',
        type: 'string',
        required: true,
        description: 'QQ号码或群号'
      }
    ],
    examples: [
      {
        language: 'HTML (添加好友)',
        code: `<!-- 添加QQ好友 -->
<a href="tencent://message/?uin=QQ号码&Site=&Menu=yes">
    添加为QQ好友
</a>`
      },
      {
        language: 'HTML (加入群聊)',
        code: `<!-- 加入QQ群 -->
<a href="https://qm.qq.com/cgi-bin/qm/qr?k=群key&jump_from=webapi">
    加入QQ群
</a>`
      },
      {
        language: 'JavaScript',
        code: `// 添加QQ好友
function addQQFriend(qqNumber) {
    window.location.href = \`tencent://message/?uin=\${qqNumber}&Site=&Menu=yes\`;
}

// 加入QQ群
function joinQQGroup(groupKey) {
    window.location.href = \`https://qm.qq.com/cgi-bin/qm/qr?k=\${groupKey}&jump_from=webapi\`;
}`
      }
    ]
  },
  {
    name: 'GitHub跳转',
    method: 'GET',
    endpoint: 'https://github.com/{username}/{repository}',
    description: '跳转到指定的GitHub仓库页面。支持直接访问用户主页、仓库、特定文件等。', 
    parameters: [
      {
        name: 'username',
        type: 'string',
        required: true,
        description: 'GitHub用户名'
      },
      {
        name: 'repository',
        type: 'string',
        required: false,
        description: '仓库名称'
      }
    ],
    examples: [
      {
        language: 'HTML',
        code: `<!-- 跳转到GitHub仓库 -->
<a href="https://github.com/用户名/仓库名">
    访问GitHub仓库
</a>

<!-- 跳转到用户主页 -->
<a href="https://github.com/用户名">
    访问GitHub主页
</a>`
      },
      {
        language: 'JavaScript',
        code: `// 跳转到GitHub仓库
function goToGitHubRepo(username, repository) {
    window.location.href = \`https://github.com/\${username}/\${repository}\`;
}

// 跳转到用户主页
function goToGitHubProfile(username) {
    window.location.href = \`https://github.com/\${username}\`;
}

// 使用示例
goToGitHubRepo('用户名', '仓库名');
goToGitHubProfile('用户名');`
      },
      {
        language: 'React',
        code: `function GitHubLink({ username, repository }) {
    const repoUrl = \`https://github.com/\${username}/\${repository}\`;
    
    return (
        <a 
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
        >
            访问 {repository} 仓库
        </a>
    );
}

// 使用示例
<GitHubLink username="用户名" repository="仓库名" />`
      }
    ]
  },
  {
    name: '发送邮件',
    method: 'GET',
    endpoint: 'mailto:{email}?subject={主题}&body={正文}',
    description: '使用默认邮件客户端打开发送邮件窗口。支持设置收件人、主题、正文内容，还可以添加抄送和密送。' ,
    parameters: [
      {
        name: 'email',
        type: 'string',
        required: true,
        description: '收件人邮箱地址'
      },
      {
        name: 'subject',
        type: 'string',
        required: false,
        description: '邮件主题'
      },
      {
        name: 'body',
        type: 'string',
        required: false,
        description: '邮件正文'
      },
      {
        name: 'cc',
        type: 'string',
        required: false,
        description: '抄送地址，多个地址用逗号分隔'
      },
      {
        name: 'bcc',
        type: 'string',
        required: false,
        description: '密送地址，多个地址用逗号分隔'
      }
    ],
    examples: [
      {
        language: 'HTML (基础用法)',
        code: `<!-- 基本邮件链接 -->
<a href="mailto:example@example.com">
    发送邮件
</a>

<!-- 带主题和内容的邮件链接 -->
<a href="mailto:example@example.com?subject=问题反馈&body=你好，我想反馈一个问题...">
    发送反馈邮件
</a>

<!-- 完整示例（包含抄送和密送） -->
<a href="mailto:example@example.com?subject=会议通知&body=亲爱的同事：%0A%0A诚邀您参加...&cc=cc1@example.com,cc2@example.com&bcc=bcc@example.com">
    发送会议通知
</a>`
      },
      {
        language: 'JavaScript',
        code: `// 基础邮件发送函数
function sendEmail(to, subject = '', body = '') {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    window.location.href = \`mailto:\${to}?subject=\${encodedSubject}&body=\${encodedBody}\`;
}

// 高级邮件发送函数（支持抄送和密送）
function sendAdvancedEmail({
    to,
    subject = '',
    body = '',
    cc = [],
    bcc = []
}) {
    const params = new URLSearchParams();
    
    if (subject) params.append('subject', subject);
    if (body) params.append('body', body);
    if (cc.length) params.append('cc', cc.join(','));
    if (bcc.length) params.append('bcc', bcc.join(','));
    
    const mailtoUrl = \`mailto:\${to}?\${params.toString()}\`;
    window.location.href = mailtoUrl;
}

// 使用示例
sendEmail(
    'example@example.com',
    '问题反馈',
    '你好，我想反馈一个问题...'
);

sendAdvancedEmail({
    to: 'example@example.com',
    subject: '会议通知',
    body: '亲爱的同事：\\n\\n诚邀您参加...',
    cc: ['cc1@example.com', 'cc2@example.com'],
    bcc: ['bcc@example.com']
});`
      },
      {
        language: 'React',
        code: `function EmailLink({ 
    to, 
    subject, 
    body,
    children 
}) {
    const encodedSubject = encodeURIComponent(subject || '');
    const encodedBody = encodeURIComponent(body || '');
    const mailtoUrl = \`mailto:\${to}?subject=\${encodedSubject}&body=\${encodedBody}\`;
    
    return (
        <a 
            href={mailtoUrl}
            className="text-blue-500 hover:underline"
        >
            {children || '发送邮件'}
        </a>
    );
}

// 使用示例
<EmailLink
    to="example@example.com"
    subject="网站反馈"
    body="你好我想反馈一个问题... " 
>
    联系我们
</EmailLink>`
      },
      {
        language: 'Vue',
        code: `<!-- 邮件链接组件 -->
<template>
    <a :href="mailtoUrl" class="text-blue-500 hover:underline">
        <slot>发送邮件</slot>
    </a>
</template>

<script>
export default {
    props: {
        to: {
            type: String,
            required: true
        },
        subject: String,
        body: String,
        cc: Array,
        bcc: Array
    },
    computed: {
        mailtoUrl() {
            const params = new URLSearchParams();
            
            if (this.subject) params.append('subject', this.subject);
            if (this.body) params.append('body', this.body);
            if (this.cc?.length) params.append('cc', this.cc.join(','));
            if (this.bcc?.length) params.append('bcc', this.bcc.join(','));
            
            return \`mailto:\${this.to}?\${params.toString()}\`;
        }
    }
}
</script>

<!-- 使用示例 -->
<email-link
    to="example@example.com"
    subject="问题反馈"
    body="你好，我想反馈一个问题..."
    :cc="['cc@example.com']"
>
    联系客服
</email-link>`
      }
    ]
  },
  {
    name: 'QQ群头像获取',
    method: 'GET',
    endpoint: 'http://p.qlogo.cn/gh/{群号}/{群号}/0',
    description: '获取QQ群头像。支持直接获取群头像图片，可用于展示QQ群的头像。',
    parameters: [
      {
        name: 'group_id',
        type: 'string',
        required: true,
        description: 'QQ群号'
      }
    ],
    examples: [
      {
        language: 'HTML',
        code: `<!-- 获取群头像 -->
<img 
    src="http://p.qlogo.cn/gh/群号/群号/0" 
    alt="群头像"
    style="width: 100px; height: 100px;"
/>`
      },
      {
        language: 'React',
        code: `function QQGroupAvatar({ groupId }) {
    return (
        <div className="flex flex-col items-center">
            <img
                src={\`http://p.qlogo.cn/gh/\${groupId}/\${groupId}/0\`}
                alt="群头像"
                className="w-24 h-24 rounded-lg"
            />
            <span className="mt-2 text-sm">群号：{groupId}</span>
        </div>
    );
}

// 使用示例
<QQGroupAvatar groupId="123456789" />`
      },
      {
        language: 'JavaScript',
        code: `// 获取群头像URL
function getGroupAvatarUrl(groupId) {
    return \`http://p.qlogo.cn/gh/\${groupId}/\${groupId}/0\`;
}

// 使用示例
const avatarUrl = getGroupAvatarUrl('123456789');
const img = document.createElement('img');
img.src = avatarUrl;
img.alt = '群头像';
document.body.appendChild(img);`
      }
    ]
  },
  {
    name: '微信头像获取',
    method: 'GET',
    endpoint: 'https://wx.qlogo.cn/mmopen/{用户头URL}', // 需要用户授权
    description: '获取微信用户头像。注意：此接口需要用户的头像URL，通常需要通过微信登录授权后才能获取。',
    parameters: [
      {
        name: 'avatar_url',
        type: 'string',
        required: true,
        description: '用户头像URL，需要通过微信授权登录获取'
      }
    ],
    examples: [
      {
        language: 'HTML',
        code: `<!-- 微信头像示例 -->
<!-- 注意：需要先获取用户授权才能获得头像URL -->
<img 
    src="https://wx.qlogo.cn/mmopen/xxx" 
    alt="微信头像"
    style="width: 100px; height: 100px;"
/>`
      },
      {
        language: 'JavaScript (微信网页授权)',
        code: `// 1. 首先需要进行微信网页授权
// 在微信公众平台配置授权回调域名
const appId = '你的公众号AppID';
const redirectUri = encodeURIComponent('回调地址');
const authUrl = \`https://open.weixin.qq.com/connect/oauth2/authorize?appid=\${appId}&redirect_uri=\${redirectUri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect\`;

// 2. 获取用户信息
async function getWechatUserInfo(code) {
    // 通过code换取access_token
    const response = await fetch('/api/wechat/userinfo?code=' + code);
    const data = await response.json();
    
    if(data.headimgurl) {
        // data.headimgurl 就是用户头像地址
        const avatar = document.createElement('img');
        avatar.src = data.headimgurl;
        avatar.alt = '微信头像';
        document.body.appendChild(avatar);
    }
}`
      },
      {
        language: 'React',
        code: `function WeChatAvatar({ avatarUrl }) {
    return (
        <div className="flex flex-col items-center">
            <img
                src={avatarUrl}
                alt="微信头像"
                className="w-24 h-24 rounded-full"
            />
        </div>
    );
}

// 使用示例（需要先获取用户授权）
<WeChatAvatar avatarUrl="https://wx.qlogo.cn/mmopen/xxx" />`
      }
    ]
  },
  {
    name: '邮箱验证码',
    method: 'POST',
    endpoint: '/api/email/code',
    description: '发送邮箱验证码,支持自定义验证码长度和有效期。验证码将从 1401466869@qq.com 发出。',
    parameters: [
      {
        name: 'email',
        type: 'string',
        required: true,
        description: '接收验证码的邮箱地址'
      },
      {
        name: 'length',
        type: 'number',
        required: false,
        description: '验证码长度,默认6位'
      },
      {
        name: 'expire',
        type: 'number',
        required: false,
        description: '验证码有效期(分钟),默认5分钟'
      }
    ],
    response: {
      success: `{
    "status": "success",
    "message": "验证码已发送",
    "data": {
        "email": "example@example.com",
        "expire": 300
    }
}`,
      error: `{
    "status": "error",
    "message": "发送失败原因"
}`
    },
    examples: [
      {
        language: 'JavaScript (Fetch)',
        code: `// 发送验证码
async function sendVerificationCode(email) {
  try {
    const response = await fetch('/api/email/code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        length: 6,    // 可选
        expire: 5     // 可选,单位分钟
      })
    });
    
    const data = await response.json();
    if(data.status === 'success') {
      alert('✅ 验证码已发送！\n请查收邮件（可能在垃圾邮件中）')
      return true;
    } else {
      console.error(data.message);
      return false;
    }
  } catch(error) {
    console.error('发送失败:', error);
    return false;
  }
}`
      },
      {
        language: 'PHP',
        code: `<?php
// 发送验证码
function sendVerificationCode($email) {
    $data = array(
        'email' => $email,
        'length' => 6,    // 可选
        'expire' => 5     // 可选,单位分钟
    );
    
    $options = array(
        'http' => array(
            'method'  => 'POST',
            'header'  => 'Content-Type: application/json',
            'content' => json_encode($data)
        )
    );
    
    $context = stream_context_create($options);
    $result = file_get_contents(
        '/api/email/code', 
        false,
        $context
    );
    
    if($result === FALSE) {
        return false;
    }
    
    $response = json_decode($result, true);
    return $response['status'] === 'success';
}

// 使用示例
if(sendVerificationCode('test@example.com')) {
    echo "验证码已发送";
} else {
    echo "发送失败";
}
?>`
      },
      {
        language: 'Python',
        code: `import requests

def send_verification_code(email):
    try:
        response = requests.post(
            '/api/email/code',  // 更新为相对路径
            json={
                'email': email,
                'length': 6,    # 可选
                'expire': 5     # 可选,单位分钟
            }
        )
        
        data = response.json()
        if data['status'] == 'success':
            alert('✅ 验证码已发送！\n请查收邮件（可能在垃圾邮件中）')
            return True
        else:
            print('发送失败:', data['message'])
            return False
            
    except Exception as e:
        print('请求错误:', str(e))
        return False

# 使用示例 
send_verification_code('test@example.com')`
      },
      {
        language: 'HTML',
        code: `<!-- 验证码发送示例 -->
<div class="email-verify">
    <input type="email" id="email" placeholder="请输入邮箱">
    <button onclick="sendCode()" id="sendBtn">发送验证码</button>
    <input type="text" id="code" placeholder="请输入验证码">
</div>

<script>
let timer = null;
const countdown = 60;

async function sendCode() {
    const email = document.getElementById('email').value;
    const btn = document.getElementById('sendBtn');
    
    if(!email) {
        alert('请输入邮箱');
        return;
    }
    
    // 禁用按钮
    btn.disabled = true;
    let seconds = countdown;
    
    try {
        const response = await fetch('http://api.[输入你的域名].icu/email/code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if(data.status === 'success') {
            // 开始倒计时
            timer = setInterval(() => {
                btn.textContent = \`\${seconds}秒后重试\`;
                seconds--;
                
                if(seconds < 0) {
                    clearInterval(timer);
                    btn.disabled = false;
                    btn.textContent = '发送验证码';
                }
            }, 1000);
        } else {
            alert(data.message);
            btn.disabled = false;
        }
    } catch(error) {
        alert('发送失败');
        btn.disabled = false;
    }
}
</script>

<style>
.email-verify {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

.email-verify input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.email-verify button {
    padding: 8px 16px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.email-verify button:disabled {
    background: #ccc;
    cursor: not-allowed;
}
</style>`
      }
    ]
  },
  {
    name: '邮箱验证码服务',
    method: 'POST',
    endpoint: 'http://api.mail.[输入你的域名].icu/',
    description: '发送和验证邮箱验证码的服务。支持自定义验证码长度和有效期，验证码将从 H\'s blog circle 官方邮箱发出。',
    parameters: [
      {
        name: 'email',
        type: 'string',
        required: true,
        description: '接收验证码的邮箱地址'
      },
      {
        name: 'length',
        type: 'number',
        required: false,
        description: '验证码长度，默认6位'
      },
      {
        name: 'expire',
        type: 'number',
        required: false,
        description: '验证码有效期(分钟)，默认5分钟'
      }
    ],
    response: {
      success: `{
    "status": "success",
    "message": "验证码已发送",
    "data": {
        "email": "example@domain.com",
        "expire": 300    // 过期时间(秒)
    }
}`,
      error: `{
    "status": "error",
    "message": "错误信息"    // 如：邮箱格式不正确、发送太频繁等
}`
    },
    examples: [
      {
        language: 'JavaScript (Fetch)',
        code: `// 发送验证码
async function sendVerificationCode(email) {
  try {
    const response = await fetch('http://api.mail.[输入你的域名].icu/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'omit',
      mode: 'cors',
      body: JSON.stringify({
        email: email,
        length: 6,
        expire: 5
      })
    });
    
    const data = await response.json();
    if(data.status === 'success') {
      console.log('验证码已发送');
      return true;
    } else {
      console.error(data.message);
      return false;
    }
  } catch(error) {
    console.error('发送失败:', error);
    return false;
  }
}

// 验证验证码
async function verifyCode(email, code) {
  try {
    const response = await fetch('http://http://api.mail.[输入你的域名].icu//api/email/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'omit',
      mode: 'cors',
      body: JSON.stringify({ email, code })
    });
    
    const data = await response.json();
    return data.status === 'success';
  } catch(error) {
    console.error('验证失败:', error);
    return false;
  }
}`
      },
      {
        language: 'Python (requests)',
        code: `import requests

def send_verification_code(email):
    try:
        response = requests.post(
            'http://api.mail.[输入你的域名].icu/',
            json={
                'email': email,
                'length': 6,
                'expire': 5
            },
            headers={
                'X-Requested-With': 'XMLHttpRequest'
            }
        )
        
        data = response.json()
        if data['status'] == 'success':
            print('验证码已发送')
            return True
        else:
            print('发送失败:', data['message'])
            return False
            
    except Exception as e:
        print('请求错误:', str(e))
        return False

def verify_code(email, code):
    try:
        response = requests.post(
            'http://http://api.mail.[输入你的域名].icu//api/email/verify',
            json={
                'email': email,
                'code': code
            },
            headers={
                'X-Requested-With': 'XMLHttpRequest'
            }
        )
        
        data = response.json()
        return data['status'] == 'success'
            
    except Exception as e:
        print('验证失败:', str(e))
        return False

# 使用示例
email = "example@domain.com"
if send_verification_code(email):
    code = input('请输入验证码: ')
    if verify_code(email, code):
        print('验证成功!')
    else:
        print('验证失败')`
      },
      {
        language: 'PHP (cURL)',
        code: `<?php
function send_verification_code($email) {
    $ch = curl_init('http://api.mail.[输入你的域名].icu/');
    
    $data = array(
        'email' => $email,
        'length' => 6,
        'expire' => 5
    );
    
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'X-Requested-With: XMLHttpRequest'
    ));
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    if($response === false) {
        return false;
    }
    
    $result = json_decode($response, true);
    return $result['status'] === 'success';
}

function verify_code($email, $code) {
    $ch = curl_init('http://http://api.mail.[输入你的域名].icu//api/email/verify');
    
    $data = array(
        'email' => $email,
        'code' => $code
    );
    
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'X-Requested-With: XMLHttpRequest'
    ));
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    if($response === false) {
        return false;
    }
    
    $result = json_decode($response, true);
    return $result['status'] === 'success';
}

// 使用示例
$email = "example@domain.com";
if(send_verification_code($email)) {
    echo "验证码已发送\\n";
    $code = readline("请输入验证码: ");
    if(verify_code($email, $code)) {
        echo "验证成功!\\n";
    } else {
        echo "验证失败\\n";
    }
} else {
    echo "发送失败\\n";
}
?>`
      },
      {
        language: 'HTML (完整示例)',
        code: `<!DOCTYPE html>
<html>
<head>
    <title>邮箱验证示例</title>
    <style>
        .container {
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 8px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        input {
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .message {
            margin-top: 10px;
            padding: 10px;
            border-radius: 4px;
        }
        .success { background: #dff0d8; color: #3c763d; }
        .error { background: #f2dede; color: #a94442; }
    </style>
</head>
<body>
    <div class="container">
        <h2>邮箱验证示例</h2>
        <div class="form-group">
            <label>邮箱地址:</label>
            <input type="email" id="email" placeholder="请输入邮箱">
        </div>
        <div class="form-group">
            <button onclick="sendCode()" id="sendBtn">发送验证码</button>
        </div>
        <div class="form-group">
            <label>验证码:</label>
            <input type="text" id="code" placeholder="请输入验证码">
        </div>
        <div class="form-group">
            <button onclick="verifyCode()" id="verifyBtn">验证</button>
        </div>
        <div id="message"></div>
    </div>

    <script>
        let timer = null;
        const countdown = 60;

        async function sendCode() {
            const email = document.getElementById('email').value;
            const btn = document.getElementById('sendBtn');
            const msg = document.getElementById('message');
            
            if(!email) {
                showMessage('请输入邮箱', 'error');
                return;
            }
            
            btn.disabled = true;
            let seconds = countdown;
            
            try {
                const response = await fetch('http://api.mail.[输入你的域名].icu/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                
                if(data.status === 'success') {
                    showMessage('验证码已发送', 'success');
                    timer = setInterval(() => {
                        btn.textContent = \`\${seconds}秒后重试\`;
                        seconds--;
                        
                        if(seconds < 0) {
                            clearInterval(timer);
                            btn.disabled = false;
                            btn.textContent = '发送验证码';
                        }
                    }, 1000);
                } else {
                    showMessage(data.message, 'error');
                    btn.disabled = false;
                }
            } catch(error) {
                showMessage('发送失败', 'error');
                btn.disabled = false;
            }
        }

        async function verifyCode() {
            const email = document.getElementById('email').value;
            const code = document.getElementById('code').value;
            
            if(!email || !code) {
                showMessage('请输入邮箱和验证码', 'error');
                return;
            }
            
            try {
                const response = await fetch('http://http://api.mail.[输入你的域名].icu//api/email/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({ email, code })
                });
                
                const data = await response.json();
                showMessage(data.message, data.status === 'success' ? 'success' : 'error');
            } catch(error) {
                showMessage('验证失败', 'error');
            }
        }

        function showMessage(text, type) {
            const msg = document.getElementById('message');
            msg.textContent = text;
            msg.className = \`message \${type}\`;
        }
    </script>
</body>
</html>`
      }
    ],
    notes: [
      '验证码有效期为5分钟',
      '同一邮箱60秒内不能重复发送',
      '验证码验证成功后立即失效',
      '验证码默认为6位数字',
      '需要正确设置跨域请求头',
      '建议添加适当的错误处理',
      '建议在生产环境使用HTTPS'
    ]
  },
  {
    name: '蓝奏云解析',
    method: 'GET',
    endpoint: 'http://api.[输入你的域名].icu/lanzou/',
    description: '获取蓝奏云外链直链的工具。支持带密码的链接，可选择直接下载或获取信息。',
    parameters: [
      {
        name: 'url',
        type: 'string',
        required: true,
        description: '需要解析的蓝奏云外链地址'
      },
      {
        name: 'pwd',
        type: 'string',
        required: false,
        description: '蓝奏云外链的密码（如果有）'
      },
      {
        name: 'type',
        type: 'string',
        required: false,
        description: '是否直接下载，填写 true 则直接下载'
      }
    ],
    response: {
      success: `{
    "code": 200,
    "msg": "解析成功",
    "name": "示例文件.zip",
    "filesize": "31.6 M",
    "downUrl": "https://download.example.com/xxx"
}`,
      error: `{
    "code": 400,
    "msg": "解析失败原因"
}`
    },
    examples: [
      {
        language: 'JavaScript (Fetch)',
        code: `// 基础解析
async function parseLanzou(url, pwd = '') {
  try {
    const params = new URLSearchParams({ url });
    if (pwd) params.append('pwd', pwd);
    
    const response = await fetch(\`http://api.[输入你的域名].icu/lanzou/?\${params}\`);
    const data = await response.json();
    
    if (data.code === 200) {
      console.log('文件名:', data.name);
      console.log('文件大小:', data.filesize);
      console.log('下载链接:', data.downUrl);
      return data;
    } else {
      throw new Error(data.msg);
    }
  } catch (error) {
    console.error('解析失败:', error);
    return null;
  }
}

// 直接下载
function downloadLanzou(url, pwd = '') {
  const params = new URLSearchParams({ 
    url,
    pwd,
    type: 'true'
  });
  window.location.href = \`http://api.[输入你的域名].icu/lanzou/?\${params}\`;
}`
      },
      {
        language: 'Python (requests)',
        code: `import requests

def parse_lanzou(url: str, pwd: str = None) -> dict:
    """解析蓝奏云链接
    
    Args:
        url: 蓝奏云外链
        pwd: 密码(可选)
        
    Returns:
        解析结果字典
    """
    params = {'url': url}
    if pwd:
        params['pwd'] = pwd
        
    try:
        response = requests.get(
            'http://api.[输入你的域名].icu/lanzou/',
            params=params
        )
        data = response.json()
        
        if data['code'] == 200:
            print(f"文件名: {data['name']}")
            print(f"大小: {data['filesize']}")
            print(f"下载链接: {data['downUrl']}")
            return data
        else:
            print(f"解析失败: {data['msg']}")
            return None
            
    except Exception as e:
        print(f"请求错误: {str(e)}")
        return None

# 使用示例
url = "https://example.lanzoul.com/xxxxx"
pwd = "1234"  # 可选
result = parse_lanzou(url, pwd)`
      },
      {
        language: 'PHP',
        code: `<?php
function parseLanzou($url, $pwd = '') {
    $params = array('url' => $url);
    if ($pwd) {
        $params['pwd'] = $pwd;
    }
    
    $apiUrl = 'http://api.[输入你的域名].icu/lanzou/?' . http_build_query($params);
    
    try {
        $response = file_get_contents($apiUrl);
        $data = json_decode($response, true);
        
        if ($data['code'] == 200) {
            echo "文件名: " . $data['name'] . "\\n";
            echo "大小: " . $data['filesize'] . "\\n";
            echo "下载链接: " . $data['downUrl'] . "\\n";
            return $data;
        } else {
            echo "解析失败: " . $data['msg'] . "\\n";
            return null;
        }
    } catch (Exception $e) {
        echo "请求错误: " . $e->getMessage() . "\\n";
        return null;
    }
}

// 使用示例
$url = "https://example.lanzoul.com/xxxxx";
$pwd = "1234";  // 可选
$result = parseLanzou($url, $pwd);
?>`
      },
      {
        language: 'HTML',
        code: `<!DOCTYPE html>
<html>
<head>
    <title>蓝奏云解析</title>
</head>
<body>
    <div>
        <input type="text" id="url" placeholder="输入蓝奏云链接">
        <input type="text" id="pwd" placeholder="密码(可选)">
        <button onclick="parse()">解析</button>
        <button onclick="download()">直接下载</button>
    </div>
    
    <div id="result"></div>

    <script>
    async function parse() {
        const url = document.getElementById('url').value;
        const pwd = document.getElementById('pwd').value;
        const result = document.getElementById('result');
        
        if (!url) {
            alert('请输入链接');
            return;
        }
        
        try {
            const params = new URLSearchParams({ url });
            if (pwd) params.append('pwd', pwd);
            
            const response = await fetch(
                \`http://api.[输入你的域名].icu/lanzou/?\${params}\`
            );
            const data = await response.json();
            
            if (data.code === 200) {
                result.innerHTML = \`
                    <p>文件名: \${data.name}</p>
                    <p>大小: \${data.filesize}</p>
                    <p>下载链接: <a href="\${data.downUrl}" target="_blank">\${data.downUrl}</a></p>
                \`;
            } else {
                result.innerHTML = \`<p style="color: red">解析失败: \${data.msg}</p>\`;
            }
        } catch (error) {
            result.innerHTML = \`<p style="color: red">请求错误: \${error}</p>\`;
        }
    }
    
    function download() {
        const url = document.getElementById('url').value;
        const pwd = document.getElementById('pwd').value;
        
        if (!url) {
            alert('请输入链接');
            return;
        }
        
        const params = new URLSearchParams({ 
            url,
            type: 'true'
        });
        if (pwd) params.append('pwd', pwd);
        
        window.location.href = \`http://api.[输入你的域名].icu/lanzou/?\${params}\`;
    }
    </script>
</body>
</html>`
      }
    ],
    notes: [
      '支持带密码和不带密码的链接',
      '可以选择直接下载或获取信息',
      '返回的直链有效期较短，建议及时下载',
      '不支持文件夹链接',
      '如遇到解析失败，可能是链接失效或被封禁'
    ]
  }
]

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

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(apiEndpoints[0])
  const [qqNumber, setQqNumber] = useState('')
  const [avatarSize, setAvatarSize] = useState('100')
  const [previewUrl, setPreviewUrl] = useState('')
  const [randomImageKey, setRandomImageKey] = useState(0)
  const [randomQuote, setRandomQuote] = useState<{ status: string; quote?: string; message?: string } | null>(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [groupId, setGroupId] = useState('')
  const [groupAvatar, setGroupAvatar] = useState('')
  const [wechatId, setWechatId] = useState('')
  const [wechatQRCode, setWechatQRCode] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [testEmail, setTestEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [verifyCode, setVerifyCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  // 添加复制成功状态
  const [copySuccess, setCopySuccess] = useState<string>('')
  // 添加方法筛选状态
  const [selectedMethod, setSelectedMethod] = useState<'ALL' | 'GET' | 'POST'>('ALL')
  
  // 筛选 API 列表
  const filteredEndpoints = useMemo(() => {
    if (selectedMethod === 'ALL') return apiEndpoints
    return apiEndpoints.filter(endpoint => endpoint.method === selectedMethod)
  }, [selectedMethod])

  // 添加复制函数
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess('已复制!')
      // 2秒后清除提示
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (err) {
      setCopySuccess('复制失败')
      console.error('复制失败:', err)
    }
  }

  const handlePreviewAvatar = () => {
    if (qqNumber.trim()) {
      setPreviewUrl(`http://q1.qlogo.cn/g?b=qq&nk=${qqNumber}&s=${avatarSize}`)
    }
  }

  const refreshRandomImage = () => {
    setRandomImageKey(prev => prev + 1)
  }

  const getRandomQuote = async () => {
    setIsLoadingQuote(true)
    try {
      const response = await fetch('http://api.[输入你的域名].icu/YIYAN/')
      const data = await response.json()
      setRandomQuote(data)
    } catch (error) {
      setRandomQuote({ status: 'error', message: '获取失败，请重试' })
    } finally {
      setIsLoadingQuote(false)
    }
  }

  const handlePreviewGroupAvatar = () => {
    if (groupId.trim()) {
      setGroupAvatar(`http://p.qlogo.cn/gh/${groupId}/${groupId}/0`)
    }
  }

  const handlePreviewWechatQRCode = () => {
    if (wechatId.trim()) {
      setWechatQRCode(`https://open.weixin.qq.com/qr/code?username=${wechatId}`)
    }
  }

  const handleSendCode = async () => {
    if (!testEmail) {
      alert('请输入邮箱地址')
      return
    }
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/email/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: testEmail })
      })
      
      const data = await response.json()
      if (data.status === 'success') {
        alert('✅ 验证码已发送！\n请查收邮件（可能在垃圾邮件中）')
        // 开始倒计时
        setCountdown(60)
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        alert(data.message || '发送失败')
      }
    } catch (error) {
      console.error('请求错误:', error)
      alert('请求失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!testEmail || !verifyCode) {
      alert('请输入邮箱和验证码')
      return
    }

    setIsVerifying(true)
    try {
      const response = await fetch('/api/email/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testEmail,
          code: verifyCode
        })
      })

      const data = await response.json()
      if (data.status === 'success') {
        alert('✅ 验证成功!')
        setVerifyCode('')
      } else {
        alert(data.message || '验证失败') 
      }
    } catch (error) {
      console.error('验证请求错误:', error)
      alert('验证失败，请稍后重试')
    } finally {
      setIsVerifying(false)
    }
  }

  // 添加滚动到顶部的效果
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [selectedEndpoint]) // 当选择的 API 改变时滚动到顶部

  // 添加代码复制状态管理
  const [copiedExampleId, setCopiedExampleId] = useState<string>('')

  // 复制代码示例
  const copyExample = async (code: string, exampleId: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedExampleId(exampleId)
      // 2秒后清除提示
      setTimeout(() => setCopiedExampleId(''), 2000)
    } catch (err) {
      console.error('复制失败:', err)
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

  return (
    <div className="relative">
      <RandomBackground />
      <div className="relative min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8 text-white">API 文档</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* 左侧导航 */}
            <div className="md:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-white">接口列表</h2>
                
                {/* 添加方法筛选按钮组 */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSelectedMethod('ALL')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedMethod === 'ALL'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => setSelectedMethod('GET')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedMethod === 'GET'
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    GET
                  </button>
                  <button
                    onClick={() => setSelectedMethod('POST')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedMethod === 'POST'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    POST
                  </button>
                </div>

                {/* 显示筛选后的接口列表 */}
                <div className="space-y-2">
                  {selectedMethod !== 'ALL' && (
                    <div className="text-sm text-gray-400 mb-2">
                      显示 {filteredEndpoints.length} 个 {selectedMethod} 接口
                    </div>
                  )}
                  <ul className="space-y-2">
                    {filteredEndpoints.map((endpoint) => (
                      <li key={endpoint.endpoint}>
                        <button
                          onClick={() => setSelectedEndpoint(endpoint)}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                            selectedEndpoint?.endpoint === endpoint.endpoint
                              ? 'bg-blue-500 text-white'
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              endpoint.method === 'GET' ? 'bg-green-500/20 text-green-300' :
                              endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-300' :
                              endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {endpoint.method}
                            </span>
                            <span>{endpoint.name}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 右侧内容 */}
            <div className="md:col-span-3">
              {selectedEndpoint ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${selectedEndpoint.method === 'GET' ? 'bg-green-500' :
                        selectedEndpoint.method === 'POST' ? 'bg-blue-500' :
                        selectedEndpoint.method === 'PUT' ? 'bg-yellow-500' :
                        'bg-red-500'} text-white`}>
                      {selectedEndpoint.method}
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      <code className="text-lg text-white break-all">{selectedEndpoint.endpoint}</code>
                      <button
                        onClick={() => copyToClipboard(selectedEndpoint.endpoint)}
                        className="p-2 hover:bg-white/10 rounded-md transition-colors group relative"
                        title="复制接口地址"
                      >
                        <svg 
                          className="w-5 h-5 text-gray-300 group-hover:text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                          />
                        </svg>
                        {copySuccess && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/75 text-white text-xs rounded whitespace-nowrap">
                            {copySuccess}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">描述</h3>
                      <p className="text-gray-300">{selectedEndpoint.description}</p>
                    </div>

                    {selectedEndpoint.response && (
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-white">响应示例</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-green-400 mb-2">成功响应：</h4>
                            <pre className="bg-black/20 p-4 rounded-lg overflow-x-auto text-white">
                              {selectedEndpoint.response.success}
                            </pre>
                          </div>
                          <div>
                            <h4 className="text-red-400 mb-2">错误响应：</h4>
                            <pre className="bg-black/20 p-4 rounded-lg overflow-x-auto text-white">
                              {selectedEndpoint.response.error}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedEndpoint.examples && (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4 text-white">调用示例</h3>
                        <div className="space-y-6">
                          {selectedEndpoint.examples.map((example, index) => (
                            <details 
                              key={index} 
                              className="bg-black/20 rounded-lg overflow-hidden group"
                            >
                              <summary className="bg-black/30 px-4 py-2 cursor-pointer hover:bg-black/40 transition-colors flex items-center justify-between">
                                <h4 className="text-blue-400">{example.language}</h4>
                                <svg 
                                  className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M19 9l-7 7-7-7" 
                                  />
                                </svg>
                              </summary>
                              <div className="relative">
                                <pre className="p-4 overflow-x-auto text-white">
                                  <code>{example.code}</code>
                                </pre>
                                <button
                                  onClick={() => copyExample(example.code, `${selectedEndpoint.name}-${index}`)}
                                  className="absolute top-2 right-2 p-2 bg-black/40 hover:bg-black/60 rounded-md transition-colors group/copy"
                                  title="复制代码"
                                >
                                  {copiedExampleId === `${selectedEndpoint.name}-${index}` ? (
                                    <svg 
                                      className="w-5 h-5 text-green-400" 
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M5 13l4 4L19 7" 
                                      />
                                    </svg>
                                  ) : (
                                    <svg 
                                      className="w-5 h-5 text-gray-400 group-hover/copy:text-white" 
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                                      />
                                    </svg>
                                  )}
                                  <span className={`absolute -top-8 right-0 px-2 py-1 bg-black/75 text-white text-xs rounded whitespace-nowrap transition-opacity ${
                                    copiedExampleId === `${selectedEndpoint.name}-${index}` ? 'opacity-100' : 'opacity-0'
                                  }`}>
                                    已复制!
                                  </span>
                                </button>
                              </div>
                            </details>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedEndpoint.name === 'QQ头像获取' && (
                      <div className="mt-8 bg-black/20 rounded-lg p-6">
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-4 items-end">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                QQ号码
                              </label>
                              <input
                                type="text"
                                value={qqNumber}
                                onChange={(e) => setQqNumber(e.target.value)}
                                placeholder="输入QQ号码"
                                className="px-3 py-2 bg-black/20 rounded-md text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                头像尺寸
                              </label>
                              <select
                                title="头像尺寸"
                                value={avatarSize}
                                onChange={(e) => setAvatarSize(e.target.value)}
                                className="px-3 py-2 bg-black/20 rounded-md text-white outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="40">小 (40x40)</option>
                                <option value="100">中 (100x100)</option>
                                <option value="640">大 (640x640)</option>
                              </select>
                            </div>
                            <button
                              onClick={handlePreviewAvatar}
                              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                              获取头像
                            </button>
                          </div>
                          
                          {previewUrl && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-300 mb-2">预览：</p> 
                              <div className="flex gap-4 items-center">
                                <img
                                  src={previewUrl}
                                  alt="QQ头像预览"
                                  className="rounded-full bg-black/20"
                                  width={Number(avatarSize)}
                                  height={Number(avatarSize)}
                                />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-300 break-all">
                                    图片地址：
                                    <code className="text-blue-400">{previewUrl}</code>
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedEndpoint.name === '随机背景图片' && (
                      <div className="mt-8 bg-black/20 rounded-lg p-6">
                        <div className="mb-6 bg-blue-500/10 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-500/20 rounded-full p-2">
                              <svg 
                                className="w-6 h-6 text-blue-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-white font-medium">背景图片库</h4>
                              <p className="text-sm text-gray-300">
                                精选优质背景图片，持续更新中
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-400">2000+</div>
                            <div className="text-sm text-gray-300">收录总数</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="relative">
                            <select
                              title="分类筛选"
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="appearance-none px-4 py-2 pr-10 bg-black/20 rounded-md text-white outline-none focus:ring-2 focus:ring-blue-500 hover:bg-black/30 transition-colors cursor-pointer min-w-[160px]"
                            >
                              <option value="" className="bg-gray-900">随机全部</option>
                              {selectedEndpoint.categories?.map((category, index) => (
                                <option 
                                  key={index} 
                                  value={category.endpoint}
                                  className="bg-gray-900"
                                >
                                  {category.name}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                              <svg 
                                className="w-4 h-4" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M19 9l-7 7-7-7" 
                                />
                              </svg>
                            </div>
                          </div>
                          <button
                            onClick={refreshRandomImage}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                          >
                            <svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                              />
                            </svg>
                            刷新图片
                          </button>
                        </div>
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20">
                          <iframe
                            key={randomImageKey}
                            src={selectedCategory || "http://api.[输入你的域名].icu/QB/"}
                            className="absolute inset-0 w-full h-full"
                            style={{ border: 'none' }}
                            title="随机背景预览"
                          />
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                          提示：择分类并点击"刷新图片"按钮获取新的随机背景
                        </p>
                        
                        {selectedEndpoint.categories && (
                          <div className="mt-6">
                            <h3 className="text-xl font-semibold text-white mb-4">可用背景分类</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedEndpoint.categories.map((category, index) => (
                                <div 
                                  key={index} 
                                  className={`bg-black/20 p-4 rounded-lg cursor-pointer transition-colors ${
                                    selectedCategory === category.endpoint ? 'ring-2 ring-blue-500' : ''
                                  }`}
                                  onClick={() => setSelectedCategory(category.endpoint)}
                                >
                                  <h4 className="text-blue-400 font-medium mb-2">{category.name}</h4>
                                  <code className="text-sm text-gray-300 break-all">
                                    {category.endpoint}
                                  </code>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedEndpoint.name === '随机励志语录' && (
                      <div className="mt-8 bg-black/20 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-white">在线预览</h3>
                          <button
                            onClick={getRandomQuote}
                            disabled={isLoadingQuote}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 ${
                              isLoadingQuote ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {isLoadingQuote ? (
                              <>
                                <svg 
                                  className="w-4 h-4 animate-spin" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <circle 
                                    className="opacity-25" 
                                    cx="12" 
                                    cy="12" 
                                    r="10" 
                                    stroke="currentColor" 
                                    strokeWidth="4"
                                  />
                                  <path 
                                    className="opacity-75" 
                                    fill="currentColor" 
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                获取中...
                              </>
                            ) : (
                              <>
                                <svg 
                                  className="w-4 h-4" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                                  />
                                </svg>
                                获取新语录
                              </>
                            )}
                          </button>
                        </div>
                        <div className="bg-black/20 rounded-lg p-6">
                          {randomQuote ? (
                            randomQuote.status === 'success' ? (
                              <div className="flex flex-col items-center text-center">
                                <svg 
                                  className="w-8 h-8 text-blue-400 mb-4" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                                  />
                                </svg>
                                <p className="text-xl text-white font-medium">
                                  {randomQuote.quote}
                                </p>
                              </div>
                            ) : (
                              <div className="text-center text-red-400">
                                {randomQuote.message}
                              </div>
                            )
                          ) : (
                            <div className="text-center text-gray-400">
                              点击上方按钮获取随机励志语录
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                          提示：点击"获取新语录"按钮获取新的随机语录
                        </p>
                      </div>
                    )}

                    {selectedEndpoint.name === 'QQ头像获取' && (
                      <div className="mt-8 bg-black/20 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">在线预览</h3>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-4 items-end">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                QQ群号
                              </label>
                              <input
                                type="text"
                                value={groupId}
                                onChange={(e) => setGroupId(e.target.value)}
                                placeholder="输入QQ群号"
                                className="px-3 py-2 bg-black/20 rounded-md text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <button
                              onClick={handlePreviewGroupAvatar}
                              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                              获取群头像
                            </button>
                          </div>
                          
                          {groupAvatar && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-300 mb-2">预览：</p>
                              <div className="flex gap-4 items-center">
                                <img
                                  src={groupAvatar}
                                  alt="QQ群头像预览"
                                  className="rounded-lg bg-black/20"
                                  width={100}
                                  height={100}
                                  onError={(e) => {
                                    e.currentTarget.src = '/default-group-avatar.png' // 设置默认头像
                                  }}
                                />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-300 break-all">
                                    图片地址：
                                    <code className="text-blue-400">{groupAvatar}</code>
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedEndpoint.name === '微信头像获取' && (
                      <div className="mt-8 bg-black/20 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">使用说明</h3>
                        <div className="space-y-4">
                          <div className="bg-yellow-500/20 p-4 rounded-lg">
                            <p className="text-yellow-300">
                              <svg 
                                className="w-5 h-5 inline-block mr-2" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                  />
                                </svg>
                              重要提示：获取微信用户头像需要以下步骤：
                            </p>
                            <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                              <li>配置微信公众平台的网页授权域名</li>
                              <li>获取用户授权同意</li>
                              <li>通过授权获取用户信息（包含头像URL）</li>
                              <li>使用获取到的头像URL显示头像</li>
                            </ul>
                            </div>
                          
                          <div className="bg-blue-500/20 p-4 rounded-lg">
                            <h4 className="text-blue-300 font-medium mb-2">开发流程：</h4>
                            <ol className="list-decimal list-inside text-gray-300 space-y-1">
                              <li>在微信公众平台配置授权回调域名</li>
                              <li>引导用户进行微信授权</li> 
                              <li>获取授权code</li>
                              <li>使用code换取access_token</li>
                              <li>使用access_token获取用户信息</li>
                              <li>从用户信息中获取头像URL</li>
                            </ol>
                          </div>

                          <div className="bg-green-500/20 p-4 rounded-lg">
                            <h4 className="text-green-300 font-medium mb-2">相关文档：</h4>
                            <ul className="text-gray-300 space-y-1">
                              <li>
                                <a 
                                  href="https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html" 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:underline"
                                >
                                  微信网页授权文档
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedEndpoint.name === '邮箱验证码' && (
                      <div className="mt-8 bg-black/20 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">在线试用</h3>
                        <div className="space-y-6">
                          <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                              测试邮箱
                            </label>
                            <div className="flex gap-4">
                              <input
                                type="email"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                placeholder="请输入接收验证码的邮箱"
                                className="flex-1 px-3 py-2 bg-black/20 rounded-md text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                onClick={handleSendCode}
                                disabled={isLoading || countdown > 0}
                                className={`px-6 py-2 rounded-md text-white transition-all ${
                                  isLoading || countdown > 0
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                              >
                                {isLoading 
                                  ? '发送中...' 
                                  : countdown > 0 
                                    ? `${countdown}秒后重试` 
                                    : '发送验证码'}
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                              验证码
                            </label>
                            <div className="flex gap-4">
                              <input
                                type="text"
                                value={verifyCode}
                                onChange={(e) => setVerifyCode(e.target.value)}
                                placeholder="请输入收到的验证码"
                                className="flex-1 px-3 py-2 bg-black/20 rounded-md text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                onClick={handleVerifyCode}
                                disabled={isVerifying || !verifyCode}
                                className={`px-6 py-2 rounded-md text-white transition-all ${
                                  isVerifying || !verifyCode
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600'
                                }`}
                              >
                                {isVerifying ? '验证中...' : '验证'}
                              </button>
                            </div>
                          </div>

                          <div className="bg-green-500/20 p-4 rounded-lg">
                            <h4 className="text-green-300 font-medium mb-2">使用说明：</h4>
                            <ul className="text-gray-300 space-y-1 list-disc list-inside">
                              <li>输入您的邮箱地址进行测试</li>
                              <li>验证码将从 管理员QQ邮箱 发出</li>
                              <li>每个邮箱每分钟只能发送一次验证码</li>
                              <li>验证码有效期为5分钟</li>
                            </ul>
                          </div>

                          <div className="bg-blue-500/20 p-4 rounded-lg">
                            <h4 className="text-blue-300 font-medium mb-2">接口特点：</h4>
                            <ul className="text-gray-300 space-y-1 list-disc list-inside">
                              <li>支持自定义验证码长度</li>
                              <li>支持自定义有效期</li>
                              <li>内置频率限制保护</li>
                              <li>异步发送，响应迅速</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                  <p className="text-xl text-gray-300">👈 请从左侧选择一个API接口查看详情</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 