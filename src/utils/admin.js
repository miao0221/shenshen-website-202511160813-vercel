// 管理员权限管理工具

/**
 * 检查当前用户是否为管理员
 * @returns {Promise<boolean>} 用户是否为管理员
 */
export async function isAdmin() {
    try {
        // 检查用户是否已登录
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) {
            return false;
        }
        
        // 获取当前用户信息
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        if (!user) {
            return false;
        }
        
        // 检查用户邮箱是否在管理员列表中
        const { data, error } = await window.supabaseClient
            .from('admins')
            .select('id')
            .eq('email', user.email)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116表示未找到记录
            console.error('检查管理员权限时出错:', error);
            return false;
        }
        
        return !!data;
    } catch (error) {
        console.error('检查管理员权限时出错:', error);
        return false;
    }
}

/**
 * 获取所有管理员列表
 * @returns {Promise<Array>} 管理员列表
 */
export async function getAdmins() {
    try {
        const { data, error } = await window.supabaseClient
            .from('admins')
            .select('email, created_at');
        
        if (error) {
            console.error('获取管理员列表时出错:', error);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('获取管理员列表时出错:', error);
        return [];
    }
}

/**
 * 添加管理员
 * @param {string} email - 用户邮箱
 * @returns {Promise<boolean>} 是否添加成功
 */
export async function addAdmin(email) {
    try {
        // 首先验证邮箱对应的用户是否存在
        const { data: user, error: userError } = await window.supabaseClient
            .from('auth.users')
            .select('id')
            .eq('email', email)
            .single();
        
        if (userError || !user) {
            console.error('用户不存在:', userError);
            return false;
        }
        
        // 添加管理员邮箱到admins表
        const { data, error } = await window.supabaseClient
            .from('admins')
            .insert([{ email: email }]);
        
        if (error) {
            console.error('添加管理员时出错:', error);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('添加管理员时出错:', error);
        return false;
    }
}

/**
 * 移除管理员
 * @param {string} email - 用户邮箱
 * @returns {Promise<boolean>} 是否移除成功
 */
export async function removeAdmin(email) {
    try {
        const { error } = await window.supabaseClient
            .from('admins')
            .delete()
            .eq('email', email);
        
        if (error) {
            console.error('移除管理员时出错:', error);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('移除管理员时出错:', error);
        return false;
    }
}