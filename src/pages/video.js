export async function renderVideoPage() {
    let videos = [];
    
    try {
        // 从数据库获取视频列表
        const { data, error } = await window.supabaseClient
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('获取视频列表时出错:', error);
        } else {
            videos = data;
        }
    } catch (error) {
        console.error('获取视频列表时出错:', error);
    }

    const videosList = videos.map(video => `
        <div class="media-card">
            <img src="https://placehold.co/300x180/1a1a4a/64c8ff?text=${encodeURIComponent(video.title)}" alt="${video.title}" loading="lazy">
            <div class="media-info">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            </div>
        </div>
    `).join('');

    return `
        <div class="page-container video-page">
            <h2>视频作品</h2>
            <div class="media-list">
                ${videosList || '<p>暂无视频作品</p>'}
            </div>
        </div>
    `;
}