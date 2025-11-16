class LoginPage {
    render() {
        return `
            <div class="auth-page">
                <div class="auth-container">
                    <div class="auth-header">
                        <h1>登录</h1>
                        <p>欢迎回到周深粉丝网站</p>
                    </div>
                    
                    <form id="login-form" class="auth-form">
                        <div class="form-group">
                            <label for="email">邮箱地址:</label>
                            <input type="email" id="email" placeholder="请输入邮箱地址" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="password">密码:</label>
                            <input type="password" id="password" placeholder="请输入密码" required>
                        </div>
                        
                        <div class="form-options">
                            <label class="checkbox-label">
                                <input type="checkbox" id="remember"> 记住我
                            </label>
                            <a href="#" class="forgot-password" data-route="/forgot-password">忘记密码?</a>
                        </div>
                        
                        <button type="submit" class="btn primary full-width">登录</button>
                    </form>
                    
                    <div class="auth-footer">
                        <p>还没有账号? <a href="#" data-route="/register">立即注册</a></p>
                    </div>
                </div>
            </div>
        `;
    }

    afterRender() {
        // 清理现有事件（防止重复绑定）
        this.cleanupEvents();

        // 绑定登录表单事件
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm._submitHandler = (e) => {
                e.preventDefault();
                this.handleLogin();
            };
            loginForm.addEventListener('submit', loginForm._submitHandler);
        }

        // 绑定所有路由链接事件
        this.routeLinkHandlers = [];
        document.querySelectorAll('[data-route]').forEach(element => {
            const handler = (e) => {
                e.preventDefault();
                const route = element.getAttribute('data-route');
                if (window.router && route) {
                    window.router.navigate(route);
                }
            };
            element.addEventListener('click', handler);
            this.routeLinkHandlers.push({ element, handler });
        });
    }

    cleanupEvents() {
        // 清理表单事件
        const loginForm = document.getElementById('login-form');
        if (loginForm && loginForm._submitHandler) {
            loginForm.removeEventListener('submit', loginForm._submitHandler);
            loginForm._submitHandler = null;
        }

        // 清理链接事件
        if (this.routeLinkHandlers) {
            this.routeLinkHandlers.forEach(({ element, handler }) => {
                element.removeEventListener('click', handler);
            });
            this.routeLinkHandlers = [];
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;

        // 简单验证
        if (!email || !password) {
            alert('请填写所有字段');
            return;
        }

        try {
            // 在实际应用中，这里会调用Supabase进行身份验证
            console.log('登录请求:', { email, password, rememberMe });
            
            // 模拟登录延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 登录成功后跳转到主页
            alert('登录成功!');
            if (window.router) {
                window.router.navigate('/');
            }
        } catch (error) {
            console.error('登录失败:', error);
            alert('登录失败，请检查邮箱和密码是否正确');
        }
    }
}

// 在导出前确保清理
const loginPage = new LoginPage();

// 保存原始的render方法
const originalRender = loginPage.render;

// 重写render方法，确保每次渲染前清理事件
loginPage.render = function() {
    if (this.cleanupEvents) {
        this.cleanupEvents();
    }
    return originalRender.call(this);
};

export default loginPage;