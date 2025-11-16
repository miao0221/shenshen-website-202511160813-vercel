class VideosPage {
    render() {
        return `
            <div class="videos-page">
                <header class="page-header">
                    <h1>视频集锦</h1>
                    <p>周深的MV、现场表演和精彩片段</p>
                </header>
                
                <section class="videos-list">
                    <div class="video-filter">
                        <select id="video-category">
                            <option value="all">全部</option>
                            <option value="mv">MV</option>
                            <option value="live">现场演出</option>
                            <option value="interview">访谈</option>
                        </select>
                    </div>
                    
                    <div class="videos-grid">
                        <div class="video-card">
                            <div class="video-thumbnail">
                                <img src="https://placehold.co/320x180?text=视频缩略图" alt="视频缩略图" loading="lazy">
                                <div class="play-overlay">
                                    <i class="play-icon">▶</i>
                                </div>
                            </div>
                            <div class="video-info">
                                <h3>《大鱼》MV</h3>
                                <p class="video-meta">
                                    <span>播放量: 10万+</span>
                                    <span>时长: 4:30</span>
                                </p>
                            </div>
                        </div>
                        
                        <div class="video-card">
                            <div class="video-thumbnail">
                                <img src="https://placehold.co/320x180?text=演唱会片段" alt="演唱会片段" loading="lazy">
                                <div class="play-overlay">
                                    <i class="play-icon">▶</i>
                                </div>
                            </div>
                            <div class="video-info">
                                <h3>周深演唱会精彩片段</h3>
                                <p class="video-meta">
                                    <span>播放量: 50万+</span>
                                    <span>时长: 10:15</span>
                                </p>
                            </div>
                        </div>
                        
                        <div class="video-card">
                            <div class="video-thumbnail">
                                <img src="https://placehold.co/320x180?text=访谈节目" alt="访谈节目" loading="lazy">
                                <div class="play-overlay">
                                    <i class="play-icon">▶</i>
                                </div>
                            </div>
                            <div class="video-info">
                                <h3>周深访谈节目</h3>
                                <p class="video-meta">
                                    <span>播放量: 20万+</span>
                                    <span>时长: 15:45</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    afterRender() {
        // 绑定筛选事件
        const categorySelect = document.getElementById('video-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                console.log('选择分类:', e.target.value);
                // 实际应用中这里会根据分类筛选视频
            });
        }
    }
}

export default new VideosPage();