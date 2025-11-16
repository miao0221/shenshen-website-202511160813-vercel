import { renderHomePage, setupHomePage } from './pages/home.js';
import { renderMusicPage } from './pages/music.js';
import { renderVideoPage } from './pages/video.js';
import { renderAuthPage, setupAuthPage } from './pages/auth.js';
import { renderAdminPage, setupAdminPage } from './pages/admin.js';
import { renderTimeCapsulePage } from './pages/time-capsule.js';
import { renderHonorWallPage } from './pages/honor-wall.js';
import { renderMerchandisePage } from './pages/merchandise.js';
import { renderInterviewsPage } from './pages/interviews.js';
import { renderFansPage } from './pages/fans.js';
import { renderProfilePage, setupProfilePage } from './pages/profile.js';
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
            app.innerHTML = renderTimeCapsulePage();
        } else if (hash === '#/honor-wall') {
            app.innerHTML = renderHonorWallPage();
        } else if (hash === '#/merchandise') {
            app.innerHTML = renderMerchandisePage();
        } else if (hash === '#/interviews') {
            app.innerHTML = renderInterviewsPage();
        } else if (hash === '#/fans') {
            app.innerHTML = renderFansPage();
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