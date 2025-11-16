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
            app.innerHTML = `
                <div class="page-container">
                    <h2>个人中心</h2>
                    <p>欢迎来到个人中心页面。</p>
                    <p>这里可以添加用户个人资料、收藏、历史记录等功能。</p>
                </div>
            `;
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