const axios = require('axios')
const db = require('../config/db')
require('dotenv').config({ path: ['.env.local', '.env'] })
function parseResult(payload) {
  let value = payload
  for (let i = 0; i < 5; i++) {
    if (typeof value === 'string') { value = JSON.parse(value); continue }
    if (value && typeof value === 'object' && typeof value.name === 'string') break
    value = value?.data ?? value?.output ?? value?.result
  }
  if (!value || typeof value.name !== 'string' || !value.name.trim() || value.name.length > 100 ||
      typeof value.dynasty !== 'string' || !value.dynasty.trim() || value.dynasty.length > 100 ||
      typeof value.description !== 'string' || !value.description.trim() || value.description.length > 20000 ||
      typeof value.score !== 'number' || !Number.isFinite(value.score) || value.score < 0 || value.score > 100) throw new Error('Invalid recognition response')
  return { name: value.name, dynasty: value.dynasty, description: value.description, score: value.score }
}
async function recognition(ctx) {
  const { img } = ctx.request.body || {}
  if (typeof img !== 'string' || img.length > 14 * 1024 * 1024 || !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(img)) {
    ctx.status = 400; ctx.body = { code: 0, message: '请上传有效的 JPEG、PNG 或 WebP 图片（不超过 10MB）' }; return
  }
  const encoded = img.slice(img.indexOf(',') + 1)
  const imageBytes = Math.floor(encoded.length * 3 / 4) - (encoded.endsWith('==') ? 2 : encoded.endsWith('=') ? 1 : 0)
  if (encoded.length % 4 !== 0 || imageBytes > 10 * 1024 * 1024) { ctx.status = 400; ctx.body = { code: 0, message: '图片编码无效或超过 10MB' }; return }
  const apiKey = process.env.COZE_IMAGE_TO_TEXT_AND_VOICE || process.env.VITE_COZE_IMAGE_TO_TEXT_AND_VOICE
  if (!apiKey) { ctx.status = 503; ctx.body = { code: 0, message: '品鉴服务暂未配置，请稍后再试' }; return }
  let data
  try {
    const response = await axios.post('https://r85vf8qf77.coze.site/run', { image: img }, {
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      timeout: 5000, signal: AbortSignal.timeout(5000), maxContentLength: 2 * 1024 * 1024
    })
    data = parseResult(response.data)
  } catch (error) {
    const timeout = ['ECONNABORTED', 'ETIMEDOUT', 'ERR_CANCELED'].includes(error.code)
    ctx.status = timeout ? 504 : 502
    ctx.body = { code: 0, message: timeout ? '品鉴超时，请稍后重试' : '品鉴服务暂不可用，请稍后重试' }
    return
  }
  try {
    const [result] = await db.execute('UPDATE users SET appraise_count = COALESCE(appraise_count, 0) + 1 WHERE id = ?', [ctx.userId])
    if (result.affectedRows !== 1) { ctx.status = 401; ctx.body = { code: 0, message: '请重新入席' }; return }
    ctx.body = { code: 1, data }
  } catch {
    ctx.status = 503; ctx.body = { code: 0, message: '品鉴记录暂未保存，请稍后重试' }
  }
}
module.exports = { recognition }
