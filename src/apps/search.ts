import karin, { Message, segment } from 'node-karin'

import { Config } from '@/common'
import { utils } from '@/models'

export const search = karin.command(/^#?(?:(?:柠糖)?表情)搜索\s*(.+?)$/i, async (e: Message) => {
  if (!Config.meme.enable) return false
  try {
    const [, searchKey] = e.msg.match(search.reg)!

    /** 关键词搜索 */
    const keywords = await utils.get_meme_keywords_by_about(searchKey)
    /** 键值搜索 */
    const keys = await utils.get_meme_keys_by_about(searchKey)

    if (!keywords?.length && !keys?.length) {
      await e.reply(`没有找到${searchKey}相关的表情`)
      return true
    }

    const allResults = [...(keywords ?? []), ...(keys ?? [])]

    const replyMessage = allResults
      .map((kw, index) => `${index + 1}. ${kw}`)
      .join('\n')

    await e.reply([segment.text('你可能在找以下表情：\n' + replyMessage)], { reply: true })
    return true
  } catch (error) {
    await e.reply('搜索出错了：' + (error as Error).message)
    return false
  }
}, {
  name: '柠糖表情:表情搜索',
  priority: -Infinity,
  event: 'message',
  permission: 'all'
})
