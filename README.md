# 周深粉丝网站 - 第四版

这是一个基于 HTML + CSS + JavaScript 的单页应用程序(SPA)，用于展示周深的相关信息。

## 功能特点

- 单页应用架构，页面切换流畅
- 响应式设计，适配不同设备屏幕
- 淡星空蓝色主题，视觉舒适
- 包含首页、音乐、视频三个主要页面
- 文件上传功能，支持上传音乐和视频到Supabase

## 技术栈

- HTML5
- CSS3 (含渐变、动画效果)
- JavaScript ES6 模块化
- Supabase (用于存储和数据库)
- 客户端路由系统
- Vercel 部署支持

## 本地开发

### 环境要求

- Node.js (推荐 v14 或更高版本)
- npm 或 yarn 包管理器

### 安装依赖

\```bash
npm install
\```

### 启动开发服务器

\```bash
npm run dev
\```

这将在 http://localhost:3000 启动开发服务器，并具备热重载功能。

如果没有安装 live-server，可以全局安装：

\```bash
npm install -g live-server
\```

或者使用其他静态服务器工具打开 index.html 文件。

## 部署

### Vercel 部署

此项目已配置好 [Vercel](https://vercel.com) 部署支持，只需连接 GitHub 仓库即可自动部署。

### 手动部署

将所有文件上传到支持静态网站托管的服务商即可，如：
- GitHub Pages
- Netlify
- 传统 Web 服务器

## 文件上传功能

网站包含文件上传功能，可以通过访问 `/#/admin` 进入上传界面：

1. 支持上传音乐文件到Supabase存储桶 `music`
2. 支持上传视频文件到Supabase存储桶 `videos`
3. 上传的文件信息会保存到对应的数据库表中

## 数据库设置

为了使文件上传功能正常工作，您需要在 Supabase 中创建必要的数据库表。

详细说明请查看 [DATABASE_SETUP.md](DATABASE_SETUP.md) 文件。

## 项目结构

\```
.
├── index.html          # 主页面
├── DATABASE_SETUP.md   # 数据库设置指南
├── src/
│   ├── main.js         # 应用入口文件
│   ├── router.js       # 路由管理
│   ├── styles/
│   │   └── main.css    # 样式文件
│   ├── pages/          # 页面组件
│   │   ├── home.js
│   │   ├── music.js
│   │   ├── video.js
│   │   └── admin.js    # 文件上传页面
│   └── utils/          # 工具函数
│       ├── supabase.js # Supabase配置
│       └── uploader.js # 文件上传工具
├── package.json        # 项目配置
└── vercel.json         # Vercel 部署配置
\```

## 后续计划

- 集成 Supabase 实现内容管理
- 添加更多页面和功能
- 优化响应式设计
- 增加交互功能和动画效果
- 添加管理员认证系统