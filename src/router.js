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
            // 检查用户是否已登录
            const { data: { session } } = await window.supabaseClient.auth.getSession();
            
            // 更新认证UI
            await this.updateAuthUI(session);
        } catch (error) {
            console.error('更新认证状态时出错:', error);
        }
    }
    
    // 更新认证UI
    async updateAuthUI(session) {
        const authLinks = document.getElementById('auth-links');
        const userLinks = document.getElementById('user-links');
        const welcomeText = document.getElementById('welcome-text');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (session) {
            // 用户已登录
            try {
                const { data: { user } } = await window.supabaseClient.auth.getUser();
                const userEmail = user?.email || '用户';
                
                // 隐藏登录/注册链接
                if (authLinks) {
                    authLinks.style.display = 'none';
                }
                
                // 显示个人中心链接、欢迎信息和退出按钮
                if (userLinks && welcomeText) {
                    welcomeText.textContent = `欢迎, ${userEmail}`;
                    userLinks.style.display = 'flex';
                    userLinks.style.alignItems = 'center';
                }
                
                // 设置退出按钮事件
                if (logoutBtn) {
                    // 先移除已有的事件监听器
                    logoutBtn.onclick = null;
                    logoutBtn.onclick = this.handleLogout;
                }
            } catch (error) {
                console.error('获取用户信息时出错:', error);
            }
        } else {
            // 用户未登录
            // 显示登录/注册链接
            if (authLinks) {
                authLinks.style.display = 'list-item';
            }
            
            // 隐藏个人中心链接、欢迎信息和退出按钮
            if (userLinks) {
                userLinks.style.display = 'none';
            }
        }
    }
    
    // 处理退出登录
    handleLogout = async () => {
        try {
            await window.supabaseClient.auth.signOut();
            await this.updateAuthUI(null);
            window.location.hash = '#/';
            window.location.reload();
        } catch (error) {
            console.error('登出失败:', error);
        }
    }

    setAfterRender(callback) {
        this.afterRender = callback;
    }
}

export const router = new Router();