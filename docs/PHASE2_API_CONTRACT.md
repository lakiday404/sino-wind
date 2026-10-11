# 📜 第二阶段全栈接口契约与数据库规范 (PHASE2_API_CONTRACT.md)

> **队长致全员**：  
> 本规范是团队 5 天冲刺产出完整 Demo 的核心基石。**前后端必须严格以此文档中的 JSON 结构为准！**  
> - **成员 A（后端）**：严格按照本文档的入参/出参字段编写 Controller，确保数据库持久化通畅。  
> - **成员 B（前端）**：在后端接口未部署前，可直接复制本文档中的“返回示例 JSON”作为 Mock 数据开发 UI，实现前后端零等待并行开发。  
> - **成员 C（队长）**：统筹全局联调、书斋闭环与最终合流质检。

---

## 🗄️ 一、 数据库增量 SQL 脚本（成员 A 必跑）

请成员 A 在本地 MySQL（`parent_kid_education` 库）中依次执行以下建表与字段扩展脚本：

```sql
-- 1. 为 users 表扩展文人雅士四维修持属性字段
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS appraise_count INT DEFAULT 12 COMMENT '鉴宝藏器数',
ADD COLUMN IF NOT EXISTS debate_count INT DEFAULT 36 COMMENT '论道问策数',
ADD COLUMN IF NOT EXISTS poem_count INT DEFAULT 48 COMMENT '诗签摘录数',
ADD COLUMN IF NOT EXISTS rank_level VARCHAR(20) DEFAULT '玖阶' COMMENT '文风品位品阶';

-- 2. 新建 user_poems 表（用于古诗词天地“摘录入卷”及书斋“我的诗笺”沉淀）
CREATE TABLE IF NOT EXISTS user_poems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '用户ID',
  poem_id VARCHAR(64) COMMENT '第三方或本地诗词唯一标识',
  title VARCHAR(100) NOT NULL COMMENT '诗词标题',
  author VARCHAR(50) NOT NULL COMMENT '作者',
  dynasty VARCHAR(30) DEFAULT '唐代' COMMENT '朝代',
  content TEXT NOT NULL COMMENT '诗词完整正文或节选',
  appreciation TEXT COMMENT '先贤赏析/诗意解读',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户诗签收藏表';

-- 3. 插入初始测试种子数据（可选）
INSERT INTO user_poems (user_id, poem_id, title, author, dynasty, content, appreciation)
VALUES 
(1, 'mock_1', '水调歌头·明月几时有', '苏轼', '宋代', '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。', '此词借中秋月圆抒发浩荡情怀，融哲思与豪放风骨于一体。'),
(1, 'mock_2', '将进酒', '李白', '唐代', '君不见黄河之水天上来，奔流到海不复回。君不见高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。', '极富浪漫主义之豪迈，千载诗仙之风神尽在于此。')
ON DUPLICATE KEY UPDATE title=VALUES(title);
```

---

## 🔌 二、 全栈核心业务 API 契约

统一请求基准路径：`/api`  
鉴权方式：请求头携带 `Authorization: Bearer <token>`

---

### 1. 【古诗词天地】随机获取诗词
* **路由**：`GET /api/poem/random`
* **说明**：进入页面默认触发，或点击“重研墨宝”随机换一首。
* **响应示例 (200 OK)**：
```json
{
  "code": 1,
  "message": "获取成功",
  "data": {
    "id": "poem_101",
    "title": "水调歌头·明月几时有",
    "author": "苏轼",
    "dynasty": "宋代",
    "paragraphs": [
      "明月几时有？把酒问青天。",
      "不知天上宫阙，今夕是何年。",
      "我欲乘风归去，又恐琼楼玉宇，高处不胜寒。",
      "起舞弄清影，何似在人间。"
    ],
    "appreciation": "此词作于丙辰年中秋，兼怀子由。东坡借月抒怀，表达对人间生活的旷达与热爱。",
    "bgArt": "/assets/home/poem-art.jpg"
  }
}
```

---

### 2. 【古诗词天地】关键词搜索诗词
* **路由**：`GET /api/poem/search`
* **Query 参数**：`q=明月`
* **响应示例 (200 OK)**：
```json
{
  "code": 1,
  "message": "搜索成功",
  "data": [
    {
      "id": "poem_101",
      "title": "水调歌头·明月几时有",
      "author": "苏轼",
      "dynasty": "宋代",
      "snippet": "明月几时有？把酒问青天..."
    },
    {
      "id": "poem_102",
      "title": "静夜思",
      "author": "李白",
      "dynasty": "唐代",
      "snippet": "床前明月光，疑是地上霜..."
    }
  ]
}
```

---

### 3. 【古诗词天地】摘录入卷（收藏诗词，数据闭环核心）
* **路由**：`POST /api/poem/collect`
* **请求头**：`Authorization: Bearer <token>`
* **请求体 (JSON)**：
```json
{
  "poemId": "poem_101",
  "title": "水调歌头·明月几时有",
  "author": "苏轼",
  "dynasty": "宋代",
  "content": "明月几时有？把酒问青天。不知天上宫阙，今夕是何年...",
  "appreciation": "此词作于丙辰年中秋..."
}
```
* **响应示例 (200 OK)**：
```json
{
  "code": 1,
  "message": "已成功摘录入卷",
  "newPoemCount": 49
}
```
* **业务逻辑注意**：后端成功插入 `user_poems` 后，必须将该用户的 `users.poem_count` 自增 1。

---

### 4. 【墨隐书斋】获取我的诗笺收藏列表
* **路由**：`GET /api/poem/my-list`
* **请求头**：`Authorization: Bearer <token>`
* **响应示例 (200 OK)**：
```json
{
  "code": 1,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "title": "水调歌头·明月几时有",
      "author": "苏轼",
      "dynasty": "宋代",
      "content": "明月几时有？把酒问青天...",
      "created_at": "2026-10-12 10:30:00"
    }
  ]
}
```

---

### 5. 【观藏 · 先贤论道】DeepSeek 针对性角色对话
* **路由**：`POST /api/deepseek/chat`
* **请求体 (JSON)**：
```json
{
  "sageId": "libai", // 可选: libai (李白), sushi (苏轼), wangyangming (王阳明), liqingzhao (李清照)
  "message": "先生，我辈青年面对人生逆境，当以何种心境自处？"
}
```
* **系统 Prompt 映射规范（成员 A 必须在后端适配）**：
  - `libai`：盛唐诗仙李白，豪迈不羁，好举杯畅饮，以诗赋回答，充满谪仙人意气。
  - `sushi`：北宋东坡居士苏轼，旷达随性，喜论美食、山水、竹杖芒鞋，语气亲和幽默。
  - `wangyangming`：心学宗师王阳明，强调知行合一、此心光明、致良知，启发探索内心本体。
  - `liqingzhao`：宋代易安居士李清照，才思敏捷，擅言宋词意象与婉约风骨。
* **响应示例 (200 OK)**：
```json
{
  "code": 1,
  "message": "长风破浪会有时，直挂云帆济沧海！逆境何惧？人生天地间，若白驹过隙，把酒言欢，莫失傲骨！"
}
```

---

### 6. 【博古识器】Coze 文物识别接口
* **路由**：`POST /api/coze/recognition`
* **请求体 (JSON)**：
```json
{
  "img": "data:image/jpeg;base64,..."
}
```
* **响应示例 (200 OK)**：
```json
{
  "code": 1,
  "data": {
    "name": "青花海水白龙纹扁瓶",
    "dynasty": "明代·永乐",
    "description": "瓶身通体绘海水纹，白龙翻腾其间，发色浓艳，铁锈斑深入胎骨，为明初景德镇御窑传世珍品。",
    "score": 98
  }
}
```

---

## 👥 三、 协同纪律与派件指引

1. **分支规范**：
   - 成员 A 统一在 `feat/phase2-backend` 分支提交；
   - 成员 B 统一在 `feat/phase2-frontend-poem` 分支提交；
   - 成员 C（队长）在 `feat/phase2-integrate` 分支合流与验收。
2. **零冲突原则**：
   - 成员 A 仅修改 `backend/` 下的路由与控制器；
   - 成员 B 仅新增 `frontend/src/pages/PoemPage.jsx` 与 `poem.less`，以及更新 `Home.jsx` 路由跳转；
   - 公共依赖 `antd-mobile-icons` 已由队长在 `main` 统一安装，成员切勿重复安装。
