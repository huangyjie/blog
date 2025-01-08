Blog Circle
===========

一个基于 Next.js 14 构建的现代化个人博客系统，集成了丰富的工具集和AI助手功能。

[预览图片]

主要特性
-------
✨ 核心功能
• 响应式UI设计与流畅动画
• 深色/浅色主题切换
• 移动端完美适配
• 内置管理后台系统
• AI智能助手对话
• Markdown文章编辑
• 实时聊天室
• 公告系统管理
• 访问数据统计

🛠 在线工具箱
• 代码格式化与高亮
• 图片压缩处理
• 文本加解密工具
• JSON/Base64转换
• 二维码生成器
• IP地址查询
• 颜色选择器
• 正则表达式测试

技术栈
------
• 框架: Next.js 14 + React 18
• 语言: TypeScript
• 样式: Tailwind CSS
• 数据库: MySQL + Prisma
• 状态管理: SWR
• 动画: Framer Motion
• 部署: PM2 + Nginx

快速开始
-------
1. 克隆项目
   ```bash
   git clone https://github.com/huangyjie/blog.git
   cd blog
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 环境配置
   ```bash
   cp .env.example .env
   # 编辑 .env 文件配置数据库等信息
   ```

4. 开发运行
   ```bash
   npm run dev
   ```

5. 生产构建
   ```bash
   npm run build
   npm run start
   ```

环境要求
-------
• Node.js ≥ 18.0.0
• MySQL ≥ 5.7
• 现代浏览器支持

项目结构
-------
```
src/
├── app/                # 页面文件
├── components/         # 组件
│   ├── admin/         # 管理后台
│   ├── layout/        # 布局
│   └── ui/            # 通用UI
├── config/            # 配置
├── hooks/             # 自定义Hooks
├── lib/              # 工具函数
├── styles/           # 样式
└── types/            # TS类型
```

核心功能
-------
1. 博客系统
   • Markdown编辑器
   • 文章分类管理
   • 评论系统
   • 全文搜索

2. 管理后台
   • 用户权限管理
   • 内容审核发布
   • 系统配置管理
   • 数据统计分析

3. AI助手
   • 智能对话交互
   • 代码生成优化
   • 文本内容润色
   • 问题解答辅助

配置说明
-------
1. 数据库配置
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your-password
   DB_NAME=blog
   DB_PORT=3306
   ```

2. AI配置
   ```env
   OPENAI_API_KEY=your-key
   OPENAI_API_URL=https://api.openai.com
   ```

3. 认证配置
   ```env
   NEXTAUTH_SECRET=your-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

开发命令
-------
• npm run dev    - 开发环境
• npm run build  - 生产构建
• npm run start  - 生产运行
• npm run lint   - 代码检查
• npm run test   - 单元测试

部署指南
-------
详细部署步骤请参考 [DEPLOY.md](./DEPLOY.md)

贡献指南
-------
1. Fork 本仓库
2. 创建特性分支 (git checkout -b feature/AmazingFeature)
3. 提交更改 (git commit -m 'Add AmazingFeature')
4. 推送分支 (git push origin feature/AmazingFeature)
5. 创建 Pull Request

浏览器支持
---------
• Chrome (最新3个版本)
• Firefox (最新3个版本)
• Safari (最新2个版本)
• Edge (最新3个版本)

更新日志
-------
v1.0.0 (2024-01-08)
• 首次发布
• 实现核心功能
• 集成AI助手
• 完善工具箱
• 优化性能

待办事项
-------
[ ] 评论系统集成
[ ] 移动端优化
[ ] 工具箱扩展
[ ] 文档完善
[ ] 单元测试
[ ] 首屏加载优化
[ ] 多语言支持

联系方式
-------
• Email: huangyujeiyo@gmail.com
• Blog: hsblogk.icu
• GitHub: https://github.com/huangyjie

许可证
------
MIT License

致谢
----
感谢以下开源项目:
• Next.js
• React
• Tailwind CSS
• Prisma
• Framer Motion
• SWR 
