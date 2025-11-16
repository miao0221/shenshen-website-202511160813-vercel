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
        
        return `
            <div class="page-container profile-page">
                <div class="profile-header">
                    <h2>个人中心</h2>
                </div>
                
                <div class="profile-content">
                    <div class="user-info-card">
                        <h3>用户信息</h3>
                        <div class="user-info">
                            <p><strong>用户ID:</strong> ${user.id}</p>
                            <p><strong>邮箱:</strong> ${user.email}</p>
                            <p><strong>注册时间:</strong> ${new Date(user.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <div class="profile-actions">
                        <button id="logout-btn" class="btn btn-secondary">退出登录</button>
                    </div>
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
    // 设置登出按钮事件
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // 设置重试按钮事件
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
}

// 处理登出
async function handleLogout() {
    try {
        await window.supabaseClient.auth.signOut();
        window.location.hash = '#/auth';
        window.location.reload();
    } catch (error) {
        console.error('登出失败:', error);
        alert('登出失败: ' + error.message);
    }
}