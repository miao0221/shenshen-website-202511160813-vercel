# 用户资料表设置说明

## 表结构

### user_profiles 表
```sql
-- 创建用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  nickname VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 启用行级安全策略
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
-- 用户可以查看所有用户的公开资料
CREATE POLICY "User profiles are viewable by everyone" ON user_profiles FOR SELECT USING (true);

-- 用户只能插入和更新自己的资料
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- 授予相关权限
GRANT SELECT ON TABLE user_profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON TABLE user_profiles TO authenticated;
```

## 使用说明

1. 这个表将存储用户的昵称信息
2. 每个用户只能访问和修改自己的资料
3. 所有用户都可以查看其他用户的公开资料（如昵称）
4. 当用户注册时，需要在应用层面创建对应的用户资料记录