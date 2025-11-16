export function renderMusicPage() {
    // 示例歌曲数据
    const songs = [
        {
            id: 1,
            title: "大鱼",
            album: "深的深",
            year: "2016"
        },
        {
            id: 2,
            title: "光亮",
            album: "光亮",
            year: "2021"
        },
        {
            id: 3,
            title: "起风了",
            album: "起风了",
            year: "2021"
        },
        {
            id: 4,
            title: "化身孤岛的鲸",
            album: "化身孤岛的鲸",
            year: "2021"
        },
        {
            id: 5,
            title: "灯火里的中国",
            album: "灯火里的中国",
            year: "2021"
        },
        {
            id: 6,
            title: "可它爱着这个世界",
            album: "可它爱着这个世界",
            year: "2018"
        }
    ];

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
                ${songsList}
            </div>
        </div>
    `;
}