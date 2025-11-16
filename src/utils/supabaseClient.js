import { createClient } from '@supabase/supabase-js';

let supabase = null;

/**
 * 初始化Supabase客户端
 */
export function initSupabase() {
    const supabaseUrl = 'https://ywzqkjparfslwwvjuwlx.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3enFrancGFyZnNsd3d2anV3bHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc2MzIyMjQ4NiwiZXhwIjoyMDc4Nzk4NDg2fQ.2fKie0CH12aoxvnUAO2IPrdZ1NtkyK8ujErx7FTiDxY';
    
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * 获取Supabase客户端实例
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function getSupabase() {
    if (!supabase) {
        throw new Error('Supabase client not initialized. Call initSupabase() first.');
    }
    return supabase;
}