class MusicPage {
    render() {
        return `
            <div class="music-page">
                <header class="page-header">
                    <h1>音乐作品</h1>
                    <p>周深的经典歌曲和最新作品</p>
                </header>
                
                <section class="music-list">
                    <div class="music-filter">
                        <select id="music-category">
                            <option value="all">全部</option>
                            <option value="album">专辑</option>
                            <option value="single">单曲</option>
                            <option value="ost">影视原声</option>
                        </select>
                    </div>
                    
                    <div class="music-grid">
                        <div class="music-card">
                            <img src="https://placehold.co/200x200?text=专辑封面" alt="专辑封面" loading="lazy">
                            <div class="music-info">
                                <h3>大鱼</h3>
                                <p>《大鱼海棠》印象曲</p>
                                <button class="btn play-btn">播放</button>
                            </div>
                        </div>
                        
                        <div class="music-card">
                            <img src="https://placehold.co/200x200?text=专辑封面" alt="专辑封面" loading="lazy">
                            <div class="music-info">
                                <h3>光亮</h3>
                                <p>《紫禁城》主题歌</p>
                                <button class="btn play-btn">播放</button>
                            </div>
                        </div>
                        
                        <div class="music-card">
                            <img src="https://placehold.co/200x200?text=专辑封面" alt="专辑封面" loading="lazy">
                            <div class="music-info">
                                <h3>化身孤岛的鲸</h3>
                                <p>个人专辑</p>
                                <button class="btn play-btn">播放</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    afterRender() {
        // 确保 DOM 已准备好
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }
    }

    bindEvents() {
        // 绑定筛选事件
        const categorySelect = document.getElementById('music-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                console.log('选择分类:', e.target.value);
                // 实际应用中这里会根据分类筛选音乐
            });
        }

        // 绑定所有播放按钮
        document.querySelectorAll('.play-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const songName = e.currentTarget.closest('.music-card')?.querySelector('h3')?.textContent;
                console.log('播放歌曲:', songName);
                // 实际应用中会触发音频播放
            });
        });
    }
}

export default new MusicPage();