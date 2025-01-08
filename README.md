H's Blog Circle

一个基于 Next.js 14 构建的现代化个人博客系统。

特性
=====
• 优雅的UI设计与动画效果
• 支持深色/浅色主题切换  
• 完美适配移动端
• 内置管理后台
• 集成AI助手对话
• 支持文章发布与管理
• 丰富的在线工具集
• 实时聊天室功能
• 公告系统
• 友情链接
• 访问统计
• 性能优化

技术栈
=====
• Next.js 14
• React 18
• TypeScript
• Tailwind CSS
• MySQL
• Prisma
• SWR
• Framer Motion

环境要求
=======
• Node.js 18.0.0 或更高版本
• MySQL 5.7 或更高版本
• 现代浏览器支持

安装步骤
=======
1. 克隆项目
   git clone https://github.com/huangyuanyin/hyy-blog.git
   cd hyy-blog

2. 安装依赖
   npm install
   或
   yarn

3. 配置环境变量
   复制 .env.example 到 .env.local 并填写以下配置:
   DATABASE_URL="mysql://user:password@localhost:3306/blog"
   NEXTAUTH_SECRET="your-secret"
   OPENAI_API_KEY="your-api-key"

4. 初始化数据库
   npm run init-db

5. 导入示例数据(可选)
   npm run import-data

6. 启动开发服务器
   npm run dev

开发命令
=======
• npm run dev - 启动开发服务器
• npm run build - 构建生产版本
• npm run start - 启动生产服务器
• npm run lint - 运行代码检查
• npm run init-db - 初始化数据库
• npm run import-data - 导入示例数据

配置说明
=======
数据库配置(.env):
DB_HOST=localhost
DB_USER=root 
DB_PASSWORD=your-password
DB_NAME=blog
DB_PORT=3306

AI助手配置(.env):
OPENAI_API_KEY=your-key
OPENAI_API_URL=https://api.openai.com

其他配置:
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

项目结构
=======
src/
  ├── app/                # 页面文件
  ├── components/         # 组件
  │   ├── admin/         # 管理后台组件
  │   ├── layout/        # 布局组件
  │   └── ui/            # UI组件
  ├── config/            # 配置文件
  ├── hooks/             # 自定义Hooks
  ├── lib/              # 工具函数
  ├── styles/           # 样式文件
  └── types/            # TypeScript类型
public/                 # 静态资源
prisma/                # Prisma配置
scripts/               # 脚本文件

功能模块
=======
博客文章:
• Markdown编辑器
• 文章分类管理
• 评论系统
• 文章搜索

在线工具箱:
• 代码格式化
• 图片处理工具
• 文本加解密
• JSON格式化
• Base64转换
• 二维码生成
• Markdown编辑器
• IP地址查询
• 颜色选择器
• 正则表达式测试

管理后台:
• 用户管理 
• 内容管理
• 系统设置
• 数据统计
• 公告管理
• 友链管理

AI助手:
• 智能对话
• 代码生成
• 文本润色
• 问题解答

部署说明
=======
1. 构建项目
   npm run build

2. 启动服务
   npm run start

3. 使用PM2部署(推荐)
   pm2 start npm --name "blog" -- start

4. Nginx配置示例:
   location / {
     proxy_pass http://localhost:3000;
     proxy_set_header Host $host;
     proxy_set_header X-Real-IP $remote_addr;
   }

License
=======
MIT

贡献指南
=======
1. Fork 本仓库
2. 创建新的分支: git checkout -b feature/AmazingFeature
3. 提交你的更改: git commit -m 'Add some AmazingFeature'
4. 推送到分支: git push origin feature/AmazingFeature
5. 提交 Pull Request

联系方式
=======
Email: huangyujeiyo@gmail.com
Blog: hsblogk.icu
GitHub: https://github.com/huangyuanyin

致谢
====
感谢以下开源项目:
• Next.js
• React
• Tailwind CSS
• Prisma
• Framer Motion
• SWR

更新日志
=======
[1.0.0] - 2025-01-08
• 首次发布
• 实现基础博客功能
• 添加在线工具箱
• 集成AI助手
• 完善管理后台

常见问题
=======
Q: 如何更新数据库架构?
A: 运行命令 npm run init-db

Q: 如何备份数据?
A: 运行命令 npm run import-data

Q: 如何修改主题样式?
A: 编辑 tailwind.config.js 文件

Q: 如何添加新的工具?
A: 在 src/app/tools 目录下添加新的工具页面

安全说明
=======
• 请勿在代码中硬编码敏感信息
• 定期更新依赖包版本
• 使用环境变量存储密钥
• 开启数据库访问限制
• 配置合适的CORS策略

浏览器支持
=========
• Chrome (最新3个版本)
• Firefox (最新3个版本)
• Safari (最新2个版本)
• Edge (最新3个版本)

待办事项
=======
• 添加评论系统
• 优化移动端体验
• 增加更多工具
• 完善文档
• 添加单元测试
• 优化首屏加载速度
• 添加数据导出功能
• 实现多语言支持
