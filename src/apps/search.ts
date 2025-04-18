import karin, { logger } from 'node-karin'

import { Config } from '@/common'
import { Utils } from '@/models'
import { Version } from '@/root'

export const search = karin.command(/^#?(?:(清语)?表情|(?:clarity-)?meme)搜索\s*(.+)\s*$/i, async (e) => {
  if (!Config.meme.enable) return false
  try {
    const message = (e.msg || '').trim()
    const match = message.match(search.reg)
    if (!match) {
      await e.reply('无法解析搜索关键字，请检查输入格式', { reply: true })
      return true
    }
    const keyword = match[2].trim()

    if (!keyword) {
      await e.reply('请提供搜索的表情关键字', { reply: true })
      return true
    }

    const allKeywords = await Utils.Tools.getAllKeyWords('meme')

    if (!allKeywords || allKeywords.length === 0) {
      await e.reply('表情数据未加载，请稍后重试', { reply: true })
      return true
    }

    const lowerCaseKeyword = keyword.toLowerCase()
    const results = allKeywords.filter(kw => kw.toLowerCase().includes(lowerCaseKeyword))

    if (results.length === 0) {
      await e.reply(`未找到与 "${keyword}" 相关的表情`, { reply: true })
      return true
    }

    const uniqueResults = [...new Set(results)].sort()

    const replyMessage = uniqueResults
      .map((kw, index) => `${index + 1}. ${kw}`)
      .join('\n')

    await e.reply(replyMessage, { reply: true })
    return true
  } catch (error) {
    logger.error(`[${Version.Plugin_AliasName}] 搜索表情失败: ${error}`)
    await e.reply(`[${Version.Plugin_AliasName}] 搜索表情失败，请稍后重试`, { reply: true })
    return true
  }
}, {
  name: '清语表情:详情',
  priority: -Infinity,
  event: 'message',
  permission: 'all'
}
)
