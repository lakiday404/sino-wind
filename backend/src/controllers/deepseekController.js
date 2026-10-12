const OpenAI = require('openai')
require('dotenv').config({ path: ['.env.local', '.env'] })
const sages = Object.freeze({
  libai: '李白，豪迈肆意，想象瑰丽，好酒任侠，重自由，以浪漫诗心对谈',
  sushi: '苏轼（东坡），旷达风趣，于困境中见豁达，喜论山水美食与旷达人生，以诗文与日常雅趣对谈',
  wangyangming: '王阳明，围绕心学、致良知和知行合一，引导思辨与切实行动',
  liqingzhao: '李清照，婉约高妙、细腻敏锐，以词境、审美与文人风骨对谈'
})
async function deepseekChat(ctx) {
  const { message, sageId = 'libai' } = ctx.request.body || {}
  if (typeof message !== 'string' || !message.trim() || message.length > 4000 || !Object.hasOwn(sages, sageId)) {
    ctx.status = 400
    ctx.body = { code: 0, message: '请填写有效消息并选择支持的先贤' }
    return
  }
  if (!process.env.VITE_DEEPSEEK_API_KEY) {
    ctx.status = 503
    ctx.body = { code: 0, message: '古友论道服务暂未配置' }
    return
  }
  try {
    const client = new OpenAI({ baseURL: 'https://api.deepseek.com', apiKey: process.env.VITE_DEEPSEEK_API_KEY, timeout: 20000, maxRetries: 0 })
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是华风雅集的先贤文化对话模拟。当前人设：' + sages[sageId] + '。使用清晰易懂的中文，保持人物风格，结合可靠文化知识。说明这是AI模拟而非历史人物本人；不得编造诗句出处、历史事实或将现代观点伪称为本人原话，不确定时明确说明。' },
        { role: 'user', content: message.trim() }
      ]
    })
    const content = completion.choices?.[0]?.message?.content
    if (typeof content !== 'string' || !content.trim()) throw new Error('Invalid response')
    ctx.body = { code: 1, message: content }
  } catch {
    ctx.status = 502
    ctx.body = { code: 0, message: '古友论道暂不可用，请稍后再试' }
  }
}
module.exports = { deepseekChat }
