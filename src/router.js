class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
    }

    register(path, handler) {
        this.routes[path] = handler;
    }

    async navigate(path) {
        // 更新URL但不刷新页面
        history.pushState({}, '', path === '/' ? '#' : `#${path}`);
        await this.handleRoute();
    }

    async handleRoute() {
        // 获取当前hash值
        const hash = window.location.hash.slice(1) || '/';
        
        // 如果路由不存在，重定向到首页
        if (!this.routes[hash]) {
            this.navigate('/');
            return;
        }

        // 更新导航链接的激活状态
        this.updateNavLinks(hash);

        // 渲染新页面
        const appElement = document.getElementById('app');
        if (appElement && this.routes[hash]) {
            // 显示加载状态
            appElement.innerHTML = '<div class="loading">加载中...</div>';
            
            // 添加微任务延迟，确保DOM更新完成
            await Promise.resolve();
            
            // 渲染页面内容
            const pageContent = await this.routes[hash]();
            appElement.innerHTML = pageContent;
            
            // 执行页面渲染后的回调
            if (typeof this.afterRender === 'function') {
                this.afterRender();
            }
        }
        
        this.currentRoute = hash;
    }

    updateNavLinks(activePath) {
        document.querySelectorAll('.nav-link').forEach(link => {
            const route = link.getAttribute('data-route');
            if (route === activePath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setAfterRender(callback) {
        this.afterRender = callback;
    }
}

export const router = new Router();