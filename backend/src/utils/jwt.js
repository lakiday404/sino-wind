const jwt = require('jsonwebtoken')
function verifyToken() {
  return async (ctx, next) => {
    const header = ctx.request.header.authorization
    const token = typeof header === 'string' ? header.replace(/^Bearer\s+/i, '').trim() : ''
    let decoded
    try {
      decoded = jwt.verify(token, '666')
      if (!Number.isSafeInteger(decoded.id) || decoded.id <= 0) throw new Error('Invalid subject')
    } catch {
      // 保留既有客户端使用的 416，不改变登录签名协议。
      ctx.status = 416
      ctx.body = { code: 0, message: token ? 'token失效' : '请重新登录' }
      return
    }
    ctx.userId = decoded.id
    // 业务异常不应被误报为 Token 失效。
    await next()
  }
}
module.exports = { verifyToken }
