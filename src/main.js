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
import { router } from './router.js';
import { initializeAuth } from './utils/supabase.js';
import { initGlobalParticleSystem } from './utils/particles.js';

// 初始化认证
initializeAuth();

// 提前初始化粒子系统
let particleSystem = null;
function initializeParticleSystem() {
    // 检查粒子画布是否已存在
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        // 设置画布样式
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        
        // 动态导入时光胶囊页面模块以获取粒子系统
        try {
            // 初始化全局粒子系统
            particleSystem = initGlobalParticleSystem();
        } catch (error) {
            console.error('Failed to initialize particle system:', error);
        }
    }
}

// 在DOM加载完成后立即初始化粒子系统
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeParticleSystem);
} else {
    initializeParticleSystem();
}

// 注册路由
router.register('/', async () => {
    const content = renderHomePage();
    // 使用微任务延迟确保DOM更新完成
    await Promise.resolve();
    setupHomePage();
    return content;
});

router.register('/music', async () => {
    const content = await renderMusicPage();
    return content;
});

router.register('/video', async () => {
    const content = await renderVideoPage();
    return content;
});

router.register('/time-capsule', async () => {
    const html = await renderTimeCapsulePage();
    return html;
});

router.register('/honor-wall', () => {
    return renderHonorWallPage();
});

router.register('/merchandise', () => {
    return renderMerchandisePage();
});

router.register('/interviews', () => {
    return renderInterviewsPage();
});

router.register('/fans', () => {
    return renderFansPage();
});

router.register('/auth', async () => {
    const content = renderAuthPage();
    // 使用微任务延迟确保DOM更新完成
    await Promise.resolve();
    setupAuthPage();
    return content;
});

router.register('/profile', async () => {
    const content = await renderProfilePage();
    // 使用微任务延迟确保DOM更新完成
    await Promise.resolve();
    setupProfilePage();
    return content;
});

router.register('/admin', async () => {
    // 检查是否为管理员
    const userIsAdmin = await isAdmin();
    if (userIsAdmin) {
        const content = renderAdminPage();
        // 使用微任务延迟确保DOM更新完成
        await Promise.resolve();
        setupAdminPage();
        return content;
    } else {
        return '<div class="page-container"><h2>访问被拒绝</h2><p>您没有权限访问此页面。</p></div>';
    }
});

// 监听路由变化，在时光胶囊页面加载时初始化相关功能
router.setAfterRender(() => {
    // 检查是否是时光胶囊页面
    if (window.location.hash === '#/time-capsule') {
        // 稍微延迟以确保DOM已更新
        setTimeout(() => {
            initializeTimeCapsuleFeatures();
        }, 100);
    }
});

// 初始化时光胶囊功能的函数
function initializeTimeCapsuleFeatures() {
    // 检查是否在时光胶囊页面
    const timeCapsulePage = document.querySelector('.time-capsule-page');
    if (!timeCapsulePage) return;
    
    // 动态导入时光胶囊页面模块
    import('./pages/time-capsule.js').then((module) => {
        // 创建时间轴和日历
        module.initTimeCapsuleFeatures();
    }).catch((error) => {
        console.error('Failed to load time capsule features:', error);
    });
}

// 初始化应用
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化路由
    router.init();
});

// 监听音乐上传完成事件
window.addEventListener('musicUploaded', async () => {
    // 如果当前在音乐页面，刷新内容
    if (window.location.hash === '#/music') {
        router.handleRoute();
    }
});

// 监听视频上传完成事件
window.addEventListener('videoUploaded', async () => {
    // 如果当前在视频页面，刷新内容
    if (window.location.hash === '#/video') {
        router.handleRoute();
    }
});