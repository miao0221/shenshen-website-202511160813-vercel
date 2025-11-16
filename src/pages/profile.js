// 个人中心页面组件
export async function renderProfilePage() {
    try {
        // 检查用户是否已登录
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        
        if (!session) {
            // 用户未登录，重定向到登录页面
            window.location.hash = '#/auth';
            return '<div class="loading">正在跳转到登录页面...</div>';
        }
        
        // 获取用户信息
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        
        // 获取用户昵称
        let nickname = '';
        try {
            const { data: profile, error } = await window.supabaseClient
                .from('user_profiles')
                .select('nickname')
                .eq('id', user.id)
                .single();
            
            if (error && error.code !== 'PGRST116') { // PGRST116表示未找到记录
                console.error('获取用户资料时出错:', error);
            }
            
            nickname = profile?.nickname || '';
        } catch (error) {
            console.error('获取用户资料时出错:', error);
        }
        
        return `
            <div class="page-container profile-page">
                <div class="profile-header">
                    <h2>个人中心</h2>
                </div>
                
                <div class="profile-content">
                    <div class="user-info-card">
                        <h3>用户信息</h3>
                        <div class="user-info">
                            <p><strong>邮箱:</strong> ${user.email}</p>
                            <p><strong>昵称:</strong> <span id="user-nickname">${nickname || '未设置'}</span></p>
                            <p><strong>注册时间:</strong> ${new Date(user.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <div class="profile-actions">
                        <button id="show-change-nickname" class="btn btn-primary">修改昵称</button>
                        <button id="show-change-password" class="btn btn-primary">修改密码</button>
                    </div>
                    
                    <!-- 修改昵称表单 -->
                    <div id="change-nickname-form" class="admin-form" style="display: none;">
                        <h3>修改昵称</h3>
                        <form id="nickname-form">
                            <div class="form-group">
                                <label for="new-nickname">新昵称:</label>
                                <input type="text" id="new-nickname" value="${nickname}" required maxlength="50">
                                <div class="error-message" id="nickname-error"></div>
                            </div>
                            <button type="submit" class="btn btn-primary">更新昵称</button>
                            <button type="button" id="cancel-nickname" class="btn btn-secondary">取消</button>
                        </form>
                    </div>
                    
                    <!-- 修改密码表单 -->
                    <div id="change-password-form" class="admin-form" style="display: none;">
                        <h3>修改密码</h3>
                        <form id="password-form">
                            <div class="form-group">
                                <label for="current-password">当前密码 | Current Password:</label>
                                <div class="password-input-container">
                                    <input type="password" id="current-password" required>
                                    <button type="button" class="toggle-password" id="toggle-current-password" aria-label="显示密码">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="error-message" id="current-password-error"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="new-password">新密码 | New Password:</label>
                                <div class="password-input-container">
                                    <input type="password" id="new-password" required minlength="6">
                                    <button type="button" class="toggle-password" id="toggle-new-password" aria-label="显示密码">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="error-message" id="new-password-error"></div>
                                <small class="form-text">密码至少6个字符 | Password must be at least 6 characters</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="confirm-password">确认新密码 | Confirm New Password:</label>
                                <div class="password-input-container">
                                    <input type="password" id="confirm-password" required>
                                    <button type="button" class="toggle-password" id="toggle-confirm-password" aria-label="显示密码">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="error-message" id="confirm-password-error"></div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary">更新密码 | Update Password</button>
                            <button type="button" id="cancel-password" class="btn btn-secondary">取消 | Cancel</button>
                        </form>
                    </div>
                    
                    <div id="profile-status"></div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('获取用户信息失败:', error);
        return `
            <div class="page-container">
                <div class="error-message">
                    <p>获取用户信息失败: ${error.message}</p>
                    <button id="retry-btn" class="btn btn-primary">重试</button>
                </div>
            </div>
        `;
    }
}

export function setupProfilePage() {
    // 设置重试按钮事件
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
    
    // 显示修改昵称表单
    const showNicknameBtn = document.getElementById('show-change-nickname');
    if (showNicknameBtn) {
        showNicknameBtn.addEventListener('click', () => {
            document.getElementById('change-nickname-form').style.display = 'block';
            document.getElementById('change-password-form').style.display = 'none';
        });
    }
    
    // 显示修改密码表单
    const showPasswordBtn = document.getElementById('show-change-password');
    if (showPasswordBtn) {
        showPasswordBtn.addEventListener('click', () => {
            document.getElementById('change-password-form').style.display = 'block';
            document.getElementById('change-nickname-form').style.display = 'none';
        });
    }
    
    // 取消修改昵称
    const cancelNicknameBtn = document.getElementById('cancel-nickname');
    if (cancelNicknameBtn) {
        cancelNicknameBtn.addEventListener('click', () => {
            document.getElementById('change-nickname-form').style.display = 'none';
            clearAllErrors();
        });
    }
    
    // 取消修改密码
    const cancelPasswordBtn = document.getElementById('cancel-password');
    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', () => {
            document.getElementById('change-password-form').style.display = 'none';
            document.getElementById('password-form').reset();
            clearAllErrors();
        });
    }
    
    // 设置昵称表单提交事件
    const nicknameForm = document.getElementById('nickname-form');
    if (nicknameForm) {
        nicknameForm.addEventListener('submit', handleChangeNickname);
    }
    
    // 设置密码表单提交事件
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handleChangePassword);
    }
    
    // 设置密码显示切换
    setupPasswordToggle();
}

// 设置密码显示切换
function setupPasswordToggle() {
    // 当前密码切换
    const toggleCurrentPassword = document.getElementById('toggle-current-password');
    const currentPassword = document.getElementById('current-password');
    if (toggleCurrentPassword && currentPassword) {
        toggleCurrentPassword.addEventListener('click', () => {
            const type = currentPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            currentPassword.setAttribute('type', type);
            
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
            
            toggleCurrentPassword.innerHTML = type === 'password' ? eyeOpen : eyeClosed;
            toggleCurrentPassword.setAttribute('aria-label', type === 'password' ? '显示密码' : '隐藏密码');
        });
    }
    
    // 新密码切换
    const toggleNewPassword = document.getElementById('toggle-new-password');
    const newPassword = document.getElementById('new-password');
    if (toggleNewPassword && newPassword) {
        toggleNewPassword.addEventListener('click', () => {
            const type = newPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            newPassword.setAttribute('type', type);
            
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
            
            toggleNewPassword.innerHTML = type === 'password' ? eyeOpen : eyeClosed;
            toggleNewPassword.setAttribute('aria-label', type === 'password' ? '显示密码' : '隐藏密码');
        });
    }
    
    // 确认密码切换
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const confirmPassword = document.getElementById('confirm-password');
    if (toggleConfirmPassword && confirmPassword) {
        toggleConfirmPassword.addEventListener('click', () => {
            const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPassword.setAttribute('type', type);
            
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
            
            toggleConfirmPassword.innerHTML = type === 'password' ? eyeOpen : eyeClosed;
            toggleConfirmPassword.setAttribute('aria-label', type === 'password' ? '显示密码' : '隐藏密码');
        });
    }
}

// 处理修改昵称
async function handleChangeNickname(e) {
    e.preventDefault();
    
    const newNickname = document.getElementById('new-nickname').value.trim();
    const errorElement = document.getElementById('nickname-error');
    const statusDiv = document.getElementById('profile-status');
    
    // 简单验证
    if (!newNickname) {
        showError(errorElement, '请输入新昵称 | Please enter a new nickname');
        return;
    }
    
    if (newNickname.length > 50) {
        showError(errorElement, '昵称不能超过50个字符 | Nickname cannot exceed 50 characters');
        return;
    }
    
    statusDiv.innerHTML = '<p>正在更新昵称... | Updating nickname...</p>';
    
    try {
        // 获取当前用户
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        
        // 更新或插入用户资料
        const { error } = await window.supabaseClient
            .from('user_profiles')
            .upsert({ 
                id: user.id, 
                nickname: newNickname,
                updated_at: new Date().toISOString()
            });
        
        if (error) {
            throw new Error(error.message);
        }
        
        statusDiv.innerHTML = '<p class="success">昵称更新成功! | Nickname updated successfully!</p>';
        
        // 更新页面显示的昵称
        document.getElementById('user-nickname').textContent = newNickname;
        
        // 更新导航栏的欢迎信息
        const welcomeText = document.getElementById('welcome-text');
        if (welcomeText) {
            welcomeText.textContent = `欢迎, ${newNickname}`;
        }
        
        // 隐藏表单
        document.getElementById('change-nickname-form').style.display = 'none';
        clearAllErrors();
    } catch (error) {
        console.error('更新昵称失败:', error);
        statusDiv.innerHTML = '<p class="error">更新失败: ' + error.message + '</p>';
    }
}

// 处理修改密码
async function handleChangePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // 验证
    const currentPasswordError = document.getElementById('current-password-error');
    const newPasswordError = document.getElementById('new-password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    
    let hasError = false;
    
    if (!currentPassword) {
        showError(currentPasswordError, '请输入当前密码 | Please enter your current password');
        hasError = true;
    }
    
    if (!newPassword) {
        showError(newPasswordError, '请输入新密码 | Please enter a new password');
        hasError = true;
    } else if (newPassword.length < 6) {
        showError(newPasswordError, '密码至少需要6个字符 | Password must be at least 6 characters');
        hasError = true;
    }
    
    if (!confirmPassword) {
        showError(confirmPasswordError, '请确认新密码 | Please confirm your new password');
        hasError = true;
    } else if (newPassword !== confirmPassword) {
        showError(confirmPasswordError, '两次输入的密码不一致 | The passwords you entered do not match');
        hasError = true;
    } else if (newPassword === currentPassword) {
        showError(newPasswordError, '新密码不能与当前密码相同 | New password cannot be the same as current password');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    const statusDiv = document.getElementById('profile-status');
    statusDiv.innerHTML = '<p>正在更新密码... | Updating password...</p>';
    
    try {
        // 首先验证当前密码是否正确
        const { data: { session }, error: signInError } = await window.supabaseClient.auth.signInWithPassword({
            email: (await window.supabaseClient.auth.getUser()).data.user.email,
            password: currentPassword
        });
        
        // 如果登录失败，说明当前密码不正确
        if (signInError) {
            throw new Error('当前密码不正确 | Current password is incorrect');
        }
        
        // 登录成功后，使用返回的会话更新密码
        const { error: updateError } = await window.supabaseClient.auth.updateUser({
            password: newPassword
        });
        
        if (updateError) {
            throw new Error(updateError.message);
        }
        
        statusDiv.innerHTML = '<p class="success">密码更新成功! | Password updated successfully!</p>';
        
        // 重置表单
        document.getElementById('password-form').reset();
        document.getElementById('change-password-form').style.display = 'none';
        clearAllErrors();
    } catch (error) {
        console.error('更新密码失败:', error);
        statusDiv.innerHTML = '<p class="error">更新失败: ' + error.message + '</p>';
    }
}

// 工具函数：显示错误信息
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

// 工具函数：清除所有错误信息
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}