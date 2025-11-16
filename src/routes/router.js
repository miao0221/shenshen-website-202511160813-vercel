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
        
        // 确保DOM加载完成后再绑定事件
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindNavigationEvents();
            });
        } else {
            // DOM已经加载完成
            this.bindNavigationEvents();
        }

        // 处理浏览器前进后退按钮
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname);
        });

        // 加载初始页面
        const initialRoute = window.location.pathname === '/' ? DEFAULT_ROUTE : window.location.pathname;
        this.navigate(initialRoute, false);
    }

    /**
     * 绑定导航事件
     */
    bindNavigationEvents() {
        // 使用事件委托，绑定到document上
        document.addEventListener('click', (e) => {
            // 检查点击的元素或其父元素是否有data-route属性
            const navLink = e.target.closest('[data-route]');
            if (navLink) {
                e.preventDefault();
                const route = navLink.getAttribute('data-route');
                this.navigate(route);
            }
        });
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
                    // 使用setTimeout确保DOM更新完成后再执行afterRender
                    setTimeout(() => {
                        page.afterRender();
                    }, 0);
                }
            } else {
                throw new Error(`页面模块格式错误: ${path}`);
            }
            
            // 更新浏览器历史记录
            if (addToHistory) {
                window.history.pushState({}, '', path);
            }
            
            // 更新导航链接激活状态
            this.updateActiveLinks(path);
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
    
    /**
     * 更新导航链接的激活状态
     * @param {string} path - 当前路径
     */
    updateActiveLinks(path) {
        // 移除所有激活状态
        document.querySelectorAll('[data-route]').forEach(link => {
            link.classList.remove('active');
        });
        
        // 为当前路径添加激活状态
        const activeLink = document.querySelector(`[data-route="${path}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// 导出路由器实例
export const router = new Router();

// 将路由器实例添加到全局window对象，方便在其他地方使用
window.router = router;