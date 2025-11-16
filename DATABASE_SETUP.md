# Supabase 数据库设置指南

本指南将帮助您在 Supabase 中创建项目所需的数据库表。

## 表结构

### musics 表
```sql
CREATE TABLE musics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  album VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### videos 表
```sql
CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### admins 表
```sql
-- 删除旧的admins表（如果存在）
DROP TABLE IF EXISTS admins CASCADE;

-- 创建新的admins表，使用邮箱作为管理员标识
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 存储桶设置

需要创建以下存储桶并设置为 public 访问：
- images
- music
- videos

## 行级安全策略 (RLS)

### 启用RLS
```sql
ALTER TABLE musics ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
```

### 为 musics 表设置策略
```sql
-- 允许任何人查看音乐
CREATE POLICY "Music is viewable by everyone" ON musics FOR SELECT USING (true);

-- 允许认证用户插入音乐
CREATE POLICY "Authenticated users can insert music" ON musics FOR INSERT TO authenticated WITH CHECK (true);

-- 授予相关权限
GRANT SELECT ON TABLE musics TO anon, authenticated;
GRANT INSERT ON TABLE musics TO authenticated;
```

### 为 videos 表设置策略
```sql
-- 允许任何人查看视频
CREATE POLICY "Videos are viewable by everyone" ON videos FOR SELECT USING (true);

-- 允许认证用户插入视频
CREATE POLICY "Authenticated users can insert videos" ON videos FOR INSERT TO authenticated WITH CHECK (true);

-- 授予相关权限
GRANT SELECT ON TABLE videos TO anon, authenticated;
GRANT INSERT ON TABLE videos TO authenticated;
```

### 为 admins 表设置策略
```sql
-- 允许任何人查看管理员列表
CREATE POLICY "Admins are viewable by everyone" ON admins FOR SELECT USING (true);

-- 允许管理员插入新管理员
CREATE POLICY "Admins can be inserted by admins" ON admins FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins a WHERE a.email = (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
  )
);

-- 允许管理员删除管理员
CREATE POLICY "Admins can be deleted by admins" ON admins FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM admins a WHERE a.email = (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
  )
);

-- 授予相关权限
GRANT SELECT ON TABLE admins TO anon;
GRANT INSERT, DELETE ON TABLE admins TO authenticated;
```

## 存储桶策略

### 为存储桶设置RLS策略
```sql
-- 允许匿名用户上传音乐文件
CREATE POLICY "Anonymous users can upload music" ON storage.objects 
FOR INSERT TO anon WITH CHECK (bucket_id = 'music');

-- 允许匿名用户查看音乐文件
CREATE POLICY "Public music files are viewable" ON storage.objects 
FOR SELECT TO anon USING (bucket_id = 'music');

-- 允许匿名用户上传视频文件
CREATE POLICY "Anonymous users can upload videos" ON storage.objects 
FOR INSERT TO anon WITH CHECK (bucket_id = 'videos');

-- 允许匿名用户查看视频文件
CREATE POLICY "Public video files are viewable" ON storage.objects 
FOR SELECT TO anon USING (bucket_id = 'videos');

-- 允许匿名用户上传图片文件
CREATE POLICY "Anonymous users can upload images" ON storage.objects 
FOR INSERT TO anon WITH CHECK (bucket_id = 'images');

-- 允许匿名用户查看图片文件
CREATE POLICY "Public image files are viewable" ON storage.objects 
FOR SELECT TO anon USING (bucket_id = 'images');
```

## 权限授予

```sql
-- 授予 anon 和 authenticated 用户对表的访问权限
GRANT SELECT ON TABLE musics TO anon, authenticated;
GRANT INSERT ON TABLE musics TO authenticated;

GRANT SELECT ON TABLE videos TO anon, authenticated;
GRANT INSERT ON TABLE videos TO authenticated;

GRANT SELECT ON TABLE admins TO anon;
GRANT INSERT, DELETE ON TABLE admins TO authenticated;
```

## 验证RLS策略

您可以使用以下查询来检查表的RLS策略：

```sql
-- 查看 musics 表的策略
SELECT * FROM pg_policy WHERE polrelid = 'musics'::regclass;

-- 查看 videos 表的策略
SELECT * FROM pg_policy WHERE polrelid = 'videos'::regclass;
```

## 故障排除

如果仍然遇到RLS相关错误，请尝试以下步骤：

### 完整重置videos表的RLS策略

```sql
-- 1. 删除现有的videos表策略（如果存在）
DROP POLICY IF EXISTS "Everyone can view videos" ON videos;
DROP POLICY IF EXISTS "Anonymous users can insert videos" ON videos;
DROP POLICY IF EXISTS "anon_select_policy" ON videos;
DROP POLICY IF EXISTS "anon_insert_policy" ON videos;

-- 2. 禁用并重新启用RLS
ALTER TABLE videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 3. 创建新的策略
CREATE POLICY "anon_select_policy" ON videos
  FOR SELECT USING (true);
  
CREATE POLICY "anon_insert_policy" ON videos
  FOR INSERT WITH CHECK (true);

-- 4. 授予anon角色权限
GRANT ALL ON TABLE videos TO anon;
GRANT USAGE ON SEQUENCE videos_id_seq TO anon;
```

### 检查并验证RLS状态

```sql
-- 检查表的RLS状态
SELECT relname, relrowsecurity, relforcerowsecurity 
FROM pg_class 
WHERE relname IN ('musics', 'videos');

-- 检查策略
SELECT polname, polrelid::regclass, polcmd, polqual, polwithcheck 
FROM pg_policy 
WHERE polrelid::regclass IN ('musics', 'videos');
```

### 高级故障排除

如果以上步骤都不能解决问题，请尝试以下高级故障排除方法：

#### 1. 检查表的所有者和权限

```sql
-- 检查表的所有者
SELECT tablename, tableowner FROM pg_tables WHERE tablename IN ('musics', 'videos');

-- 检查表的访问权限
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name IN ('musics', 'videos') AND grantee = 'anon';
```

#### 2. 完全重置并重新创建表

如果问题仍然存在，可能是表本身存在问题。请尝试删除并重新创建表：

```sql
-- 1. 删除现有的表（注意：这会丢失所有数据）
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS musics CASCADE;

-- 2. 重新创建表
CREATE TABLE musics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  album VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 为两个表设置RLS和权限
ALTER TABLE musics ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_policy" ON musics FOR SELECT USING (true);
CREATE POLICY "anon_insert_policy" ON musics FOR INSERT WITH CHECK (true);
GRANT ALL ON TABLE musics TO anon;
GRANT USAGE ON SEQUENCE musics_id_seq TO anon;

CREATE POLICY "anon_select_policy" ON videos FOR SELECT USING (true);
CREATE POLICY "anon_insert_policy" ON videos FOR INSERT WITH CHECK (true);
GRANT ALL ON TABLE videos TO anon;
GRANT USAGE ON SEQUENCE videos_id_seq TO anon;
```

#### 3. 检查Supabase项目设置

确保您的Supabase项目设置正确：

1. 检查API设置中的"Enable access to unauthenticated users"是否已启用
2. 确认您的SUPABASE_ANON_KEY正确无误
3. 检查网络和CORS设置

### 特定于当前问题的解决方案

如果视频上传仍然失败而音乐上传成功，请尝试以下特定解决方案：

#### 检查videos表结构是否与代码匹配

在Supabase SQL编辑器中运行以下查询来检查表结构：

```sql
-- 检查videos表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'videos'
ORDER BY ordinal_position;

-- 检查musics表结构进行对比
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'musics'
ORDER BY ordinal_position;
```

确保videos表的结构与以下结构完全一致：
- id (integer, NOT NULL)
- title (character varying, NOT NULL)
- description (text, 可以为NULL)
- url (text, NOT NULL)
- created_at (timestamp with time zone, 可以为NULL或有默认值)

#### 检查是否存在触发器或其他约束

```sql
-- 检查videos表上的触发器
SELECT tgname, tgfoid, tgtype 
FROM pg_trigger 
WHERE tgrelid = 'videos'::regclass;

-- 检查videos表上的约束
SELECT conname, contype, condef 
FROM pg_constraint 
WHERE conrelid = 'videos'::regclass;
```

#### 尝试直接在数据库中插入测试数据

```sql
-- 测试直接插入数据
INSERT INTO videos (title, description, url, created_at) 
VALUES ('测试视频', '测试描述', 'https://example.com/test.mp4', NOW());
```

如果这个操作也失败了，说明问题出在表结构或权限上，而不是前端代码。

完成这些步骤后，您的文件上传功能应该就可以正常工作了。