# 周深粉丝网站 (第四版)

这是一个现代化的周深粉丝网站，基于HTML+CSS+JavaScript + Supabase后端构建，使用GitHub + Vercel进行部署。

## 项目特点

- 单页应用(SPA)架构
- 模块化设计，易于维护和扩展
- 响应式布局，适配各种设备
- 懒加载策略，提升性能体验
- 使用Supabase作为后端服务

## 技术栈

- 前端: HTML5, CSS3, JavaScript (ES6+)
- 模块化: ES6 Modules
- 构建工具: Webpack
- 后端服务: Supabase
- 部署: GitHub + Vercel

## 目录结构

```
src/
├── assets/           # 静态资源
│   ├── css/          # 样式文件
│   └── js/           # JavaScript文件
├── components/       # 可复用组件
├── pages/            # 页面模块
├── routes/           # 路由管理
└── utils/            # 工具函数
```

## 页面模块

1. 首页 (Home)
2. 音乐 (Music)
3. 视频 (Videos)
4. 管理员面板 (Admin)
5. 登录/注册 (Login/Register)

## 安装和运行

1. 安装依赖:
   ```
   npm install
   ```

2. 开发模式运行:
   ```
   npm run dev
   ```

3. 生产环境构建:
   ```
   npm run build
   ```

## 部署

项目可通过Vercel自动部署，只需推送到GitHub仓库即可。

## 主题配色

- 主色调: 淡星空蓝 (#3b82f6)
- 辅助色: 深蓝 (#1e3a8a)、中蓝 (#60a5fa)、浅蓝 (#93c5fd)
- 背景色: 很浅的蓝色 (#f0f9ff)

## 功能亮点

- 按路由模块拆分代码，实现按需加载
- 图片和媒体内容懒加载
- 加载状态反馈和性能监控
- 管理员面板包含文件管理和音视频上传功能