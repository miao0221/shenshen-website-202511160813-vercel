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
                <button class="tab-btn" data-tab="tag-management">标签管理</button>
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
                
                <div id="tag-management-tab" class="tab-pane" style="display: none;">
                    <h3>标签管理</h3>
                    <div class="tag-management-container">
                        <div class="tag-category-section">
                            <h4>创建标签类别</h4>
                            <form id="category-form" class="admin-form">
                                <div class="form-group">
                                    <label for="category-name">类别名称:</label>
                                    <input type="text" id="category-name" required>
                                </div>
                                <button type="submit" class="btn btn-primary">创建类别</button>
                            </form>
                            
                            <div id="category-list">
                                <h4>现有类别</h4>
                                <div id="categories-container">
                                    <p>加载中...</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tag-section">
                            <h4>创建标签</h4>
                            <form id="tag-form" class="admin-form">
                                <div class="form-group">
                                    <label for="tag-category">选择类别:</label>
                                    <select id="tag-category" required>
                                        <option value="">请选择类别</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="tag-name">标签名称:</label>
                                    <input type="text" id="tag-name" required>
                                </div>
                                <button type="submit" class="btn btn-primary">创建标签</button>
                            </form>
                            
                            <div id="tag-list">
                                <h4>现有标签</h4>
                                <div id="tags-container">
                                    <p>加载中...</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="media-tag-section">
                            <h4>给媒体添加标签</h4>
                            <div class="media-selection">
                                <label>
                                    <input type="radio" name="media-type" value="music" checked> 音乐
                                </label>
                                <label>
                                    <input type="radio" name="media-type" value="video"> 视频
                                </label>
                            </div>
                            <div class="form-group">
                                <label for="media-selection">选择媒体:</label>
                                <select id="media-selection" required>
                                    <option value="">请选择媒体</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="media-tags">选择标签:</label>
                                <select id="media-tags" multiple size="5">
                                    <option value="">请先选择媒体</option>
                                </select>
                            </div>
                            <button id="assign-tags-btn" class="btn btn-primary">分配标签</button>
                        </div>
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
                        
                        <!-- 音乐标签管理 -->
                        <div class="form-group">
                            <label>标签管理:</label>
                            <div id="music-tags-container">
                                <p>加载标签中...</p>
                            </div>
                            <div class="tag-search-container">
                                <input type="text" id="music-tag-search" placeholder="搜索标签..." class="tag-search-input">
                                <div id="music-tag-search-results" class="tag-search-results"></div>
                            </div>
                            <button type="button" id="save-music-tags" class="btn btn-secondary">保存标签</button>
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
                        
                        <!-- 视频标签管理 -->
                        <div class="form-group">
                            <label>标签管理:</label>
                            <div id="video-tags-container">
                                <p>加载标签中...</p>
                            </div>
                            <div class="tag-search-container">
                                <input type="text" id="video-tag-search" placeholder="搜索标签..." class="tag-search-input">
                                <div id="video-tag-search-results" class="tag-search-results"></div>
                            </div>
                            <button type="button" id="save-video-tags" class="btn btn-secondary">保存标签</button>
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
                } else if (tabName === 'tag-management') {
                    loadTagManagement();
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
                } else if (tabName === 'tag-management') {
                    loadTagManagement();
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
        
        // 设置标签管理表单事件
        const categoryForm = document.getElementById('category-form');
        if (categoryForm) {
            categoryForm.addEventListener('submit', handleCreateCategory);
        }
        
        const tagForm = document.getElementById('tag-form');
        if (tagForm) {
            tagForm.addEventListener('submit', handleCreateTag);
        }
        
        const assignTagsBtn = document.getElementById('assign-tags-btn');
        if (assignTagsBtn) {
            assignTagsBtn.addEventListener('click', handleAssignTags);
        }
        
        // 设置媒体类型切换事件
        const mediaTypeRadios = document.querySelectorAll('input[name="media-type"]');
        mediaTypeRadios.forEach(radio => {
            radio.addEventListener('change', handleMediaTypeChange);
        });
        
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
        
        // 设置标签保存按钮事件
        const saveMusicTagsBtn = document.getElementById('save-music-tags');
        if (saveMusicTagsBtn) {
            saveMusicTagsBtn.addEventListener('click', () => {
                const musicId = document.getElementById('edit-music-id').value;
                const selectedTagIds = Array.from(document.querySelectorAll('#music-tags-container .selected-tag'))
                    .map(tag => parseInt(tag.getAttribute('data-id')));
                saveMediaTags('music', musicId, selectedTagIds);
            });
        }
        
        const saveVideoTagsBtn = document.getElementById('save-video-tags');
        if (saveVideoTagsBtn) {
            saveVideoTagsBtn.addEventListener('click', () => {
                const videoId = document.getElementById('edit-video-id').value;
                const selectedTagIds = Array.from(document.querySelectorAll('#video-tags-container .selected-tag'))
                    .map(tag => parseInt(tag.getAttribute('data-id')));
                saveMediaTags('video', videoId, selectedTagIds);
            });
        }
    }
}

// 处理标签类别创建
async function handleCreateCategory(e) {
    e.preventDefault();
    
    const categoryName = document.getElementById('category-name').value.trim();
    if (!categoryName) {
        alert('请输入类别名称');
        return;
    }
    
    try {
        const { data, error } = await window.supabaseClient
            .from('tag_categories')
            .insert([{ name: categoryName }])
            .select();
        
        if (error) throw error;
        
        alert('标签类别创建成功');
        document.getElementById('category-name').value = '';
        loadCategories(); // 重新加载类别列表
        loadTagFormCategories(); // 更新标签表单中的类别选项
    } catch (error) {
        console.error('创建标签类别时出错:', error);
        alert('创建标签类别失败: ' + error.message);
    }
}

// 处理标签创建
async function handleCreateTag(e) {
    e.preventDefault();
    
    const categoryId = document.getElementById('tag-category').value;
    const tagName = document.getElementById('tag-name').value.trim();
    
    if (!categoryId) {
        alert('请选择标签类别');
        return;
    }
    
    if (!tagName) {
        alert('请输入标签名称');
        return;
    }
    
    try {
        const { data, error } = await window.supabaseClient
            .from('tags')
            .insert([{ category_id: categoryId, name: tagName }])
            .select();
        
        if (error) throw error;
        
        alert('标签创建成功');
        document.getElementById('tag-name').value = '';
        loadTags(); // 重新加载标签列表
    } catch (error) {
        console.error('创建标签时出错:', error);
        alert('创建标签失败: ' + error.message);
    }
}

// 处理媒体类型切换
async function handleMediaTypeChange() {
    const mediaType = document.querySelector('input[name="media-type"]:checked').value;
    loadMediaSelection(mediaType);
}

// 处理标签分配
async function handleAssignTags() {
    const mediaType = document.querySelector('input[name="media-type"]:checked').value;
    const mediaId = document.getElementById('media-selection').value;
    const selectedTags = Array.from(document.getElementById('media-tags').selectedOptions)
        .map(option => option.value);
    
    if (!mediaId) {
        alert('请选择媒体');
        return;
    }
    
    if (selectedTags.length === 0) {
        alert('请选择至少一个标签');
        return;
    }
    
    try {
        // 先删除现有的标签关联
        await window.supabaseClient
            .from('media_tags')
            .delete()
            .eq('media_type', mediaType)
            .eq('media_id', mediaId);
        
        // 插入新的标签关联
        const mediaTags = selectedTags.map(tagId => ({
            media_type: mediaType,
            media_id: mediaId,
            tag_id: tagId
        }));
        
        const { error } = await window.supabaseClient
            .from('media_tags')
            .insert(mediaTags);
        
        if (error) throw error;
        
        alert('标签分配成功');
    } catch (error) {
        console.error('分配标签时出错:', error);
        alert('分配标签失败: ' + error.message);
    }
}

// 加载标签管理页面
async function loadTagManagement() {
    loadCategories();
    loadTags();
    loadTagFormCategories();
    loadMediaSelection('music'); // 默认加载音乐
}

// 加载标签类别
async function loadCategories() {
    try {
        const { data, error } = await window.supabaseClient
            .from('tag_categories')
            .select('*')
            .order('name');
        
        if (error) throw error;
        
        const container = document.getElementById('categories-container');
        if (!container) return;
        
        if (data.length === 0) {
            container.innerHTML = '<p>暂无标签类别</p>';
            return;
        }
        
        let categoriesHTML = '<div class="category-list">';
        data.forEach(category => {
            categoriesHTML += `
                <div class="category-item" data-id="${category.id}">
                    <span>${category.name}</span>
                    <button class="btn btn-danger btn-small delete-category-btn" data-id="${category.id}">删除</button>
                </div>
            `;
        });
        categoriesHTML += '</div>';
        
        container.innerHTML = categoriesHTML;
        
        // 添加删除按钮事件
        document.querySelectorAll('.delete-category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('确定要删除这个类别吗？这将同时删除该类别下的所有标签。')) {
                    deleteCategory(id);
                }
            });
        });
    } catch (error) {
        console.error('加载标签类别时出错:', error);
        const container = document.getElementById('categories-container');
        if (container) {
            container.innerHTML = '<p>加载标签类别时出错: ' + error.message + '</p>';
        }
    }
}

// 加载标签表单中的类别选项
async function loadTagFormCategories() {
    try {
        const { data, error } = await window.supabaseClient
            .from('tag_categories')
            .select('*')
            .order('name');
        
        if (error) throw error;
        
        const select = document.getElementById('tag-category');
        if (!select) return;
        
        if (data.length === 0) {
            select.innerHTML = '<option value="">暂无类别，请先创建</option>';
            return;
        }
        
        let optionsHTML = '<option value="">请选择类别</option>';
        data.forEach(category => {
            optionsHTML += `<option value="${category.id}">${category.name}</option>`;
        });
        
        select.innerHTML = optionsHTML;
    } catch (error) {
        console.error('加载标签类别选项时出错:', error);
    }
}

// 加载标签
async function loadTags() {
    try {
        // 先获取所有标签
        const { data: tags, error: tagsError } = await window.supabaseClient
            .from('tags')
            .select('*')
            .order('category_id');
        
        if (tagsError) throw tagsError;
        
        // 获取所有标签类别
        const { data: categories, error: categoriesError } = await window.supabaseClient
            .from('tag_categories')
            .select('*');
        
        if (categoriesError) throw categoriesError;
        
        // 创建类别ID到名称的映射
        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category.id] = category.name;
        });
        
        const container = document.getElementById('tags-container');
        if (!container) return;
        
        if (tags.length === 0) {
            container.innerHTML = '<p>暂无标签</p>';
            return;
        }
        
        let tagsHTML = '<div class="tag-list">';
        tags.forEach(tag => {
            const categoryName = categoryMap[tag.category_id] || '未知类别';
            tagsHTML += `
                <div class="tag-item" data-id="${tag.id}">
                    <span>${categoryName} - ${tag.name}</span>
                    <button class="btn btn-danger btn-small delete-tag-btn" data-id="${tag.id}">删除</button>
                </div>
            `;
        });
        tagsHTML += '</div>';
        
        container.innerHTML = tagsHTML;
        
        // 添加删除按钮事件
        document.querySelectorAll('.delete-tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('确定要删除这个标签吗？')) {
                    deleteTag(id);
                }
            });
        });
    } catch (error) {
        console.error('加载标签时出错:', error);
        const container = document.getElementById('tags-container');
        if (container) {
            container.innerHTML = '<p>加载标签时出错: ' + error.message + '</p>';
        }
    }
}

// 加载媒体选择列表
async function loadMediaSelection(mediaType) {
    try {
        let data, error;
        
        if (mediaType === 'music') {
            const result = await window.supabaseClient
                .from('musics')
                .select('id, title')
                .order('title');
            data = result.data;
            error = result.error;
        } else {
            const result = await window.supabaseClient
                .from('videos')
                .select('id, title')
                .order('title');
            data = result.data;
            error = result.error;
        }
        
        if (error) throw error;
        
        const select = document.getElementById('media-selection');
        if (!select) return;
        
        if (data.length === 0) {
            select.innerHTML = '<option value="">暂无媒体</option>';
            return;
        }
        
        let optionsHTML = '<option value="">请选择媒体</option>';
        data.forEach(item => {
            optionsHTML += `<option value="${item.id}">${item.title}</option>`;
        });
        
        select.innerHTML = optionsHTML;
        
        // 清空标签选择
        document.getElementById('media-tags').innerHTML = '<option value="">请先选择媒体</option>';
        
        // 添加媒体选择变化事件
        select.addEventListener('change', () => {
            const mediaId = select.value;
            if (mediaId) {
                loadMediaTags(mediaType, mediaId);
            } else {
                document.getElementById('media-tags').innerHTML = '<option value="">请先选择媒体</option>';
            }
        });
    } catch (error) {
        console.error('加载媒体选择列表时出错:', error);
    }
}

// 加载媒体的标签
async function loadMediaTags(mediaType, mediaId) {
    try {
        // 获取所有标签
        const { data: allTags, error: tagsError } = await window.supabaseClient
            .from('tags')
            .select('*')
            .order('category_id');
        
        if (tagsError) throw tagsError;
        
        // 获取所有标签类别
        const { data: categories, error: categoriesError } = await window.supabaseClient
            .from('tag_categories')
            .select('*');
        
        if (categoriesError) throw categoriesError;
        
        // 创建类别ID到名称的映射
        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category.id] = category.name;
        });
        
        // 获取媒体已有的标签
        const { data: mediaTags, error: mediaTagsError } = await window.supabaseClient
            .from('media_tags')
            .select('tag_id')
            .eq('media_type', mediaType)
            .eq('media_id', mediaId);
        
        if (mediaTagsError) throw mediaTagsError;
        
        const selectedTagIds = mediaTags.map(item => item.tag_id);
        
        const select = document.getElementById('media-tags');
        if (!select) return;
        
        if (allTags.length === 0) {
            select.innerHTML = '<option value="">暂无标签</option>';
            return;
        }
        
        let optionsHTML = '';
        allTags.forEach(tag => {
            const categoryName = categoryMap[tag.category_id] || '未知类别';
            const selected = selectedTagIds.includes(tag.id) ? 'selected' : '';
            optionsHTML += `<option value="${tag.id}" ${selected}>${categoryName} - ${tag.name}</option>`;
        });
        
        select.innerHTML = optionsHTML;
    } catch (error) {
        console.error('加载媒体标签时出错:', error);
    }
}

// 删除标签类别
async function deleteCategory(id) {
    try {
        const { error } = await window.supabaseClient
            .from('tag_categories')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        loadCategories();
        loadTagFormCategories();
        loadTags();
    } catch (error) {
        console.error('删除标签类别时出错:', error);
        alert('删除标签类别失败: ' + error.message);
    }
}

// 删除标签
async function deleteTag(id) {
    try {
        const { error } = await window.supabaseClient
            .from('tags')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        loadTags();
    } catch (error) {
        console.error('删除标签时出错:', error);
        alert('删除标签失败: ' + error.message);
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
    
    // 加载音乐标签
    loadMusicTags(music.id);
}

// 打开编辑视频模态框
function openEditVideoModal(video) {
    document.getElementById('edit-video-id').value = video.id;
    document.getElementById('edit-video-title').value = video.title;
    document.getElementById('edit-video-description').value = video.description;
    
    document.getElementById('edit-video-modal').style.display = 'block';
    
    // 加载视频标签
    loadVideoTags(video.id);
}

// 加载音乐标签
async function loadMusicTags(musicId) {
    try {
        // 获取所有标签
        const { data: allTags, error: tagsError } = await window.supabaseClient
            .from('tags')
            .select('*')
            .order('category_id');
        
        if (tagsError) throw tagsError;
        
        // 获取所有标签类别
        const { data: categories, error: categoriesError } = await window.supabaseClient
            .from('tag_categories')
            .select('*');
        
        if (categoriesError) throw categoriesError;
        
        // 创建类别ID到名称的映射
        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category.id] = category.name;
        });
        
        // 获取音乐已有的标签
        const { data: mediaTags, error: mediaTagsError } = await window.supabaseClient
            .from('media_tags')
            .select('tag_id')
            .eq('media_type', 'music')
            .eq('media_id', musicId);
        
        if (mediaTagsError) throw mediaTagsError;
        
        const selectedTagIds = mediaTags.map(item => item.tag_id);
        
        // 显示已选择的标签
        displaySelectedTags('music', selectedTagIds, allTags, categoryMap);
        
        // 设置标签搜索功能
        setupTagSearch('music', allTags, categoryMap, selectedTagIds);
        
        // 保存按钮事件
        document.getElementById('save-music-tags').onclick = () => saveMediaTags('music', musicId, selectedTagIds);
    } catch (error) {
        console.error('加载音乐标签时出错:', error);
        document.getElementById('music-tags-container').innerHTML = '<p>加载标签时出错: ' + error.message + '</p>';
    }
}

// 加载视频标签
async function loadVideoTags(videoId) {
    try {
        // 获取所有标签
        const { data: allTags, error: tagsError } = await window.supabaseClient
            .from('tags')
            .select('*')
            .order('category_id');
        
        if (tagsError) throw tagsError;
        
        // 获取所有标签类别
        const { data: categories, error: categoriesError } = await window.supabaseClient
            .from('tag_categories')
            .select('*');
        
        if (categoriesError) throw categoriesError;
        
        // 创建类别ID到名称的映射
        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category.id] = category.name;
        });
        
        // 获取视频已有的标签
        const { data: mediaTags, error: mediaTagsError } = await window.supabaseClient
            .from('media_tags')
            .select('tag_id')
            .eq('media_type', 'video')
            .eq('media_id', videoId);
        
        if (mediaTagsError) throw mediaTagsError;
        
        const selectedTagIds = mediaTags.map(item => item.tag_id);
        
        // 显示已选择的标签
        displaySelectedTags('video', selectedTagIds, allTags, categoryMap);
        
        // 设置标签搜索功能
        setupTagSearch('video', allTags, categoryMap, selectedTagIds);
        
        // 保存按钮事件
        document.getElementById('save-video-tags').onclick = () => saveMediaTags('video', videoId, selectedTagIds);
    } catch (error) {
        console.error('加载视频标签时出错:', error);
        document.getElementById('video-tags-container').innerHTML = '<p>加载标签时出错: ' + error.message + '</p>';
    }
}

// 显示已选择的标签
function displaySelectedTags(mediaType, selectedTagIds, allTags, categoryMap) {
    const container = document.getElementById(`${mediaType}-tags-container`);
    if (!container) return;
    
    if (selectedTagIds.length === 0) {
        container.innerHTML = '<p>暂无标签</p>';
        return;
    }
    
    // 获取选中的标签详细信息
    const selectedTags = allTags.filter(tag => selectedTagIds.includes(tag.id));
    
    let tagsHTML = '<div class="tag-selection">';
    selectedTags.forEach(tag => {
        const categoryName = categoryMap[tag.category_id] || '未知类别';
        tagsHTML += `
            <span class="selected-tag" data-id="${tag.id}">
                ${categoryName}: ${tag.name}
                <span class="remove-tag" data-id="${tag.id}">&times;</span>
            </span>
        `;
    });
    tagsHTML += '</div>';
    
    container.innerHTML = tagsHTML;
    
    // 添加删除标签事件
    container.querySelectorAll('.remove-tag').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tagId = parseInt(e.target.getAttribute('data-id'));
            const index = selectedTagIds.indexOf(tagId);
            if (index > -1) {
                selectedTagIds.splice(index, 1);
                displaySelectedTags(mediaType, selectedTagIds, allTags, categoryMap);
                setupTagSearch(mediaType, allTags, categoryMap, selectedTagIds);
            }
        });
    });
}

// 设置标签搜索功能
function setupTagSearch(mediaType, allTags, categoryMap, selectedTagIds) {
    const searchInput = document.getElementById(`${mediaType}-tag-search`);
    const searchResults = document.getElementById(`${mediaType}-tag-search-results`);
    
    if (!searchInput || !searchResults) return;
    
    searchInput.oninput = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length === 0) {
            searchResults.style.display = 'none';
            return;
        }
        
        // 过滤标签
        const filteredTags = allTags.filter(tag => {
            const categoryName = categoryMap[tag.category_id] || '未知类别';
            return (
                tag.name.toLowerCase().includes(searchTerm) ||
                categoryName.toLowerCase().includes(searchTerm)
            );
        });
        
        if (filteredTags.length === 0) {
            searchResults.innerHTML = '<div class="tag-search-result">未找到匹配的标签</div>';
            searchResults.style.display = 'block';
            return;
        }
        
        let resultsHTML = '';
        filteredTags.forEach(tag => {
            const categoryName = categoryMap[tag.category_id] || '未知类别';
            const selected = selectedTagIds.includes(tag.id) ? 'selected' : '';
            resultsHTML += `
                <div class="tag-search-result ${selected}" data-id="${tag.id}">
                    ${categoryName}: ${tag.name}
                </div>
            `;
        });
        
        searchResults.innerHTML = resultsHTML;
        searchResults.style.display = 'block';
        
        // 添加点击事件
        searchResults.querySelectorAll('.tag-search-result').forEach(result => {
            result.addEventListener('click', (e) => {
                const tagId = parseInt(e.currentTarget.getAttribute('data-id'));
                const index = selectedTagIds.indexOf(tagId);
                
                if (index > -1) {
                    // 如果已选择，则移除
                    selectedTagIds.splice(index, 1);
                    e.currentTarget.classList.remove('selected');
                } else {
                    // 如果未选择，则添加
                    selectedTagIds.push(tagId);
                    e.currentTarget.classList.add('selected');
                }
                
                // 更新显示的标签
                displaySelectedTags(mediaType, selectedTagIds, allTags, categoryMap);
            });
        });
    };
    
    // 点击其他地方隐藏搜索结果
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

// 保存媒体标签
async function saveMediaTags(mediaType, mediaId, selectedTagIds) {
    try {
        // 先删除现有的标签关联
        await window.supabaseClient
            .from('media_tags')
            .delete()
            .eq('media_type', mediaType)
            .eq('media_id', mediaId);
        
        // 插入新的标签关联
        if (selectedTagIds.length > 0) {
            const mediaTags = selectedTagIds.map(tagId => ({
                media_type: mediaType,
                media_id: mediaId,
                tag_id: tagId
            }));
            
            const { error } = await window.supabaseClient
                .from('media_tags')
                .insert(mediaTags);
            
            if (error) throw error;
        }
        
        alert('标签保存成功');
    } catch (error) {
        console.error('保存标签时出错:', error);
        alert('保存标签失败: ' + error.message);
    }
}

// 处理音乐编辑
async function handleEditMusic(e) {
    e.preventDefault();
    
    try {
        const id = document.getElementById('edit-music-id').value;
        const title = document.getElementById('edit-music-title').value;
        const album = document.getElementById('edit-music-album').value;
        const year = document.getElementById('edit-music-year').value;
        
        // 更新音乐信息
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
        
        // 更新视频信息
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
                console.error('文件上传错误:', error);
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