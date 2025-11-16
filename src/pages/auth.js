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
                                <div class="error-message" id="login-email-error"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="login-password">密码:</label>
                                <div class="password-input-container">
                                    <input type="password" id="login-password" required>
                                    <button type="button" class="toggle-password" id="toggle-login-password" aria-label="显示密码">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="error-message" id="login-password-error"></div>
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
                                <div class="error-message" id="register-email-error"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="register-password">密码:</label>
                                <div class="password-input-container">
                                    <input type="password" id="register-password" required minlength="6">
                                    <button type="button" class="toggle-password" id="toggle-register-password" aria-label="显示密码">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="error-message" id="register-password-error"></div>
                                <small class="form-text">密码至少6个字符</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="register-confirm-password">确认密码:</label>
                                <div class="password-input-container">
                                    <input type="password" id="register-confirm-password" required>
                                    <button type="button" class="toggle-password" id="toggle-register-confirm-password" aria-label="显示密码">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="error-message" id="register-confirm-password-error"></div>
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
    
    // 设置密码显示切换
    setupPasswordToggle();
    
    // 设置实时验证
    setupRealTimeValidation();
}

// 设置密码显示切换
function setupPasswordToggle() {
    // 登录密码切换
    const toggleLoginPassword = document.getElementById('toggle-login-password');
    const loginPassword = document.getElementById('login-password');
    if (toggleLoginPassword && loginPassword) {
        toggleLoginPassword.addEventListener('click', () => {
            const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            loginPassword.setAttribute('type', type);
            
            // 更新图标
            const eyeOpen = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            const eyeClosed = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94C16.2309 19.2431 14.1642 19.9625 12 20C5 20 1 12 1 12C2.24346 9.6523 3.96578 7.65258 6.06 6.06M9.9 4.24C10.5899 4.07887 11.2966 3.99834 12 4C19 4 23 12 23 12C22.3847 13.1523 21.6233 14.2133 20.74 15.16M14.68 14.68C14.1013 15.3112 13.3391 15.7428 12.5 15.91C11.2656 16.1572 10.003 15.833 9.05 15.05C8.67361 14.7399 8.34883 14.3677 8.09 13.95M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            toggleLoginPassword.innerHTML = type === 'password' ? eyeOpen : eyeClosed;
            toggleLoginPassword.setAttribute('aria-label', type === 'password' ? '显示密码' : '隐藏密码');
        });
    }
    
    // 注册密码切换
    const toggleRegisterPassword = document.getElementById('toggle-register-password');
    const registerPassword = document.getElementById('register-password');
    if (toggleRegisterPassword && registerPassword) {
        toggleRegisterPassword.addEventListener('click', () => {
            const type = registerPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            registerPassword.setAttribute('type', type);
            
            // 更新图标
            const eyeOpen = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            const eyeClosed = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94C16.2309 19.2431 14.1642 19.9625 12 20C5 20 1 12 1 12C2.24346 9.6523 3.96578 7.65258 6.06 6.06M9.9 4.24C10.5899 4.07887 11.2966 3.99834 12 4C19 4 23 12 23 12C22.3847 13.1523 21.6233 14.2133 20.74 15.16M14.68 14.68C14.1013 15.3112 13.3391 15.7428 12.5 15.91C11.2656 16.1572 10.003 15.833 9.05 15.05C8.67361 14.7399 8.34883 14.3677 8.09 13.95M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            toggleRegisterPassword.innerHTML = type === 'password' ? eyeOpen : eyeClosed;
            toggleRegisterPassword.setAttribute('aria-label', type === 'password' ? '显示密码' : '隐藏密码');
        });
    }
    
    // 注册确认密码切换
    const toggleRegisterConfirmPassword = document.getElementById('toggle-register-confirm-password');
    const registerConfirmPassword = document.getElementById('register-confirm-password');
    if (toggleRegisterConfirmPassword && registerConfirmPassword) {
        toggleRegisterConfirmPassword.addEventListener('click', () => {
            const type = registerConfirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            registerConfirmPassword.setAttribute('type', type);
            
            // 更新图标
            const eyeOpen = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            const eyeClosed = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94C16.2309 19.2431 14.1642 19.9625 12 20C5 20 1 12 1 12C2.24346 9.6523 3.96578 7.65258 6.06 6.06M9.9 4.24C10.5899 4.07887 11.2966 3.99834 12 4C19 4 23 12 23 12C22.3847 13.1523 21.6233 14.2133 20.74 15.16M14.68 14.68C14.1013 15.3112 13.3391 15.7428 12.5 15.91C11.2656 16.1572 10.003 15.833 9.05 15.05C8.67361 14.7399 8.34883 14.3677 8.09 13.95M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            toggleRegisterConfirmPassword.innerHTML = type === 'password' ? eyeOpen : eyeClosed;
            toggleRegisterConfirmPassword.setAttribute('aria-label', type === 'password' ? '显示密码' : '隐藏密码');
        });
    }
}

// 设置实时验证
function setupRealTimeValidation() {
    // 登录表单实时验证
    const loginEmail = document.getElementById('login-email');
    if (loginEmail) {
        loginEmail.addEventListener('blur', validateLoginEmail);
    }
    
    const loginPassword = document.getElementById('login-password');
    if (loginPassword) {
        loginPassword.addEventListener('blur', validateLoginPassword);
    }
    
    // 注册表单实时验证
    const registerEmail = document.getElementById('register-email');
    if (registerEmail) {
        registerEmail.addEventListener('blur', validateRegisterEmail);
    }
    
    const registerPassword = document.getElementById('register-password');
    if (registerPassword) {
        registerPassword.addEventListener('blur', validateRegisterPassword);
    }
    
    const registerConfirmPassword = document.getElementById('register-confirm-password');
    if (registerConfirmPassword) {
        registerConfirmPassword.addEventListener('blur', validateRegisterConfirmPassword);
    }
}

// 验证登录邮箱
function validateLoginEmail() {
    const email = document.getElementById('login-email').value.trim();
    const errorElement = document.getElementById('login-email-error');
    
    if (!email) {
        showError(errorElement, '请输入邮箱地址');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showError(errorElement, '请输入有效的邮箱地址');
        return false;
    }
    
    clearError(errorElement);
    return true;
}

// 验证登录密码
function validateLoginPassword() {
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-password-error');
    
    if (!password) {
        showError(errorElement, '请输入密码');
        return false;
    }
    
    clearError(errorElement);
    return true;
}

// 验证注册邮箱
function validateRegisterEmail() {
    const email = document.getElementById('register-email').value.trim();
    const errorElement = document.getElementById('register-email-error');
    
    if (!email) {
        showError(errorElement, '请输入邮箱地址');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showError(errorElement, '请输入有效的邮箱地址');
        return false;
    }
    
    clearError(errorElement);
    return true;
}

// 验证注册密码
function validateRegisterPassword() {
    const password = document.getElementById('register-password').value;
    const errorElement = document.getElementById('register-password-error');
    
    if (!password) {
        showError(errorElement, '请输入密码');
        return false;
    }
    
    if (password.length < 6) {
        showError(errorElement, '密码至少需要6个字符');
        return false;
    }
    
    clearError(errorElement);
    return true;
}

// 验证注册确认密码
function validateRegisterConfirmPassword() {
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const errorElement = document.getElementById('register-confirm-password-error');
    
    if (!confirmPassword) {
        showError(errorElement, '请确认密码');
        return false;
    }
    
    if (password !== confirmPassword) {
        showError(errorElement, '两次输入的密码不一致');
        return false;
    }
    
    clearError(errorElement);
    return true;
}

// 处理登录
async function handleLogin(e) {
    e.preventDefault();
    
    // 验证表单
    const isEmailValid = validateLoginEmail();
    const isPasswordValid = validateLoginPassword();
    
    if (!isEmailValid || !isPasswordValid) {
        return;
    }
    
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
    
    // 验证表单
    const isEmailValid = validateRegisterEmail();
    const isPasswordValid = validateRegisterPassword();
    const isConfirmPasswordValid = validateRegisterConfirmPassword();
    
    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
        return;
    }
    
    const statusDiv = document.getElementById('auth-status');
    statusDiv.innerHTML = '<p>正在注册...</p>';
    
    try {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
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
        
        // 注册成功后尝试创建用户资料记录
        if (data.user) {
            try {
                await window.supabaseClient
                    .from('user_profiles')
                    .upsert({ 
                        id: data.user.id,
                        nickname: '',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });
            } catch (profileError) {
                console.error('创建用户资料记录失败:', profileError);
            }
        }
        
        statusDiv.innerHTML = '<p class="success">注册成功! 请检查您的邮箱进行确认。</p>';
        
        // 清空注册表单
        document.getElementById('register-form').reset();
    } catch (error) {
        console.error('注册失败:', error);
        statusDiv.innerHTML = '<p class="error">注册失败: ' + error.message + '</p>';
    }
}

// 工具函数：验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 工具函数：显示错误信息
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

// 工具函数：清除错误信息
function clearError(element) {
    if (element) {
        element.textContent = '';
        element.style.display = 'none';
    }
}