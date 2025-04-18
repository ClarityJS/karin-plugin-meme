import karin from 'node-karin'

import { Config, Render } from '@/common'
import { Utils } from '@/models'

export const staat = karin.command(/^#?(?:(清语)?表情|(?:clarity-)?meme)(调用)?统计$/i, async (e) => {
  if (!Config.meme.enable) return false

  const statsData = await Utils.Common.getStatAll() as { key: string, all: number }[]
  if (!statsData || statsData.length === 0) {
    return await e.reply('当前没有统计数据')
  }

  let total = 0
  const formattedStats: { keywords: string; count: number }[] = []

  await Promise.all(statsData.map(async (data) => {
    const { key, all: count } = data
    total += count
    const keywords = await Utils.Tools.getKeyWords(key)
    if (keywords?.length) {
      formattedStats.push({ keywords: keywords.join(', '), count })
    }
  }))

  formattedStats.sort((a, b) => b.count - a.count)

  const img = await Render.render('stat/index', {
    total,
    emojiList: formattedStats
  })

  await e.reply(img)
  return true
}, {
  name: '清语表情:统计',
  priority: -Infinity,
  event: 'message',
  permission: 'all'
})
