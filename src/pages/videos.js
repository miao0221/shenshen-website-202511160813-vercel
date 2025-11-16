export class Videos {
    async render() {
        const videos = [
            { id: 1, title: '周深《大鱼》MV', duration: '4:30' },
            { id: 2, title: '周深《光亮》MV', duration: '4:15' },
            { id: 3, title: '周深现场演唱《起风了》', duration: '5:20' },
            { id: 4, title: '周深《灯火里的中国》演唱会', duration: '4:50' }
        ];
        
        const videosList = videos.map(video => `
            <li class="video-item">
                <h3>${video.title}</h3>
                <p>时长: ${video.duration}</p>
            </li>
        `).join('');
        
        const content = `
            <div class="page-container">
                <h1>视频内容</h1>
                <div class="content">
                    <ul class="videos-list">
                        ${videosList}
                    </ul>
                </div>
            </div>
        `;
        
        document.querySelector('#app').innerHTML += content;
    }
}