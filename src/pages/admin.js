import { isAdmin, addAdmin, removeAdmin, getAdmins } from '../utils/admin.js';

// 管理员页面模块
let isAuthenticated = false;

export function renderAdminPage() {
    // 直接返回管理界面，认证检查在setupAdminPage中进行
    return `
        <div class="page-container admin-page">
            <div class="admin-header">
                <h2>管理员中心</h2>
            </div>
            
            <div class="admin-tabs">
                <button class="tab-btn active" data-tab="music">音乐上传</button>
                <button class="tab-btn" data-tab="video">视频上传</button>
                <button class="tab-btn" data-tab="admins">管理员管理</button>
            </div>
            
            <div class="tab-content">
                <div id="music-tab" class="tab-pane active">
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
                
                <div id="video-tab" class="tab-pane" style="display: none;">
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
                
                // 如果是管理员标签，加载管理员列表
                if (tabName === 'admins') {
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
        
        // 重置表单
        document.getElementById('music-form').reset();
    } catch (error) {
        console.error('上传音乐时出错:', error);
        statusDiv.innerHTML = '<p class="error">上传失败: ${error.message}</p>';
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
        
        // 重置表单
        document.getElementById('video-form').reset();
    } catch (error) {
        console.error('上传视频时出错:', error);
        statusDiv.innerHTML = '<p class="error">上传失败: ${error.message}</p>';
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
                    reject(new Error('上传失败: ${error.message}'));
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
                    reject(new Error('保存音乐信息失败: ${error.message}'));
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
                    reject(new Error('保存视频信息失败: ${error.message}'));
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