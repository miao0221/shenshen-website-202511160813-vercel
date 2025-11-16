import { router } from './router.js';
import { renderHomePage } from './pages/home.js';
import { renderMusicPage } from './pages/music.js';
import { renderVideoPage } from './pages/video.js';

// 注册路由
router.register('/', renderHomePage);
router.register('/music', renderMusicPage);
router.register('/video', renderVideoPage);

// 初始化路由器
document.addEventListener('DOMContentLoaded', () => {
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
    router.handleRoute();
});