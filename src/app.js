import { router } from './router.js';
import { Navbar } from './components/navbar.js';

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 创建导航栏
    const navbar = new Navbar();
    navbar.render();
    
    // 初始化路由
    router.init();
});