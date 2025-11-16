export async function renderMusicPage() {
    let songs = [];
    
    try {
        // 从数据库获取音乐列表
        const { data, error } = await window.supabaseClient
            .from('musics')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('获取音乐列表时出错:', error);
        } else {
            songs = data;
            
            // 为每首音乐获取标签
            for (let i = 0; i < songs.length; i++) {
                // 获取媒体标签关联
                const { data: mediaTagsData, error: mediaTagsError } = await window.supabaseClient
                    .from('media_tags')
                    .select('tag_id')
                    .eq('media_type', 'music')
                    .eq('media_id', songs[i].id);
                
                if (!mediaTagsError && mediaTagsData.length > 0) {
                    // 获取标签详细信息
                    const tagIds = mediaTagsData.map(item => item.tag_id);
                    const { data: tagsData, error: tagsError } = await window.supabaseClient
                        .from('tags')
                        .select('*')
                        .in('id', tagIds);
                    
                    if (!tagsError) {
                        // 获取标签类别信息
                        const categoryIds = [...new Set(tagsData.map(tag => tag.category_id))];
                        const { data: categoriesData, error: categoriesError } = await window.supabaseClient
                            .from('tag_categories')
                            .select('*')
                            .in('id', categoryIds);
                        
                        if (!categoriesError) {
                            // 创建类别ID到名称的映射
                            const categoryMap = {};
                            categoriesData.forEach(category => {
                                categoryMap[category.id] = category.name;
                            });
                            
                            // 为每个标签添加类别名称
                            const tagsWithCategories = tagsData.map(tag => ({
                                ...tag,
                                category_name: categoryMap[tag.category_id] || '未知类别'
                            }));
                            
                            songs[i].tags = tagsWithCategories;
                        } else {
                            songs[i].tags = [];
                        }
                    } else {
                        songs[i].tags = [];
                    }
                } else {
                    songs[i].tags = [];
                }
            }
        }
    } catch (error) {
        console.error('获取音乐列表时出错:', error);
    }

    const songsList = songs.map(song => {
        // 生成标签HTML
        let tagsHTML = '';
        if (song.tags && song.tags.length > 0) {
            tagsHTML = '<div class="tags-container">';
            song.tags.forEach(tag => {
                tagsHTML += `<span class="tag">${tag.category_name}: ${tag.name}</span>`;
            });
            tagsHTML += '</div>';
        }
        
        return `
            <div class="media-card">
                <img src="https://placehold.co/300x180/1a1a4a/64c8ff?text=${encodeURIComponent(song.title)}" alt="${song.title}" loading="lazy">
                <div class="media-info">
                    <h3>${song.title}</h3>
                    <p>专辑: ${song.album}</p>
                    <p>年份: ${song.year}</p>
                    ${tagsHTML}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="page-container music-page">
            <h2>音乐作品</h2>
            <div class="media-list">
                ${songsList || '<p>暂无音乐作品</p>'}
            </div>
        </div>
    `;
}