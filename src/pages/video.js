export function renderVideoPage() {
    // 示例视频数据
    const videos = [
        {
            id: 1,
            title: "周深《大鱼》MV",
            description: "周深代表作《大鱼》官方MV"
        },
        {
            id: 2,
            title: "周深《光亮》MV",
            description: "周深为纪录片《紫禁城》演唱的主题歌"
        },
        {
            id: 3,
            title: "周深《起风了》现场版",
            description: "周深翻唱歌曲《起风了》演唱会版本"
        },
        {
            id: 4,
            title: "周深《化身孤岛的鲸》MV",
            description: "周深首支个人原创单曲"
        },
        {
            id: 5,
            title: "周深《灯火里的中国》MV",
            description: "央视春晚歌曲《灯火里的中国》"
        },
        {
            id: 6,
            title: "周深《可它爱着这个世界》MV",
            description: "动画《夏目友人帐》中文主题曲"
        }
    ];

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
                ${videosList}
            </div>
        </div>
    `;
}