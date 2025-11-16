class HomePage {
    render() {
        return `
            <div class="home-page">
                <section class="hero-section">
                    <div class="hero-content">
                        <h1>欢迎来到周深粉丝网站</h1>
                        <p>这里是周深粉丝聚集地，分享他的最新动态、音乐作品和精彩瞬间。</p>
                        <div class="hero-buttons">
                            <button class="btn primary" data-route="/music">欣赏音乐</button>
                            <button class="btn secondary" data-route="/videos">观看视频</button>
                        </div>
                    </div>
                </section>
                
                <section class="latest-news">
                    <h2>最新动态</h2>
                    <div class="news-container">
                        <div class="news-card">
                            <img src="https://placehold.co/300x200?text=新闻图片" alt="新闻图片" loading="lazy">
                            <div class="news-content">
                                <h3>新专辑发布</h3>
                                <p>周深最新专辑现已全网上线，快来收听吧！</p>
                                <span class="news-date">2025年10月1日</span>
                            </div>
                        </div>
                        
                        <div class="news-card">
                            <img src="https://placehold.co/300x200?text=演唱会" alt="演唱会" loading="lazy">
                            <div class="news-content">
                                <h3>巡回演唱会</h3>
                                <p>周深2025巡回演唱会即将开启，敬请期待！</p>
                                <span class="news-date">2025年9月15日</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    afterRender() {
        // 绑定按钮点击事件
        document.querySelectorAll('[data-route]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const route = button.getAttribute('data-route');
                window.router.navigate(route);
            });
        });
    }
}

// 导出默认实例
export default new HomePage();