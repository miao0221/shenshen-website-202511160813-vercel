// Supabase配置
const SUPABASE_URL = 'https://ywzqkjparfslwwvjuwlx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3enFranBhcmZzbHd3dmp1d2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjI0ODYsImV4cCI6MjA3ODc5ODQ4Nn0.2fKie0CH12aoxvnUAO2IPrdZ1NtkyK8ujErx7FTiDxY';

// 初始化Supabase客户端
export function initializeAuth() {
    if (typeof window !== 'undefined' && typeof supabase !== 'undefined') {
        window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized');
    } else {
        console.error('Supabase SDK not loaded or window not available');
    }
}

// 获取全局的supabase客户端
export function getSupabaseClient() {
    if (typeof window !== 'undefined' && window.supabaseClient) {
        return window.supabaseClient;
    }
    
    throw new Error('Supabase client not initialized');
}

export { SUPABASE_URL, SUPABASE_ANON_KEY };