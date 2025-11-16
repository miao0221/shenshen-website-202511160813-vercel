import { router } from './router.js';
import { renderHomePage } from './pages/home.js';
import { renderMusicPage } from './pages/music.js';
import { renderVideoPage } from './pages/video.js';
import { renderAdminPage, setupAdminPage } from './pages/admin.js';
import { renderAuthPage, setupAuthPage } from './pages/auth.js';
import { renderProfilePage, setupProfilePage } from './pages/profile.js';
import { renderTimeCapsulePage } from './pages/time-capsule.js';
import { renderHonorWallPage } from './pages/honor-wall.js';
import { renderMerchandisePage } from './pages/merchandise.js';
import { renderInterviewsPage } from './pages/interviews.js';
import { renderFansPage } from './pages/fans.js';

// 注册路由
router.register('/', renderHomePage);
router.register('/music', renderMusicPage);
router.register('/video', renderVideoPage);
router.register('/admin', renderAdminPage);
router.register('/auth', renderAuthPage);
router.register('/profile', renderProfilePage);
router.register('/time-capsule', renderTimeCapsulePage);
router.register('/honor-wall', renderHonorWallPage);
router.register('/merchandise', renderMerchandisePage);
router.register('/interviews', renderInterviewsPage);
router.register('/fans', renderFansPage);

// 设置路由渲染后回调
router.setAfterRender(() => {
    // 根据当前路由设置相应的事件监听器
    if (window.location.hash === '#/admin' || window.location.hash === '#/admin/') {
        setupAdminPage();
    } else if (window.location.hash === '#/auth' || window.location.hash === '#/auth/') {
        setupAuthPage();
    } else if (window.location.hash === '#/profile' || window.location.hash === '#/profile/') {
        setupProfilePage();
    }
});

// 初始化路由器
document.addEventListener('DOMContentLoaded', async () => {
    // 添加导航链接事件监听器
    document.querySelectorAll('[data-route]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const route = link.getAttribute('data-route');
            router.navigate(route);
        });
    });

    // 处理浏览器前进后退按钮
    window.addEventListener('popstate', () => {
        router.handleRoute();
    });

    // 初始化当前路由
    await router.handleRoute();
});