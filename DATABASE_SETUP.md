# Supabase 数据库设置指南

本指南将帮助您在 Supabase 中创建项目所需的数据库表。

## 创建 `musics` 表

在 Supabase 控制台中执行以下 SQL 语句来创建 `musics` 表：

```sql
CREATE TABLE musics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  album VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 创建 `videos` 表

在 Supabase 控制台中执行以下 SQL 语句来创建 `videos` 表：

```sql
CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 设置表权限和RLS（行级安全）

为了让前端应用能够访问这些表，您需要设置适当的权限并配置行级安全策略：

### 1. 为 `musics` 表设置权限

```sql
-- 启用行级安全
ALTER TABLE musics ENABLE ROW LEVEL SECURITY;

-- 允许所有人查看音乐
CREATE POLICY "Everyone can view music" ON musics
  FOR SELECT USING (true);

-- 允许匿名用户插入音乐
CREATE POLICY "Anonymous users can insert music" ON musics
  FOR INSERT WITH CHECK (true);

-- 授予访问权限
GRANT SELECT ON musics TO anon;
GRANT INSERT ON musics TO anon;
```

### 2. 为 `videos` 表设置权限

```sql
-- 启用行级安全
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 允许所有人查看视频
CREATE POLICY "Everyone can view videos" ON videos
  FOR SELECT USING (true);

-- 允许匿名用户插入视频
CREATE POLICY "Anonymous users can insert videos" ON videos
  FOR INSERT WITH CHECK (true);

-- 授予访问权限
GRANT SELECT ON videos TO anon;
GRANT INSERT ON videos TO anon;
```

## 设置存储桶权限

为了让前端应用能够上传文件到存储桶，您需要设置存储桶的RLS策略：

### 1. 配置 `music` 存储桶

1. 在Supabase控制台中，进入 `Storage` -> `Buckets`
2. 点击 `music` 存储桶
3. 点击 `Settings` 选项卡
4. 在 `Policies` 部分，确保有以下策略：
   - 选择对象：`Allow anyone to read objects`
   - 插入对象：`Allow anyone to upload objects`

或者使用SQL配置：

```sql
-- 为music存储桶设置RLS策略
CREATE POLICY "允许公开读取音乐文件" ON storage.objects 
FOR SELECT TO anon 
USING (bucket_id = 'music');

CREATE POLICY "允许匿名用户上传音乐文件" ON storage.objects 
FOR INSERT TO anon 
WITH CHECK (bucket_id = 'music');
```

### 2. 配置 `videos` 存储桶

1. 在Supabase控制台中，进入 `Storage` -> `Buckets`
2. 点击 `videos` 存储桶
3. 点击 `Settings` 选项卡
4. 在 `Policies` 部分，确保有以下策略：
   - 选择对象：`Allow anyone to read objects`
   - 插入对象：`Allow anyone to upload objects`

或者使用SQL配置：

```sql
-- 为videos存储桶设置RLS策略
CREATE POLICY "允许公开读取视频文件" ON storage.objects 
FOR SELECT TO anon 
USING (bucket_id = 'videos');

CREATE POLICY "允许匿名用户上传视频文件" ON storage.objects 
FOR INSERT TO anon 
WITH CHECK (bucket_id = 'videos');
```

## 验证表结构

创建表后，您可以使用以下 SQL 查询来验证表结构：

```sql
-- 检查 musics 表结构
\d musics;

-- 检查 videos 表结构
\d videos;
```

## 测试数据插入

您可以使用以下 SQL 语句测试数据插入：

```sql
-- 插入测试音乐数据
INSERT INTO musics (title, album, year, url) 
VALUES ('测试歌曲', '测试专辑', 2023, 'https://example.com/music.mp3');

-- 插入测试视频数据
INSERT INTO videos (title, description, url) 
VALUES ('测试视频', '这是一个测试视频', 'https://example.com/video.mp4');
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