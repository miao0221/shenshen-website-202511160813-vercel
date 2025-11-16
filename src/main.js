import { router } from './routes/router.js';
import { initSupabase } from './utils/supabaseClient.js';
import './assets/css/main.css';

// 初始化Supabase客户端
initSupabase();

// 初始化路由
document.addEventListener('DOMContentLoaded', () => {
    // 启动路由器
    router.init();
    
    // 处理浏览器前进后退按钮
    window.addEventListener('popstate', () => {
        router.navigate(window.location.pathname);
    });
});