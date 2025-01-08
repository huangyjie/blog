# Blog Circle

[![GitHub license](https://img.shields.io/github/license/huangyjie/blog)](https://github.com/huangyjie/blog/blob/main/LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Next.js Version](https://img.shields.io/badge/next.js-14.0.0-blue)](https://nextjs.org)

一个基于 Next.js 14 构建的现代化个人博客系统，集成了丰富的工具集和AI助手功能。

## ✨ 特点

### 🎨 现代化UI设计
- 响应式布局与流畅动画
- 深色/浅色主题切换
- 移动端完美适配
- 优雅的交互体验

### 🛠 强大的工具集
- 代码格式化与高亮
- 图片压缩处理
- 文本加解密工具
- JSON/Base64转换
- 二维码生成器
- IP地址查询
- 颜色选择器
- 正则表达式测试

### 🤖 AI助手集成
- 智能对话交互
- 代码生成优化
- 文本内容润色
- 问题解答辅助

### 📝 内容管理
- Markdown编辑器
- 文章分类管理
- 评论系统
- 全文搜索
- 公告系统
- 访问统计

## 🚀 快速开始

### 环境要求
- Node.js ≥ 18.0.0
- MySQL ≥ 5.7
- npm 或 yarn

### 安装步骤

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
```

4. 修改配置文件
```env
# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=blog
DB_PORT=3306

# AI配置
OPENAI_API_KEY=your-key
OPENAI_API_URL=https://api.openai.com

# 认证配置
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

5. 初始化数据库
```bash
npm run init-db
```

6. 启动开发服务器
```bash
npm run dev
```

## 📦 项目结构

```
blog/
├── src/                # 源代码目录
│   ├── app/           # 页面文件
│   ├── components/    # 组件
│   ├── config/        # 配置文件
│   ├── hooks/         # 自定义Hooks
│   ├── lib/           # 工具函数
│   ├── styles/        # 样式文件
│   └── types/         # TS类型
├── public/            # 静态资源
├── prisma/            # 数据库模型
└── scripts/           # 脚本文件
```

## 🔧 开发命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 代码检查
- `npm run test` - 运行测试

## 🌐 浏览器支持

- Chrome (最新3个版本)
- Firefox (最新3个版本)
- Safari (最新2个版本)
- Edge (最新3个版本)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 开发规范
- 遵循 ESLint 规则
- 编写单元测试
- 保持代码整洁
- 提供详细的提交信息

## 📝 更新日志

### v1.0.0 (2024-01-08)
- 🎉 首次发布
- ✨ 实现核心功能
- 🤖 集成AI助手
- 🛠 完善工具箱
- 🚀 性能优化

## ⭐ 待办事项

- [ ] 评论系统集成
- [ ] 移动端优化
- [ ] 工具箱扩展
- [ ] 文档完善
- [ ] 单元测试
- [ ] 首屏加载优化
- [ ] 多语言支持

## 📄 开源协议

本项目基于 MIT 协议开源 - 查看 [LICENSE](LICENSE) 了解更多信息

## 🙏 致谢

感谢以下开源项目：
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [Framer Motion](https://www.framer.com/motion/)
- [SWR](https://swr.vercel.app/)

## 📮 联系方式

- 作者：huangyjie
- 邮箱：huangyujeiyo@gmail.com
- 博客：[hsblogk.icu](https://hsblogk.icu)
- GitHub：[@huangyjie](https://github.com/huangyjie) 
