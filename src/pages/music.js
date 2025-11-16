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
        }
    } catch (error) {
        console.error('获取音乐列表时出错:', error);
    }

    const songsList = songs.map(song => `
        <div class="media-card">
            <img src="https://placehold.co/300x180/1a1a4a/64c8ff?text=${encodeURIComponent(song.title)}" alt="${song.title}" loading="lazy">
            <div class="media-info">
                <h3>${song.title}</h3>
                <p>专辑: ${song.album}</p>
                <p>年份: ${song.year}</p>
            </div>
        </div>
    `).join('');

    return `
        <div class="page-container music-page">
            <h2>音乐作品</h2>
            <div class="media-list">
                ${songsList || '<p>暂无音乐作品</p>'}
            </div>
        </div>
    `;
}