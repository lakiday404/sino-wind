// 从 backend 目录执行 node scripts/init-day1.js；保留已有数据。
const db = require('../src/config/db')
async function main() {
  const connection = await db.getConnection()
  try {
    const [rows] = await connection.execute('SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?', ['users'])
    if (!rows.length) throw Error('请先完成 users 基础表初始化')
    const names = new Set(rows.map(row => row.COLUMN_NAME))
    const columns = { appraise_count: "INT DEFAULT 12 COMMENT '鉴宝藏器数'", debate_count: "INT DEFAULT 36 COMMENT '论道问策数'", poem_count: "INT DEFAULT 48 COMMENT '诗签摘录数'", rank_level: "VARCHAR(20) DEFAULT '玖阶' COMMENT '文风品位品阶'" }
    for (const [name, definition] of Object.entries(columns)) {
      if (!names.has(name)) await connection.query('ALTER TABLE users ADD COLUMN ' + name + ' ' + definition)
    }
    await connection.query(`CREATE TABLE IF NOT EXISTS user_poems (
      id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL COMMENT '用户ID', poem_id VARCHAR(64),
      title VARCHAR(100) NOT NULL, author VARCHAR(50) NOT NULL, dynasty VARCHAR(30) DEFAULT '唐代',
      content TEXT NOT NULL, appreciation TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户诗签收藏表'`)
    console.log('Day 1 数据库结构初始化完成')
  } finally { connection.release() }
}
main().catch(() => { console.error('初始化失败，请检查数据库配置、users 基础表及 ALTER/CREATE 权限'); process.exitCode = 1 }).finally(() => db.end())
