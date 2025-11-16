import { renderHomePage, setupHomePage } from './pages/home.js';
import { renderMusicPage } from './pages/music.js';
import { renderVideoPage } from './pages/video.js';
import { renderAuthPage, setupAuthPage } from './pages/auth.js';
import { renderAdminPage, setupAdminPage } from './pages/admin.js';
import { isAdmin } from './utils/admin.js';

// 初始化应用
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化 Supabase 客户端
    if (typeof supabase !== 'undefined') {
        window.supabaseClient = supabase.createClient(
            'https://ywzqkjparfslwwvjuwlx.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3enFranBhcmZzbHd3dmp1d2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjI0ODYsImV4cCI6MjA3ODc5ODQ4Nn0.2fKie0CH12aoxvnUAO2IPrdZ1NtkyK8ujErx7FTiDxY'
        );
    } else {
        console.error('Supabase SDK 未正确加载');
    }
    
    // 页面加载时初始化
    await handleRoute();
    
    // 监听路由变化
    window.addEventListener('hashchange', handleRoute);
});

// 处理路由变化
async function handleRoute() {
    const app = document.getElementById('app');
    const hash = window.location.hash;
    
    if (!app) return;
    
    // 隐藏所有下拉菜单
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
    });
    
    try {
        if (hash === '#/' || hash === '') {
            app.innerHTML = renderHomePage();
            setupHomePage();
        } else if (hash === '#/music') {
            app.innerHTML = '<div class="loading">加载中...</div>';
            const content = await renderMusicPage();
            app.innerHTML = content;
        } else if (hash === '#/video') {
            app.innerHTML = '<div class="loading">加载中...</div>';
            const content = await renderVideoPage();
            app.innerHTML = content;
        } else if (hash === '#/time-capsule') {
            // 时间胶囊页面
            app.innerHTML = `
                <div class="page-container">
                    <h2>时间胶囊</h2>
                    <p>这里是时间胶囊页面。</p>
                </div>
            `;
        } else if (hash === '#/honor-wall') {
            // 荣誉墙页面
            app.innerHTML = `
                <div class="page-container">
                    <h2>荣誉墙</h2>
                    <p>这里是荣誉墙页面。</p>
                </div>
            `;
        } else if (hash === '#/merchandise') {
            // 商务与周边页面
            app.innerHTML = `
                <div class="page-container">
                    <h2>商务与周边</h2>
                    <p>这里是商务与周边页面。</p>
                </div>
            `;
        } else if (hash === '#/interviews') {
            // 采访页面
            app.innerHTML = `
                <div class="page-container">
                    <h2>采访</h2>
                    <p>这里是采访页面。</p>
                </div>
            `;
        } else if (hash === '#/fans') {
            // 生米广场页面
            app.innerHTML = `
                <div class="page-container">
                    <h2>生米广场</h2>
                    <p>这里是生米广场页面。</p>
                </div>
            `;
        } else if (hash === '#/auth') {
            app.innerHTML = renderAuthPage();
            setupAuthPage();
        } else if (hash === '#/profile') {
            // 个人中心页面
            app.innerHTML = '<div class="loading">加载中...</div>';
            const profileContent = await renderProfilePage();
            app.innerHTML = profileContent;
            setupProfilePage();
        } else if (hash === '#/admin') {
            // 检查是否为管理员
            const userIsAdmin = await isAdmin();
            if (userIsAdmin) {
                app.innerHTML = renderAdminPage();
                setupAdminPage();
            } else {
                app.innerHTML = '<div class="page-container"><h2>访问被拒绝</h2><p>您没有权限访问此页面。</p></div>';
            }
        } else {
            app.innerHTML = '<div class="page-container"><h2>页面未找到</h2><p>您访问的页面不存在。</p></div>';
        }
    } catch (error) {
        console.error('渲染页面时出错:', error);
        app.innerHTML = '<div class="page-container"><h2>错误</h2><p>加载页面时出现错误，请稍后重试。</p></div>';
    }
}

// 渲染个人中心页面
async function renderProfilePage() {
    try {
        // 检查用户是否已登录
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        
        if (!session) {
            return `
                <div class="page-container">
                    <h2>访问被拒绝</h2>
                    <p>请先登录以访问个人中心。</p>
                    <button id="go-to-auth" class="btn btn-primary">前往登录</button>
                </div>
            `;
        }
        
        // 获取用户信息
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        
        // 获取用户资料
        let userProfile = null;
        try {
            const { data, error } = await window.supabaseClient
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (!error) {
                userProfile = data;
            }
        } catch (error) {
            console.error('获取用户资料时出错:', error);
        }
        
        // 获取用户昵称（优先使用资料中的昵称，否则使用邮箱）
        const displayName = userProfile?.nickname || user.email || '未知用户';
        const userEmail = user.email || '未知邮箱';
        const userCreatedAt = user.created_at ? new Date(user.created_at).toLocaleString() : '未知';
        
        return `
            <div class="page-container">
                <h2>个人中心</h2>
                <div class="profile-info">
                    <div class="profile-field">
                        <label>昵称:</label>
                        <span>${displayName}</span>
                    </div>
                    <div class="profile-field">
                        <label>邮箱:</label>
                        <span>${userEmail}</span>
                    </div>
                    <div class="profile-field">
                        <label>账户创建时间:</label>
                        <span>${userCreatedAt}</span>
                    </div>
                    ${userProfile ? `
                    <div class="profile-field">
                        <label>资料更新时间:</label>
                        <span>${userProfile.updated_at ? new Date(userProfile.updated_at).toLocaleString() : '未知'}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="profile-actions">
                    <button id="edit-profile" class="btn btn-primary">编辑资料</button>
                </div>
                
                <!-- 编辑资料模态框 -->
                <div id="edit-profile-modal" class="modal" style="display: none;">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h3>编辑个人资料</h3>
                        <form id="edit-profile-form">
                            <div class="form-group">
                                <label for="profile-nickname">昵称:</label>
                                <input type="text" id="profile-nickname" value="${userProfile?.nickname || ''}">
                            </div>
                            <button type="submit" class="btn btn-primary">保存</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('加载个人中心时出错:', error);
        return `
            <div class="page-container">
                <h2>错误</h2>
                <p>加载个人中心时出现错误: ${error.message}</p>
            </div>
        `;
    }
}

// 设置个人中心页面事件
function setupProfilePage() {
    // 前往登录按钮事件
    const goToAuthBtn = document.getElementById('go-to-auth');
    if (goToAuthBtn) {
        goToAuthBtn.addEventListener('click', () => {
            window.location.hash = '#/auth';
        });
    }
    
    // 编辑资料按钮事件
    const editProfileBtn = document.getElementById('edit-profile');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            document.getElementById('edit-profile-modal').style.display = 'block';
        });
    }
    
    // 模态框关闭事件
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // 编辑资料表单提交事件
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const nickname = document.getElementById('profile-nickname').value;
                
                // 获取当前用户
                const { data: { user } } = await window.supabaseClient.auth.getUser();
                
                // 更新用户资料
                const { error } = await window.supabaseClient
                    .from('user_profiles')
                    .upsert({ 
                        id: user.id,
                        nickname: nickname,
                        updated_at: new Date().toISOString()
                    });
                
                if (error) throw error;
                
                // 关闭模态框
                document.getElementById('edit-profile-modal').style.display = 'none';
                
                // 显示成功消息
                alert('资料更新成功');
                
                // 重新加载页面以显示更新后的信息
                window.location.reload();
            } catch (error) {
                console.error('更新资料时出错:', error);
                alert('更新资料失败: ' + error.message);
            }
        });
    }
}

// 监听音乐上传完成事件
window.addEventListener('musicUploaded', async () => {
    // 如果当前在音乐页面，刷新内容
    if (window.location.hash === '#/music') {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = '<div class="loading">加载中...</div>';
            const content = await renderMusicPage();
            app.innerHTML = content;
        }
    }
});

// 监听视频上传完成事件
window.addEventListener('videoUploaded', async () => {
    // 如果当前在视频页面，刷新内容
    if (window.location.hash === '#/video') {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = '<div class="loading">加载中...</div>';
            const content = await renderVideoPage();
            app.innerHTML = content;
        }
    }
});