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

### tag_categories 表
```sql
-- 创建标签类别表
CREATE TABLE tag_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### tags 表
```sql
-- 创建标签表
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES tag_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(category_id, name)
);
```

### media_tags 表
```sql
-- 创建媒体标签关联表
CREATE TABLE media_tags (
  id SERIAL PRIMARY KEY,
  media_type VARCHAR(10) NOT NULL, -- 'music' 或 'video'
  media_id INTEGER NOT NULL,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(media_type, media_id, tag_id)
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
ALTER TABLE tag_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_tags ENABLE ROW LEVEL SECURITY;
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

### 为 tag_categories 表设置策略
```sql
-- 允许任何人查看标签类别
CREATE POLICY "Tag categories are viewable by everyone" ON tag_categories FOR SELECT USING (true);

-- 允许管理员插入标签类别
CREATE POLICY "Tag categories can be inserted by admins" ON tag_categories FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins a WHERE a.email = (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
  )
);

-- 允许管理员更新标签类别
CREATE POLICY "Tag categories can be updated by admins" ON tag_categories FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM admins a WHERE a.email = (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins a WHERE a.email = (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
  )
);

-- 允许管理员删除标签类别
CREATE POLICY "Tag categories can be deleted by admins" ON tag_categories FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM admins a WHERE a.email = (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
  )
);

-- 授予相关权限
GRANT SELECT ON TABLE tag_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE tag_categories TO authenticated;
```

### 为 tags 表设置策略
```sql
-- 允许任何人查看标签
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);

-- 允许管理员插入标签
CREATE POLICY "Tags can be inserted by admins" ON tags FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins a WHERE a.email = (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
  )
);

-- 允许管理员更新标签
CREATE POLICY "Tags can be updated by admins" ON tags FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM admins a WHERE a.email = (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins a WHERE a.email = (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
  )
);

-- 允许管理员删除标签
CREATE POLICY "Tags can be deleted by admins" ON tags FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM admins a WHERE a.email = (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
  )
);

-- 授予相关权限
GRANT SELECT ON TABLE tags TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE tags TO authenticated;
```

### 为 media_tags 表设置策略
```sql
-- 允许任何人查看媒体标签关联
CREATE POLICY "Media tags are viewable by everyone" ON media_tags FOR SELECT USING (true);

-- 允许管理员插入媒体标签关联
CREATE POLICY "Media tags can be inserted by admins" ON media_tags FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins a WHERE a.email = (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
  )
);

-- 允许管理员删除媒体标签关联
CREATE POLICY "Media tags can be deleted by admins" ON media_tags FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM admins a WHERE a.email = (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
  )
);

-- 授予相关权限
GRANT SELECT ON TABLE media_tags TO anon, authenticated;
GRANT INSERT, DELETE ON TABLE media_tags TO authenticated;
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

GRANT SELECT ON TABLE tag_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE tag_categories TO authenticated;

GRANT SELECT ON TABLE tags TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE tags TO authenticated;

GRANT SELECT ON TABLE media_tags TO anon, authenticated;
GRANT INSERT, DELETE ON TABLE media_tags TO authenticated;

-- 授予序列权限
GRANT USAGE ON SEQUENCE tag_categories_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE tags_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE media_tags_id_seq TO authenticated;
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
```