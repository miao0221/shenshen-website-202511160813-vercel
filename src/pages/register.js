class RegisterPage {
    render() {
        return `
            <div class="auth-page">
                <div class="auth-container">
                    <div class="auth-header">
                        <h1>注册</h1>
                        <p>加入周深粉丝大家庭</p>
                    </div>
                    
                    <form id="register-form" class="auth-form">
                        <div class="form-group">
                            <label for="username">用户名:</label>
                            <input type="text" id="username" placeholder="请输入用户名" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="reg-email">邮箱地址:</label>
                            <input type="email" id="reg-email" placeholder="请输入邮箱地址" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="reg-password">密码:</label>
                            <input type="password" id="reg-password" placeholder="请输入密码" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="confirm-password">确认密码:</label>
                            <input type="password" id="confirm-password" placeholder="请再次输入密码" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="agree-terms" required> 我同意 
                                <a href="#" data-route="/terms">用户协议</a> 和 
                                <a href="#" data-route="/privacy">隐私政策</a>
                            </label>
                        </div>
                        
                        <button type="submit" class="btn primary full-width">注册</button>
                    </form>
                    
                    <div class="auth-footer">
                        <p>已有账号? <a href="#" data-route="/login">立即登录</a></p>
                    </div>
                </div>
            </div>
        `;
    }

    afterRender() {
        // 绑定注册表单事件
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // 绑定链接事件
        document.querySelectorAll('[data-route]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const route = element.getAttribute('data-route');
                window.router.navigate(route);
            });
        });
    }

    async handleRegister() {
        const username = document.getElementById('username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const agreeTerms = document.getElementById('agree-terms').checked;

        // 验证表单
        if (!username || !email || !password || !confirmPassword) {
            alert('请填写所有字段');
            return;
        }

        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }

        if (!agreeTerms) {
            alert('请同意用户协议和隐私政策');
            return;
        }

        try {
            // 在实际应用中，这里会调用Supabase进行注册
            console.log('注册请求:', { username, email, password });
            
            // 模拟注册延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 注册成功后跳转到登录页
            alert('注册成功，请登录!');
            window.router.navigate('/login');
        } catch (error) {
            console.error('注册失败:', error);
            alert('注册失败，请稍后再试');
        }
    }
}

export default new RegisterPage();