import { router } from './routes/router.js';
import { initSupabase } from './utils/supabaseClient.js';

// 将路由器实例添加到全局window对象
window.router = router;

// 初始化Supabase客户端
initSupabase();

// 初始化路由
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        router.init();
    });
} else {
    // DOM已经加载完成
    router.init();
}

// 处理浏览器前进后退按钮
window.addEventListener('popstate', () => {
    router.navigate(window.location.pathname);
});