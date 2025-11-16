export class Home {
    async render() {
        const content = `
            <div class="page-container">
                <h1>欢迎来到周深粉丝网站</h1>
                <div class="content">
                    <p>周深（Curtis Chou），中国内地男歌手，以其独特的嗓音和广泛的音域而闻名。</p>
                    <p>他的音乐风格多样，涵盖了流行、民谣、古典等多种类型，赢得了众多粉丝的喜爱。</p>
                    <p>在这里你可以了解到周深的最新动态、音乐作品和视频内容。</p>
                </div>
            </div>
        `;
        
        document.querySelector('#app').innerHTML += content;
    }
}