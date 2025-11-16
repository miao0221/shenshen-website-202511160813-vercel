export class Music {
    async render() {
        const songs = [
            { id: 1, title: '大鱼', album: '深的深', year: 2017 },
            { id: 2, title: '光亮', album: '紫禁城', year: 2021 },
            { id: 3, title: '起风了', album: '.single', year: 2021 },
            { id: 4, title: '灯火里的中国', album: '.single', year: 2021 },
            { id: 5, title: '人是_', album: '化身孤岛的鲸', year: 2022 }
        ];
        
        const songsList = songs.map(song => `
            <li class="song-item">
                <h3>${song.title}</h3>
                <p>专辑: ${song.album} (${song.year})</p>
            </li>
        `).join('');
        
        const content = `
            <div class="page-container">
                <h1>音乐作品</h1>
                <div class="content">
                    <ul class="songs-list">
                        ${songsList}
                    </ul>
                </div>
            </div>
        `;
        
        document.querySelector('#app').innerHTML += content;
    }
}