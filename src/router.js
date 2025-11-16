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
            try {
                // 显示加载状态
                appElement.innerHTML = '<div class="loading">加载中...</div>';
                
                // 添加微任务延迟，确保DOM更新完成
                await Promise.resolve();
                
                // 渲染页面内容
                let pageContent;
                if (this.routes[hash].constructor.name === 'AsyncFunction') {
                    pageContent = await this.routes[hash]();
                } else {
                    pageContent = this.routes[hash]();
                }
                
                appElement.innerHTML = pageContent;
                
                // 执行页面渲染后的回调
                if (typeof this.afterRender === 'function') {
                    this.afterRender();
                }
                
                // 更新用户登录状态显示
                await this.updateAuthStatus();
            } catch (error) {
                console.error('页面渲染错误:', error);
                appElement.innerHTML = '<div class="error">页面加载失败</div>';
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

    async updateAuthStatus() {
        try {
            const { data: { session } } = await window.supabaseClient.auth.getSession();
            const profileLinkItem = document.getElementById('profile-link-item');
            
            if (session) {
                // 用户已登录，显示个人中心链接
                if (profileLinkItem) {
                    profileLinkItem.style.display = 'list-item';
                }
            } else {
                // 用户未登录，隐藏个人中心链接
                if (profileLinkItem) {
                    profileLinkItem.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('更新认证状态时出错:', error);
        }
    }

    setAfterRender(callback) {
        this.afterRender = callback;
    }
}

export const router = new Router();