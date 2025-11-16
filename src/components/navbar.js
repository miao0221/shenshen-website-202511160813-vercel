import { router } from '../router.js';

export class Navbar {
    render() {
        const navbarHTML = `
            <nav class="navbar">
                <div class="nav-brand">周深粉丝网站</div>
                <ul class="nav-links">
                    <li><a href="/" data-link>首页</a></li>
                    <li><a href="/music" data-link>音乐</a></li>
                    <li><a href="/videos" data-link>视频</a></li>
                </ul>
            </nav>
        `;
        
        document.querySelector('#app').innerHTML = navbarHTML;
        
        // 添加导航事件监听
        this.addNavigationListeners();
    }
    
    addNavigationListeners() {
        // 使用事件委托处理所有导航链接点击
        document.querySelector('.navbar').addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.hasAttribute('data-link')) {
                e.preventDefault();
                const path = e.target.getAttribute('href');
                router.navigate(path);
            }
        });
    }
}