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
        
        // 为每首音乐获取标签
        const musicsWithTags = musics.map(music => {
            // 获取该音乐的标签ID
            const musicTagIds = mediaTags
                .filter(mt => mt.media_id === music.id)
                .map(mt => mt.tag_id);
            
            // 获取标签详细信息
            const tags = allTags
                .filter(tag => musicTagIds.includes(tag.id))
                .map(tag => ({
                    ...tag,
                    category_name: categoryMap[tag.category_id] || '未知类别'
                }));
            
            return {
                ...music,
                tags
            };
        });
        
        // 根据关键字过滤音乐
        const filteredMusics = musicsWithTags.filter(music => {
            // 检查标题
            if (music.title.toLowerCase().includes(keyword.toLowerCase())) {
                return true;
            }
            
            // 检查专辑
            if (music.album && music.album.toLowerCase().includes(keyword.toLowerCase())) {
                return true;
            }
            
            // 检查标签
            return music.tags.some(tag => 
                tag.name.toLowerCase().includes(keyword.toLowerCase()) ||
                tag.category_name.toLowerCase().includes(keyword.toLowerCase())
            );
        });
        
        return filteredMusics;
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
        
        // 为每个视频获取标签
        const videosWithTags = videos.map(video => {
            // 获取该视频的标签ID
            const videoTagIds = mediaTags
                .filter(mt => mt.media_id === video.id)
                .map(mt => mt.tag_id);
            
            // 获取标签详细信息
            const tags = allTags
                .filter(tag => videoTagIds.includes(tag.id))
                .map(tag => ({
                    ...tag,
                    category_name: categoryMap[tag.category_id] || '未知类别'
                }));
            
            return {
                ...video,
                tags
            };
        });
        
        // 根据关键字过滤视频
        const filteredVideos = videosWithTags.filter(video => {
            // 检查标题
            if (video.title.toLowerCase().includes(keyword.toLowerCase())) {
                return true;
            }
            
            // 检查描述
            if (video.description && video.description.toLowerCase().includes(keyword.toLowerCase())) {
                return true;
            }
            
            // 检查标签
            return video.tags.some(tag => 
                tag.name.toLowerCase().includes(keyword.toLowerCase()) ||
                tag.category_name.toLowerCase().includes(keyword.toLowerCase())
            );
        });
        
        return filteredVideos;
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
    
    // 构建搜索结果HTML
    let resultsHTML = '';
    
    // 添加音乐结果
    if (musicResults.length > 0) {
        musicResults.forEach(music => {
            let tagsHTML = '';
            if (music.tags && music.tags.length > 0) {
                tagsHTML = '<div class="search-result-tags">';
                music.tags.forEach(tag => {
                    tagsHTML += `<span class="search-result-tag">${tag.category_name}: ${tag.name}</span>`;
                });
                tagsHTML += '</div>';
            }
            
            resultsHTML += `
                <div class="search-result-item" data-type="music" data-id="${music.id}">
                    <div class="search-result-title">${music.title}</div>
                    <span class="search-result-type music">音乐</span>
                    <div>专辑: ${music.album || '未知'}</div>
                    ${tagsHTML}
                </div>
            `;
        });
    }
    
    // 添加视频结果
    if (videoResults.length > 0) {
        videoResults.forEach(video => {
            let tagsHTML = '';
            if (video.tags && video.tags.length > 0) {
                tagsHTML = '<div class="search-result-tags">';
                video.tags.forEach(tag => {
                    tagsHTML += `<span class="search-result-tag">${tag.category_name}: ${tag.name}</span>`;
                });
                tagsHTML += '</div>';
            }
            
            resultsHTML += `
                <div class="search-result-item" data-type="video" data-id="${video.id}">
                    <div class="search-result-title">${video.title}</div>
                    <span class="search-result-type video">视频</span>
                    <div>${video.description || '无描述'}</div>
                    ${tagsHTML}
                </div>
            `;
        });
    }
    
    searchResults.innerHTML = resultsHTML;
    
    // 添加点击事件
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const type = item.getAttribute('data-type');
            const id = item.getAttribute('data-id');
            
            // 根据类型跳转到相应页面
            if (type === 'music') {
                window.location.hash = `#/music`;
            } else if (type === 'video') {
                window.location.hash = `#/video`;
            }
        });
    });
}