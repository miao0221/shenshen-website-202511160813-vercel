/**
 * 上传文件到Supabase存储
 * @param {File} file - 要上传的文件
 * @param {string} bucket - 存储桶名称
 * @param {string} fileName - 文件名
 * @returns {Promise<string>} 文件的公共URL
 */
export async function uploadFileToSupabase(file, bucket, fileName) {
    try {
        // 使用全局的supabase客户端
        const { data, error } = await window.supabaseClient
            .storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });
        
        if (error) {
            throw new Error(`上传失败: ${error.message}`);
        }
        
        // 获取公共URL
        const { data: { publicUrl } } = window.supabaseClient
            .storage
            .from(bucket)
            .getPublicUrl(fileName);
        
        return publicUrl;
    } catch (error) {
        console.error('上传文件时出错:', error);
        throw error;
    }
}

/**
 * 将音乐信息保存到数据库
 * @param {Object} musicData - 音乐信息
 * @returns {Promise<Object>} 保存结果
 */
export async function saveMusicInfo(musicData) {
    try {
        // 使用全局的supabase客户端
        const { data, error } = await window.supabaseClient
            .from('musics')
            .insert([musicData])
            .select();
        
        if (error) {
            throw new Error(`保存音乐信息失败: ${error.message}`);
        }
        
        return data[0];
    } catch (error) {
        console.error('保存音乐信息时出错:', error);
        throw error;
    }
}

/**
 * 将视频信息保存到数据库
 * @param {Object} videoData - 视频信息
 * @returns {Promise<Object>} 保存结果
 */
export async function saveVideoInfo(videoData) {
    try {
        // 使用全局的supabase客户端
        const { data, error } = await window.supabaseClient
            .from('videos')
            .insert([videoData])
            .select();
        
        if (error) {
            throw new Error(`保存视频信息失败: ${error.message}`);
        }
        
        return data[0];
    } catch (error) {
        console.error('保存视频信息时出错:', error);
        throw error;
    }
}

export default {
    uploadFileToSupabase,
    saveMusicInfo,
    saveVideoInfo
};