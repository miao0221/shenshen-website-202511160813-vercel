import { isAdmin, addAdmin, removeAdmin, getAdmins } from '../utils/admin.js';

// 管理员页面模块

export function renderAdminPage() {
    // 直接返回管理界面，认证检查在setupAdminPage中进行
    return `
        <div class="page-container admin-page">
            <div class="admin-header">
                <h2>管理员中心</h2>
            </div>
            
            <div class="admin-tabs">
                <button class="tab-btn" data-tab="music-upload">音乐上传</button>
                <button class="tab-btn" data-tab="video-upload">视频上传</button>
                <button class="tab-btn" data-tab="manage-music">音乐管理</button>
                <button class="tab-btn" data-tab="manage-videos">视频管理</button>
                <button class="tab-btn" data-tab="admins">管理员管理</button>
            </div>
            
            <div class="tab-content">
                <div id="music-upload-tab" class="tab-pane" style="display: none;">
                    <h3>上传音乐</h3>
                    <form id="music-form" class="admin-form">
                        <div class="form-group">
                            <label for="music-title">歌曲标题:</label>
                            <input type="text" id="music-title" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="music-album">专辑:</label>
                            <input type="text" id="music-album" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="music-year">年份:</label>
                            <input type="number" id="music-year" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="music-file">音频文件:</label>
                            <input type="file" id="music-file" accept="audio/*" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">上传音乐</button>
                    </form>
                </div>
                
                <div id="video-upload-tab" class="tab-pane" style="display: none;">
                    <h3>上传视频</h3>
                    <form id="video-form" class="admin-form">
                        <div class="form-group">
                            <label for="video-title">视频标题:</label>
                            <input type="text" id="video-title" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="video-description">描述:</label>
                            <textarea id="video-description" rows="3" required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="video-file">视频文件:</label>
                            <input type="file" id="video-file" accept="video/*" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">上传视频</button>
                    </form>
                </div>
                
                <div id="manage-music-tab" class="tab-pane" style="display: none;">
                    <h3>管理音乐作品</h3>
                    <div id="music-list-container">
                        <p>加载中...</p>
                    </div>
                </div>
                
                <div id="manage-videos-tab" class="tab-pane" style="display: none;">
                    <h3>管理视频作品</h3>
                    <div id="video-list-container">
                        <p>加载中...</p>
                    </div>
                </div>
                
                <div id="admins-tab" class="tab-pane" style="display: none;">
                    <h3>管理员管理</h3>
                    <div class="admin-form">
                        <div class="form-group">
                            <label for="new-admin-email">添加管理员 (输入用户邮箱):</label>
                            <input type="email" id="new-admin-email" placeholder="user@example.com">
                        </div>
                        <button id="add-admin-btn" class="btn btn-primary">添加管理员</button>
                        
                        <div id="admin-list">
                            <h4>当前管理员列表</h4>
                            <div id="admins-container"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="upload-status"></div>
            
            <!-- 编辑音乐模态框 -->
            <div id="edit-music-modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3>编辑音乐信息</h3>
                    <form id="edit-music-form">
                        <input type="hidden" id="edit-music-id">
                        <div class="form-group">
                            <label for="edit-music-title">歌曲标题:</label>
                            <input type="text" id="edit-music-title" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-music-album">专辑:</label>
                            <input type="text" id="edit-music-album" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-music-year">年份:</label>
                            <input type="number" id="edit-music-year" required>
                        </div>
                        <button type="submit" class="btn btn-primary">保存更改</button>
                    </form>
                </div>
            </div>
            
            <!-- 编辑视频模态框 -->
            <div id="edit-video-modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3>编辑视频信息</h3>
                    <form id="edit-video-form">
                        <input type="hidden" id="edit-video-id">
                        <div class="form-group">
                            <label for="edit-video-title">视频标题:</label>
                            <input type="text" id="edit-video-title" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-video-description">描述:</label>
                            <textarea id="edit-video-description" rows="3" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">保存更改</button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

export async function setupAdminPage() {
    // 检查用户是否已登录且为管理员
    try {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) {
            // 用户未登录，显示登录提示
            const tabContent = document.querySelector('.tab-content');
            if (tabContent) {
                tabContent.innerHTML = `
                    <div class="login-form">
                        <h2>需要登录</h2>
                        <p>请先登录以访问管理员中心</p>
                        <button id="go-to-auth" class="btn btn-primary">前往登录</button>
                    </div>
                `;
                
                const goToAuthBtn = document.getElementById('go-to-auth');
                if (goToAuthBtn) {
                    goToAuthBtn.addEventListener('click', () => {
                        window.location.hash = '#/auth';
                    });
                }
            }
            return;
        }
        
        // 检查用户是否为管理员
        const userIsAdmin = await isAdmin();
        if (!userIsAdmin) {
            const tabContent = document.querySelector('.tab-content');
            if (tabContent) {
                tabContent.innerHTML = `
                    <div class="login-form">
                        <h2>权限不足</h2>
                        <p>您不是管理员，无法访问此功能</p>
                        <button id="go-to-home" class="btn btn-primary">返回首页</button>
                    </div>
                `;
                
                const goToHomeBtn = document.getElementById('go-to-home');
                if (goToHomeBtn) {
                    goToHomeBtn.addEventListener('click', () => {
                        window.location.hash = '#/';
                    });
                }
            }
            return;
        }
        
        // 显示第一个标签页
        const firstTab = document.querySelector('.tab-btn');
        if (firstTab) {
            firstTab.classList.add('active');
            const tabName = firstTab.getAttribute('data-tab');
            const targetPane = document.getElementById(tabName + '-tab');
            if (targetPane) {
                targetPane.style.display = 'block';
                
                // 如果是管理标签，加载内容
                if (tabName === 'manage-music') {
                    loadMusicList();
                } else if (tabName === 'manage-videos') {
                    loadVideoList();
                } else if (tabName === 'admins') {
                    loadAdmins();
                }
            }
        }
    } catch (error) {
        console.error('检查认证状态时出错:', error);
    }
    
    // 设置标签页切换
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新激活的标签按钮
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // 显示对应的标签内容
            const tabName = button.getAttribute('data-tab');
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.style.display = 'none';
            });
            
            const targetPane = document.getElementById(tabName + '-tab');
            if (targetPane) {
                targetPane.style.display = 'block';
                
                // 根据标签加载相应内容
                if (tabName === 'manage-music') {
                    loadMusicList();
                } else if (tabName === 'manage-videos') {
                    loadVideoList();
                } else if (tabName === 'admins') {
                    loadAdmins();
                }
            }
        });
    });
    
    // 设置表单提交事件（仅在用户已登录时）
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session) {
        const musicForm = document.getElementById('music-form');
        if (musicForm) {
            musicForm.addEventListener('submit', handleMusicUpload);
        }
        
        const videoForm = document.getElementById('video-form');
        if (videoForm) {
            videoForm.addEventListener('submit', handleVideoUpload);
        }
        
        // 设置管理员管理事件
        const addAdminBtn = document.getElementById('add-admin-btn');
        if (addAdminBtn) {
            addAdminBtn.addEventListener('click', handleAddAdmin);
        }
        
        // 设置编辑表单事件
        const editMusicForm = document.getElementById('edit-music-form');
        if (editMusicForm) {
            editMusicForm.addEventListener('submit', handleEditMusic);
        }
        
        const editVideoForm = document.getElementById('edit-video-form');
        if (editVideoForm) {
            editVideoForm.addEventListener('submit', handleEditVideo);
        }
        
        // 设置模态框关闭事件
        setupModalEvents();
    }
}

// 处理音乐上传
async function handleMusicUpload(e) {
    e.preventDefault();
    const statusDiv = document.getElementById('upload-status');
    statusDiv.innerHTML = '<p>正在上传音乐...</p>';
    
    try {
        // 获取表单数据
        const title = document.getElementById('music-title').value;
        const album = document.getElementById('music-album').value;
        const year = document.getElementById('music-year').value;
        const file = document.getElementById('music-file').files[0];
        
        if (!file) {
            statusDiv.innerHTML = '<p class="error">请选择音频文件</p>';
            return;
        }
        
        // 生成唯一的文件名
        const fileName = Date.now() + '-' + file.name;
        
        // 上传文件到Supabase
        const fileUrl = await uploadFileToSupabase(file, 'music', fileName);
        
        // 保存音乐信息到数据库
        const musicData = {
            title,
            album,
            year: parseInt(year),
            url: fileUrl,
            created_at: new Date().toISOString()
        };
        
        await saveMusicInfo(musicData);
        
        statusDiv.innerHTML = '<p class="success">音乐上传成功!</p>';
        
        // 发送自定义事件通知音乐页面更新
        window.dispatchEvent(new CustomEvent('musicUploaded'));
        
        // 重置表单
        document.getElementById('music-form').reset();
    } catch (error) {
        console.error('上传音乐时出错:', error);
        statusDiv.innerHTML = '<p class="error">上传失败: ' + error.message + '</p>';
    }
}

// 处理视频上传
async function handleVideoUpload(e) {
    e.preventDefault();
    const statusDiv = document.getElementById('upload-status');
    statusDiv.innerHTML = '<p>正在上传视频...</p>';
    
    try {
        // 获取表单数据
        const title = document.getElementById('video-title').value;
        const description = document.getElementById('video-description').value;
        const file = document.getElementById('video-file').files[0];
        
        if (!file) {
            statusDiv.innerHTML = '<p class="error">请选择视频文件</p>';
            return;
        }
        
        // 生成唯一的文件名
        const fileName = Date.now() + '-' + file.name;
        
        // 上传文件到Supabase
        const fileUrl = await uploadFileToSupabase(file, 'videos', fileName);
        
        // 保存视频信息到数据库
        const videoData = {
            title,
            description,
            url: fileUrl,
            created_at: new Date().toISOString()
        };
        
        console.log('准备保存视频数据:', videoData);
        await saveVideoInfo(videoData);
        
        statusDiv.innerHTML = '<p class="success">视频上传成功!</p>';
        
        // 发送自定义事件通知视频页面更新
        window.dispatchEvent(new CustomEvent('videoUploaded'));
        
        // 重置表单
        document.getElementById('video-form').reset();
    } catch (error) {
        console.error('上传视频时出错:', error);
        statusDiv.innerHTML = '<p class="error">上传失败: ' + error.message + '</p>';
    }
}

// 处理添加管理员
async function handleAddAdmin() {
    const emailInput = document.getElementById('new-admin-email');
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('请输入邮箱地址');
        return;
    }
    
    try {
        // 添加管理员
        const success = await addAdmin(email);
        if (success) {
            alert('管理员添加成功');
            emailInput.value = '';
            loadAdmins(); // 重新加载管理员列表
        } else {
            alert('添加管理员失败，可能该邮箱未注册或已为管理员');
        }
    } catch (error) {
        console.error('添加管理员时出错:', error);
        alert('添加管理员时出错: ' + error.message);
    }
}

// 加载管理员列表
async function loadAdmins() {
    try {
        const admins = await getAdmins();
        const container = document.getElementById('admins-container');
        
        if (!container) return;
        
        if (admins.length === 0) {
            container.innerHTML = '<p>暂无管理员</p>';
            return;
        }
        
        // 显示管理员列表
        let adminListHTML = '<ul class="admin-list">';
        for (const admin of admins) {
            adminListHTML += `<li>${admin.email}</li>`;
        }
        adminListHTML += '</ul>';
        
        container.innerHTML = adminListHTML;
    } catch (error) {
        console.error('加载管理员列表时出错:', error);
        const container = document.getElementById('admins-container');
        if (container) {
            container.innerHTML = '<p>加载管理员列表时出错</p>';
        }
    }
}

// 加载音乐列表
async function loadMusicList() {
    try {
        const { data: musics, error } = await window.supabaseClient
            .from('musics')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        const container = document.getElementById('music-list-container');
        if (!container) return;
        
        if (musics.length === 0) {
            container.innerHTML = '<p>暂无音乐作品</p>';
            return;
        }
        
        let musicListHTML = '<div class="media-list">';
        musics.forEach(music => {
            musicListHTML += `
                <div class="media-card admin-media-card" data-id="${music.id}">
                    <div class="media-info">
                        <h3>${music.title}</h3>
                        <p>专辑: ${music.album}</p>
                        <p>年份: ${music.year}</p>
                        <div class="admin-actions">
                            <button class="btn btn-secondary edit-music-btn" data-id="${music.id}">编辑</button>
                            <button class="btn btn-danger delete-music-btn" data-id="${music.id}">删除</button>
                        </div>
                    </div>
                </div>
            `;
        });
        musicListHTML += '</div>';
        
        container.innerHTML = musicListHTML;
        
        // 添加编辑和删除按钮事件
        document.querySelectorAll('.edit-music-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const music = musics.find(m => m.id == id);
                openEditMusicModal(music);
            });
        });
        
        document.querySelectorAll('.delete-music-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const music = musics.find(m => m.id == id);
                if (confirm(`确定要删除音乐 "${music.title}" 吗？`)) {
                    deleteMusic(id);
                }
            });
        });
    } catch (error) {
        console.error('加载音乐列表时出错:', error);
        const container = document.getElementById('music-list-container');
        if (container) {
            container.innerHTML = '<p>加载音乐列表时出错: ' + error.message + '</p>';
        }
    }
}

// 加载视频列表
async function loadVideoList() {
    try {
        const { data: videos, error } = await window.supabaseClient
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        const container = document.getElementById('video-list-container');
        if (!container) return;
        
        if (videos.length === 0) {
            container.innerHTML = '<p>暂无视频作品</p>';
            return;
        }
        
        let videoListHTML = '<div class="media-list">';
        videos.forEach(video => {
            videoListHTML += `
                <div class="media-card admin-media-card" data-id="${video.id}">
                    <div class="media-info">
                        <h3>${video.title}</h3>
                        <p>${video.description}</p>
                        <div class="admin-actions">
                            <button class="btn btn-secondary edit-video-btn" data-id="${video.id}">编辑</button>
                            <button class="btn btn-danger delete-video-btn" data-id="${video.id}">删除</button>
                        </div>
                    </div>
                </div>
            `;
        });
        videoListHTML += '</div>';
        
        container.innerHTML = videoListHTML;
        
        // 添加编辑和删除按钮事件
        document.querySelectorAll('.edit-video-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const video = videos.find(v => v.id == id);
                openEditVideoModal(video);
            });
        });
        
        document.querySelectorAll('.delete-video-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const video = videos.find(v => v.id == id);
                if (confirm(`确定要删除视频 "${video.title}" 吗？`)) {
                    deleteVideo(id);
                }
            });
        });
    } catch (error) {
        console.error('加载视频列表时出错:', error);
        const container = document.getElementById('video-list-container');
        if (container) {
            container.innerHTML = '<p>加载视频列表时出错: ' + error.message + '</p>';
        }
    }
}

// 打开编辑音乐模态框
function openEditMusicModal(music) {
    document.getElementById('edit-music-id').value = music.id;
    document.getElementById('edit-music-title').value = music.title;
    document.getElementById('edit-music-album').value = music.album;
    document.getElementById('edit-music-year').value = music.year;
    
    document.getElementById('edit-music-modal').style.display = 'block';
}

// 打开编辑视频模态框
function openEditVideoModal(video) {
    document.getElementById('edit-video-id').value = video.id;
    document.getElementById('edit-video-title').value = video.title;
    document.getElementById('edit-video-description').value = video.description;
    
    document.getElementById('edit-video-modal').style.display = 'block';
}

// 处理音乐编辑
async function handleEditMusic(e) {
    e.preventDefault();
    
    try {
        const id = document.getElementById('edit-music-id').value;
        const title = document.getElementById('edit-music-title').value;
        const album = document.getElementById('edit-music-album').value;
        const year = document.getElementById('edit-music-year').value;
        
        const { error } = await window.supabaseClient
            .from('musics')
            .update({ title, album, year: parseInt(year) })
            .eq('id', id);
        
        if (error) {
            throw error;
        }
        
        // 关闭模态框
        document.getElementById('edit-music-modal').style.display = 'none';
        
        // 重新加载音乐列表
        loadMusicList();
        
        alert('音乐信息更新成功');
    } catch (error) {
        console.error('更新音乐信息时出错:', error);
        alert('更新音乐信息时出错: ' + error.message);
    }
}

// 处理视频编辑
async function handleEditVideo(e) {
    e.preventDefault();
    
    try {
        const id = document.getElementById('edit-video-id').value;
        const title = document.getElementById('edit-video-title').value;
        const description = document.getElementById('edit-video-description').value;
        
        const { error } = await window.supabaseClient
            .from('videos')
            .update({ title, description })
            .eq('id', id);
        
        if (error) {
            throw error;
        }
        
        // 关闭模态框
        document.getElementById('edit-video-modal').style.display = 'none';
        
        // 重新加载视频列表
        loadVideoList();
        
        alert('视频信息更新成功');
    } catch (error) {
        console.error('更新视频信息时出错:', error);
        alert('更新视频信息时出错: ' + error.message);
    }
}

// 删除音乐
async function deleteMusic(id) {
    try {
        const { error } = await window.supabaseClient
            .from('musics')
            .delete()
            .eq('id', id);
        
        if (error) {
            throw error;
        }
        
        // 重新加载音乐列表
        loadMusicList();
        
        alert('音乐删除成功');
    } catch (error) {
        console.error('删除音乐时出错:', error);
        alert('删除音乐时出错: ' + error.message);
    }
}

// 删除视频
async function deleteVideo(id) {
    try {
        const { error } = await window.supabaseClient
            .from('videos')
            .delete()
            .eq('id', id);
        
        if (error) {
            throw error;
        }
        
        // 重新加载视频列表
        loadVideoList();
        
        alert('视频删除成功');
    } catch (error) {
        console.error('删除视频时出错:', error);
        alert('删除视频时出错: ' + error.message);
    }
}

// 设置模态框事件
function setupModalEvents() {
    // 关闭模态框事件
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// 上传文件到 Supabase 存储
async function uploadFileToSupabase(file, bucket, fileName) {
    return new Promise((resolve, reject) => {
        window.supabaseClient
            .storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            })
            .then(({ data, error }) => {
                if (error) {
                    console.error('文件上传错误:', error);
                    reject(new Error('上传失败: ' + error.message));
                    return;
                }
                
                // 获取公共URL
                const { data: { publicUrl } } = window.supabaseClient
                    .storage
                    .from(bucket)
                    .getPublicUrl(fileName);
                
                resolve(publicUrl);
            })
            .catch(error => {
                console.error('文件上传异常:', error);
                reject(error);
            });
    });
}

// 保存音乐信息到数据库
async function saveMusicInfo(musicData) {
    return new Promise((resolve, reject) => {
        window.supabaseClient
            .from('musics')
            .insert([musicData])
            .select()
            .then(({ data, error }) => {
                if (error) {
                    console.error('保存音乐信息错误:', error);
                    reject(new Error('保存音乐信息失败: ' + error.message));
                    return;
                }
                
                resolve(data[0]);
            })
            .catch(error => {
                console.error('保存音乐信息异常:', error);
                reject(error);
            });
    });
}

// 保存视频信息到数据库
async function saveVideoInfo(videoData) {
    return new Promise((resolve, reject) => {
        window.supabaseClient
            .from('videos')
            .insert([videoData])
            .select()
            .then(({ data, error }) => {
                if (error) {
                    console.error('保存视频信息错误:', error);
                    reject(new Error('保存视频信息失败: ' + error.message));
                    return;
                }
                
                resolve(data[0]);
            })
            .catch(error => {
                console.error('保存视频信息异常:', error);
                reject(error);
            });
    });
}