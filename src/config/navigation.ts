export interface NavItem {
  title: string
  href: string
  description?: string
  isAdmin?: boolean
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const navigationConfig: NavSection[] = [
  {
    title: "主要导航",
    items: [
      {
        title: "首页",
        href: "/",
        description: "网站主页，展示最新内容和功能概览"
      },
      {
        title: "文章",
        href: "/posts",
        description: "浏览所有技术文章和教程"
      },
      {
        title: "归档",
        href: "/archive",
        description: "按时间归档的所有文章"
      },
      {
        title: "工具",
        href: "/tools",
        description: "实用的在线开发工具集合"
      },
      {
        title: "公告",
        href: "/announcements",
        description: "网站公告和更新信息"
      },
      {
        title: "说说",
        href: "/talks",
        description: "分享日常想法和心得"
      },
      {
        title: "关于",
        href: "/about",
        description: "关于网站和作者的介绍"
      },
      {
        title: "联系",
        href: "/contact",
        description: "联系方式和反馈渠道"
      },
      {
        title: "聊天室",
        href: "/chat",
        description: "实时聊天互动空间"
      },
      {
        title: "留言板",
        href: "/messages",
        description: "访客留言和互动区域"
      },
      {
        title: "API文档",
        href: "/api-docs",
        description: "查看所有可用的 API 接口文档"
      },
      {
        title: "友情链接",
        href: "/friends",
        description: "友情站点和推荐链接"
      },
      {
        title: "资源下载",
        href: "/resources",
        description: "软件和学习资源下载"
      },
      {
        title: "管理后台",
        href: "/admin",
        description: "网站管理和内容维护"
      }
    ]
  }
] 