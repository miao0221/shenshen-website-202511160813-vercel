export function renderHomePage() {
    return `
        <div class="page-container home-page">
            <h2>欢迎来到深的N次方</h2>
            <p>周深，中国内地男歌手，以其清澈空灵的嗓音和出色的音乐表现力而闻名。</p>
            <p>他既能演绎深情款款的情歌，也能驾驭气势磅礴的史诗音乐，在流行、民谣、古典等多种风格间游刃有余。</p>
            <p>本网站致力于收集和分享周深的音乐作品、MV以及相关资讯，为粉丝们提供一个交流和欣赏的平台。</p>
            
            <!-- 搜索框 -->
            <div class="search-container">
                <form id="search-form" class="search-form">
                    <input type="text" id="search-input" class="search-input" placeholder="搜索音乐、视频..." autocomplete="off">
                    <button type="submit" class="search-button">搜索</button>
                </form>
                <div id="search-results" class="search-results" style="display: none;"></div>
            </div>
        </div>
    `;
}

export function setupHomePage() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchForm && searchInput && searchResults) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const keyword = searchInput.value.trim();
            
            if (keyword.length === 0) {
                searchResults.style.display = 'none';
                return;
            }
            
            try {
                // 显示加载状态
                searchResults.innerHTML = '<div class="loading">搜索中...</div>';
                searchResults.style.display = 'block';
                
                // 搜索音乐和视频
                const [musicResults, videoResults] = await Promise.all([
                    searchMusic(keyword),
                    searchVideos(keyword)
                ]);
                
                // 显示搜索结果
                displaySearchResults(musicResults, videoResults, keyword);
            } catch (error) {
                console.error('搜索出错:', error);
                searchResults.innerHTML = '<div class="search-no-results">搜索时出错，请稍后重试</div>';
            }
        });
        
        // 点击页面其他地方隐藏搜索结果
        document.addEventListener('click', (e) => {
            if (!searchForm.contains(e.target) && searchResults.style.display === 'block') {
                searchResults.style.display = 'none';
            }
        });
    }
}

// 搜索音乐
async function searchMusic(keyword) {
    try {
        // 获取音乐列表
        const { data: musics, error: musicError } = await window.supabaseClient
            .from('musics')
            .select('*');
        
        if (musicError) throw musicError;
        
        // 获取所有标签
        const { data: allTags, error: tagsError } = await window.supabaseClient
            .from('tags')
            .select('*');
        
        if (tagsError) throw tagsError;
        
        // 获取所有标签类别
        const { data: categories, error: categoriesError } = await window.supabaseClient
            .from('tag_categories')
            .select('*');
        
        if (categoriesError) throw categoriesError;
        
        // 创建类别ID到名称的映射
        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category.id] = category.name;
        });
        
        // 获取音乐标签关联
        const { data: mediaTags, error: mediaTagsError } = await window.supabaseClient
            .from('media_tags')
            .select('*')
            .eq('media_type', 'music');
        
        if (mediaTagsError) throw mediaTagsError;
        
        // 过滤包含关键词的音乐
        const filteredMusics = musics.filter(music => 
            music.title.toLowerCase().includes(keyword.toLowerCase()) ||
            music.description.toLowerCase().includes(keyword.toLowerCase())
        );
        
        // 为每个音乐添加标签信息
        return filteredMusics.map(music => {
            // 获取该音乐的标签
            const musicTags = mediaTags
                .filter(tag => tag.media_id === music.id)
                .map(tag => {
                    const tagInfo = allTags.find(t => t.id === tag.tag_id);
                    return {
                        ...tagInfo,
                        category: categoryMap[tagInfo.category_id]
                    };
                });
            
            return {
                ...music,
                tags: musicTags
            };
        });
    } catch (error) {
        console.error('搜索音乐时出错:', error);
        return [];
    }
}

// 搜索视频
async function searchVideos(keyword) {
    try {
        // 获取视频列表
        const { data: videos, error: videoError } = await window.supabaseClient
            .from('videos')
            .select('*');
        
        if (videoError) throw videoError;
        
        // 获取所有标签
        const { data: allTags, error: tagsError } = await window.supabaseClient
            .from('tags')
            .select('*');
        
        if (tagsError) throw tagsError;
        
        // 获取所有标签类别
        const { data: categories, error: categoriesError } = await window.supabaseClient
            .from('tag_categories')
            .select('*');
        
        if (categoriesError) throw categoriesError;
        
        // 创建类别ID到名称的映射
        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category.id] = category.name;
        });
        
        // 获取视频标签关联
        const { data: mediaTags, error: mediaTagsError } = await window.supabaseClient
            .from('media_tags')
            .select('*')
            .eq('media_type', 'video');
        
        if (mediaTagsError) throw mediaTagsError;
        
        // 过滤包含关键词的视频
        const filteredVideos = videos.filter(video => 
            video.title.toLowerCase().includes(keyword.toLowerCase()) ||
            video.description.toLowerCase().includes(keyword.toLowerCase())
        );
        
        // 为每个视频添加标签信息
        return filteredVideos.map(video => {
            // 获取该视频的标签
            const videoTags = mediaTags
                .filter(tag => tag.media_id === video.id)
                .map(tag => {
                    const tagInfo = allTags.find(t => t.id === tag.tag_id);
                    return {
                        ...tagInfo,
                        category: categoryMap[tagInfo.category_id]
                    };
                });
            
            return {
                ...video,
                tags: videoTags
            };
        });
    } catch (error) {
        console.error('搜索视频时出错:', error);
        return [];
    }
}

// 显示搜索结果
function displaySearchResults(musicResults, videoResults, keyword) {
    const searchResults = document.getElementById('search-results');
    
    if (!searchResults) return;
    
    // 如果没有结果
    if (musicResults.length === 0 && videoResults.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">未找到与 "' + keyword + '" 相关的结果</div>';
        return;
    }
    
    let html = '';
    
    // 显示音乐结果
    if (musicResults.length > 0) {
        html += '<div class="search-results-section">';
        html += '<h3>音乐</h3>';
        html += '<div class="search-results-grid">';
        
        musicResults.forEach(music => {
            html += `
                <div class="search-result-item">
                    <div class="search-result-content">
                        <h4>${music.title}</h4>
                        <p>${music.description || ''}</p>
                        <div class="search-result-tags">
                            ${music.tags.map(tag => 
                                `<span class="tag tag-${tag.category}">${tag.name}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div></div>';
    }
    
    // 显示视频结果
    if (videoResults.length > 0) {
        html += '<div class="search-results-section">';
        html += '<h3>视频</h3>';
        html += '<div class="search-results-grid">';
        
        videoResults.forEach(video => {
            html += `
                <div class="search-result-item">
                    <div class="search-result-content">
                        <h4>${video.title}</h4>
                        <p>${video.description || ''}</p>
                        <div class="search-result-tags">
                            ${video.tags.map(tag => 
                                `<span class="tag tag-${tag.category}">${tag.name}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div></div>';
    }
    
    searchResults.innerHTML = html;
}