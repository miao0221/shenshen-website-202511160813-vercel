// 登录注册页面组件
export function renderAuthPage() {
    return `
        <div class="page-container auth-page">
            <div class="auth-container">
                <div class="auth-tabs">
                    <button class="tab-btn active" data-auth-tab="login">登录</button>
                    <button class="tab-btn" data-auth-tab="register">注册</button>
                </div>
                
                <div class="tab-content">
                    <!-- 登录表单 -->
                    <div id="login-tab" class="auth-tab-pane active">
                        <h2>用户登录</h2>
                        <form id="login-form" class="auth-form">
                            <div class="form-group">
                                <label for="login-email">邮箱:</label>
                                <input type="email" id="login-email" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="login-password">密码:</label>
                                <input type="password" id="login-password" required>
                            </div>
                            
                            <button type="submit" class="btn btn-primary">登录</button>
                        </form>
                    </div>
                    
                    <!-- 注册表单 -->
                    <div id="register-tab" class="auth-tab-pane" style="display: none;">
                        <h2>用户注册</h2>
                        <form id="register-form" class="auth-form">
                            <div class="form-group">
                                <label for="register-email">邮箱:</label>
                                <input type="email" id="register-email" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="register-password">密码:</label>
                                <input type="password" id="register-password" required minlength="6">
                            </div>
                            
                            <div class="form-group">
                                <label for="register-confirm-password">确认密码:</label>
                                <input type="password" id="register-confirm-password" required>
                            </div>
                            
                            <button type="submit" class="btn btn-primary">注册</button>
                        </form>
                    </div>
                </div>
                
                <div id="auth-status"></div>
            </div>
        </div>
    `;
}

export function setupAuthPage() {
    // 设置标签页切换
    const tabButtons = document.querySelectorAll('[data-auth-tab]');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新激活的标签按钮
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // 显示对应的标签内容
            const tabName = button.getAttribute('data-auth-tab');
            document.querySelectorAll('.auth-tab-pane').forEach(pane => {
                pane.style.display = 'none';
            });
            
            const targetPane = document.getElementById(tabName + '-tab');
            if (targetPane) {
                targetPane.style.display = 'block';
            }
        });
    });
    
    // 设置表单提交事件
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// 处理登录
async function handleLogin(e) {
    e.preventDefault();
    const statusDiv = document.getElementById('auth-status');
    statusDiv.innerHTML = '<p>正在登录...</p>';
    
    try {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // 检查supabase客户端是否已初始化
        if (!window.supabaseClient) {
            throw new Error('Supabase客户端未初始化');
        }
        
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            throw new Error(error.message);
        }
        
        statusDiv.innerHTML = '<p class="success">登录成功!</p>';
        
        // 登录成功后刷新页面并跳转到首页
        setTimeout(() => {
            window.location.hash = '#/';
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.error('登录失败:', error);
        statusDiv.innerHTML = '<p class="error">登录失败: ' + error.message + '</p>';
    }
}

// 处理注册
async function handleRegister(e) {
    e.preventDefault();
    const statusDiv = document.getElementById('auth-status');
    statusDiv.innerHTML = '<p>正在注册...</p>';
    
    try {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // 检查密码确认
        if (password !== confirmPassword) {
            throw new Error('两次输入的密码不一致');
        }
        
        // 检查supabase客户端是否已初始化
        if (!window.supabaseClient) {
            throw new Error('Supabase客户端未初始化');
        }
        
        const { data, error } = await window.supabaseClient.auth.signUp({
            email,
            password
        });
        
        if (error) {
            throw new Error(error.message);
        }
        
        statusDiv.innerHTML = '<p class="success">注册成功! 请检查您的邮箱进行确认。</p>';
        
        // 清空注册表单
        document.getElementById('register-form').reset();
    } catch (error) {
        console.error('注册失败:', error);
        statusDiv.innerHTML = '<p class="error">注册失败: ' + error.message + '</p>';
    }
}