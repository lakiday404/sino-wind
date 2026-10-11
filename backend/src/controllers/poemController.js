const axios = require('axios')
const db = require('../config/db')
const fallback = [
  { id: 'local-jingyesi', title: '静夜思', author: '李白', dynasty: '唐', content: ['床前明月光，疑是地上霜。', '举头望明月，低头思故乡。'], appreciation: '月色触发乡思，语言自然，情感深切。（本地简析）' },
  { id: 'local-chunxiao', title: '春晓', author: '孟浩然', dynasty: '唐', content: ['春眠不觉晓，处处闻啼鸟。', '夜来风雨声，花落知多少。'], appreciation: '从鸟鸣与风雨写春日清晨，含蓄表达惜春之情。（本地简析）' }
]
const cache = new Map(), pending = new Map()
const ttl = 60000
function normalize(poem) {
  const result = { id: String(poem.id ?? ''), title: poem.title, author: typeof poem.author === 'string' ? poem.author : poem.author?.name,
    dynasty: typeof poem.dynasty === 'string' ? poem.dynasty : poem.dynasty?.name,
    content: Array.isArray(poem.content) ? poem.content : typeof poem.content === 'string' ? poem.content.split(/\r?\n/) : [], appreciation: typeof poem.appreciation === 'string' ? poem.appreciation : '', metadataVerified: false }
  if (typeof result.title !== 'string' || !result.title.trim() || typeof result.author !== 'string' || !result.author.trim() || !result.content.length || result.content.some(line => typeof line !== 'string' || !line.trim())) throw Error('Invalid upstream poem')
  return result
}
async function query(kind, keyword = '') {
  const key = kind + ':' + keyword
  const saved = cache.get(key)
  if (saved && saved.expires > Date.now()) return saved.value
  if (pending.has(key)) return pending.get(key)
  const request = (async () => {
    let value
    try {
      const response = await axios.get('https://poetry.palemoky.com' + (kind === 'random' ? '/api/poems/random' : '/api/search'), {
        params: { lang: 'zh-Hans', ...(kind === 'search' ? { q: keyword } : {}) }, timeout: 4000, maxContentLength: 2 * 1024 * 1024
      })
      const data = response.data.data
      if (kind === 'random') value = { data: normalize(data), source: 'shiquan', degraded: false }
      else {
        const list = Array.isArray(data) ? data : data?.poems ?? data?.results ?? data?.items
        if (!Array.isArray(list)) throw Error('Invalid upstream search')
        value = { data: list.slice(0, 50).map(normalize), source: 'shiquan', degraded: false }
      }
    } catch {
      value = { data: kind === 'random' ? fallback[Math.floor(Math.random() * fallback.length)] : fallback.filter(p => [p.title, p.author, ...p.content].join('').includes(keyword)), source: 'local-fallback', degraded: true }
    }
    if (cache.size >= 100) cache.delete(cache.keys().next().value)
    cache.set(key, { expires: Date.now() + (value.degraded ? 10000 : kind === 'random' ? 2000 : ttl), value })
    return value
  })()
  pending.set(key, request)
  try { return await request } finally { pending.delete(key) }
}
const dataNotice = '第三方朝代字段存在已知错误，文化信息尚未经逐条核验；缺少赏析时请展示暂无赏析'
async function random(ctx) { ctx.body = { code: 1, ...(await query('random')), dataNotice } }
async function search(ctx) {
  const q = ctx.query.q ?? ctx.query.keyword
  if (typeof q !== 'string' || !q.trim() || q.length > 100) { ctx.status = 400; ctx.body = { code: 0, message: '请输入 1–100 字的关键词' }; return }
  ctx.body = { code: 1, ...(await query('search', q.trim())), dataNotice }
}
async function collect(ctx) {
  const body = ctx.request.body || {}, input = body.poem || body
  const content = Array.isArray(input.content) ? input.content.join('\n') : input.content
  const poemId = input.poem_id ?? input.id ?? null
  const valid = (x, limit) => typeof x === 'string' && x.trim().length > 0 && x.length <= limit
  if ((Array.isArray(input.content) && input.content.some(line => typeof line !== 'string')) ||
      !valid(input.title, 100) || !valid(input.author, 50) || !valid(content, 20000) || (typeof content === 'string' && Buffer.byteLength(content, 'utf8') > 60000) ||
      (input.dynasty != null && !valid(input.dynasty, 30)) || (input.appreciation != null && (typeof input.appreciation !== 'string' || input.appreciation.length > 20000 || Buffer.byteLength(input.appreciation, 'utf8') > 60000)) ||
      (poemId != null && ((typeof poemId !== 'string' && typeof poemId !== 'number') || !valid(String(poemId), 64)))) {
    ctx.status = 400; ctx.body = { code: 0, message: '诗词字段不完整或超出长度限制' }; return
  }
  let connection
  try {
    connection = await db.getConnection()
    await connection.beginTransaction()
    const [users] = await connection.execute('SELECT id FROM users WHERE id = ? FOR UPDATE', [ctx.userId])
    if (!users.length) { await connection.rollback(); ctx.status = 401; ctx.body = { code: 0, message: '请重新入席' }; return }
    const [existing] = await connection.execute('SELECT id FROM user_poems WHERE user_id = ? AND title = ? AND author = ? AND content = ? LIMIT 1', [ctx.userId, input.title.trim(), input.author.trim(), content])
    if (existing.length) { await connection.commit(); ctx.body = { code: 1, message: '已在诗笺中', id: existing[0].id, collected: false }; return }
    const [result] = await connection.execute('INSERT INTO user_poems (user_id, poem_id, title, author, dynasty, content, appreciation) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ctx.userId, poemId == null ? null : String(poemId), input.title.trim(), input.author.trim(), input.dynasty?.trim() || '待考', content, input.appreciation || null])
    await connection.execute('UPDATE users SET poem_count = COALESCE(poem_count, 0) + 1 WHERE id = ?', [ctx.userId])
    await connection.commit()
    ctx.body = { code: 1, message: '已摘录入卷', id: result.insertId, collected: true }
  } catch {
    if (connection) await connection.rollback().catch(() => {})
    ctx.status = 503; ctx.body = { code: 0, message: '摘录服务暂不可用，请稍后重试' }
  } finally { if (connection) connection.release() }
}
// 供成员 C 的“我的诗笺”读取，用户身份仅取自已验证的 Token。
async function collection(ctx) {
  const page = Number(ctx.query.page || 1), pageSize = Number(ctx.query.pageSize || 20)
  if (!Number.isSafeInteger(page) || page < 1 || page > 100000 || !Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 50) {
    ctx.status = 400; ctx.body = { code: 0, message: '分页参数无效' }; return
  }
  try {
    const [rows] = await db.query('SELECT id, poem_id, title, author, dynasty, content, appreciation, created_at FROM user_poems WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?', [ctx.userId, pageSize, (page - 1) * pageSize])
    const [[total]] = await db.execute('SELECT COUNT(*) AS total FROM user_poems WHERE user_id = ?', [ctx.userId])
    ctx.body = { code: 1, data: rows, pagination: { page, pageSize, total: total.total } }
  } catch { ctx.status = 503; ctx.body = { code: 0, message: '诗笺暂未获取，请稍后重试' } }
}
module.exports = { random, search, collect, collection }
