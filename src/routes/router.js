// 路由映射表
const routes = {
    '/': () => import('../pages/home.js'),
    '/music': () => import('../pages/music.js'),
    '/videos': () => import('../pages/videos.js'),
    '/admin': () => import('../pages/admin.js'),
    '/login': () => import('../pages/login.js'),
    '/register': () => import('../pages/register.js')
};

// 默认路由
const DEFAULT_ROUTE = '/';

class Router {
    constructor() {
        this.routes = routes;
    }

    /**
     * 初始化路由器
     */
    init() {
        console.log('初始化路由器...');
        
        // 绑定导航链接事件
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('[data-route]');
            if (navLink) {
                e.preventDefault();
                const route = navLink.getAttribute('data-route');
                this.navigate(route);
            }
        });

        // 加载初始页面
        const initialRoute = window.location.pathname === '/' ? DEFAULT_ROUTE : window.location.pathname;
        this.navigate(initialRoute, false);
    }

    /**
     * 导航到指定路径
     * @param {string} path - 目标路径
     * @param {boolean} addToHistory - 是否添加到浏览器历史记录
     */
    async navigate(path, addToHistory = true) {
        console.log(`导航到: ${path}`);
        
        // 显示加载状态
        this.showLoading(true);
        
        try {
            // 获取路由处理函数
            const routeHandler = this.routes[path] || this.routes[DEFAULT_ROUTE];
            
            if (!routeHandler) {
                throw new Error(`找不到路由处理器: ${path}`);
            }
            
            // 动态导入页面模块
            const module = await routeHandler();
            const page = module.default;
            
            // 渲染页面
            const pageContainer = document.getElementById('page-container');
            if (pageContainer && typeof page.render === 'function') {
                pageContainer.innerHTML = page.render();
                
                // 如果页面有afterRender方法，则执行
                if (typeof page.afterRender === 'function') {
                    page.afterRender();
                }
            } else {
                throw new Error(`页面模块格式错误: ${path}`);
            }
            
            // 更新浏览器历史记录
            if (addToHistory) {
                window.history.pushState({}, '', path);
            }
        } catch (error) {
            console.error('路由导航出错:', error);
            const pageContainer = document.getElementById('page-container');
            if (pageContainer) {
                pageContainer.innerHTML = `<div class="error-page"><h2>页面加载失败</h2><p>${error.message}</p></div>`;
            }
        } finally {
            // 隐藏加载状态
            this.showLoading(false);
        }
    }
    
    /**
     * 显示或隐藏加载状态
     * @param {boolean} show - 是否显示加载状态
     */
    showLoading(show) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            if (show) {
                loadingElement.classList.remove('hidden');
            } else {
                loadingElement.classList.add('hidden');
            }
        }
    }
}

// 导出路由器实例
export const router = new Router();