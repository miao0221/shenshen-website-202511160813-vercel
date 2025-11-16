import { Home } from './pages/home.js';
import { Music } from './pages/music.js';
import { Videos } from './pages/videos.js';
import { Navbar } from './components/navbar.js';

export class Router {
    constructor() {
        this.routes = {
            '/': new Home(),
            '/home': new Home(),
            '/music': new Music(),
            '/videos': new Videos()
        };
        
        this.currentRoute = null;
    }
    
    init() {
        // 处理浏览器前进后退
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname, false);
        });
        
        // 初始加载
        this.navigate(window.location.pathname || '/', false);
    }
    
    async navigate(path, pushState = true) {
        // 移除开头的斜杠以匹配路由
        const normalizedPath = path.startsWith('/') ? path : '/' + path;
        
        // 如果路由不存在，默认跳转到首页
        const page = this.routes[normalizedPath] || this.routes['/'];
        
        if (pushState) {
            history.pushState(null, '', normalizedPath);
        }
        
        // 重新渲染导航栏
        const navbar = new Navbar();
        navbar.render();
        
        // 渲染页面
        await page.render();
        this.currentRoute = normalizedPath;
    }
}

// 创建全局路由器实例
export const router = new Router();