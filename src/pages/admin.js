class AdminPage {
    render() {
        return `
            <div class="admin-page">
                <header class="page-header">
                    <h1>管理员面板</h1>
                    <p>管理网站内容和上传音视频文件</p>
                </header>
                
                <section class="admin-content">
                    <div class="admin-tabs">
                        <button class="tab-button active" data-tab="upload">文件上传</button>
                        <button class="tab-button" data-tab="manage">内容管理</button>
                        <button class="tab-button" data-tab="users">用户管理</button>
                    </div>
                    
                    <div class="tab-content">
                        <div id="upload-tab" class="tab-pane active">
                            <h2>上传文件</h2>
                            <form id="upload-form" class="upload-form">
                                <div class="form-group">
                                    <label for="file-type">文件类型:</label>
                                    <select id="file-type" required>
                                        <option value="">请选择文件类型</option>
                                        <option value="image">图片</option>
                                        <option value="music">音乐</option>
                                        <option value="video">视频</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="file-upload">选择文件:</label>
                                    <input type="file" id="file-upload" accept="*" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="file-title">标题:</label>
                                    <input type="text" id="file-title" placeholder="请输入文件标题" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="file-description">描述:</label>
                                    <textarea id="file-description" placeholder="请输入文件描述"></textarea>
                                </div>
                                
                                <button type="submit" class="btn primary">上传文件</button>
                            </form>
                            
                            <div id="upload-progress" class="upload-progress hidden">
                                <div class="progress-bar">
                                    <div class="progress-fill"></div>
                                </div>
                                <p>正在上传... <span id="progress-text">0%</span></p>
                            </div>
                        </div>
                        
                        <div id="manage-tab" class="tab-pane hidden">
                            <h2>内容管理</h2>
                            <div class="content-list">
                                <table class="content-table">
                                    <thead>
                                        <tr>
                                            <th>标题</th>
                                            <th>类型</th>
                                            <th>上传时间</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>《大鱼》MV</td>
                                            <td>视频</td>
                                            <td>2025-10-01</td>
                                            <td>
                                                <button class="btn small">编辑</button>
                                                <button class="btn small danger">删除</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>最新访谈照片</td>
                                            <td>图片</td>
                                            <td>2025-09-28</td>
                                            <td>
                                                <button class="btn small">编辑</button>
                                                <button class="btn small danger">删除</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div id="users-tab" class="tab-pane hidden">
                            <h2>用户管理</h2>
                            <div class="users-list">
                                <table class="content-table">
                                    <thead>
                                        <tr>
                                            <th>用户名</th>
                                            <th>邮箱</th>
                                            <th>角色</th>
                                            <th>注册时间</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>admin</td>
                                            <td>admin@example.com</td>
                                            <td>管理员</td>
                                            <td>2025-01-01</td>
                                            <td>
                                                <button class="btn small">编辑权限</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    afterRender() {
        // 绑定标签页切换事件
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // 绑定上传表单事件
        const uploadForm = document.getElementById('upload-form');
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleUpload();
            });
        }
    }

    switchTab(tabName) {
        // 隐藏所有标签页
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.add('hidden');
        });
        
        // 移除所有激活状态
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // 显示选中的标签页
        document.getElementById(`${tabName}-tab`).classList.remove('hidden');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    handleUpload() {
        // 获取表单数据
        const fileType = document.getElementById('file-type').value;
        const fileInput = document.getElementById('file-upload');
        const title = document.getElementById('file-title').value;
        const description = document.getElementById('file-description').value;
        
        if (!fileType || !fileInput.files[0] || !title) {
            alert('请填写所有必填字段');
            return;
        }
        
        // 显示上传进度
        const progressContainer = document.getElementById('upload-progress');
        const progressText = document.getElementById('progress-text');
        progressContainer.classList.remove('hidden');
        
        // 模拟上传过程
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressText.textContent = `${progress}%`;
            document.querySelector('.progress-fill').style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    progressContainer.classList.add('hidden');
                    alert('文件上传成功！');
                }, 500);
            }
        }, 300);
        
        console.log('上传文件:', { fileType, file: fileInput.files[0], title, description });
    }
}

export default new AdminPage();