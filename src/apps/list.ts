import karin, { logger } from 'node-karin'

import { Config, Render, Version } from '@/common'
import { Utils } from '@/models'

export const list = karin.command(/^#?(?:(清语)?表情|(?:clarity-)?meme)列表$/i, async (e) => {
  if (!Config.meme.enable) return false
  try {
    const keys = await Utils.Tools.getAllKeys()

    if (!keys || keys.length === 0) {
      await e.reply(`[${Version.Plugin_AliasName}]没有找到表情列表, 请使用[#清语表情更新资源], 稍后再试`, { reply: true })
      return true
    }

    const tasks = keys.map(async (key) => {
      const keyWords = await Utils.Tools.getKeyWords(key) ?? null
      const params = await Utils.Tools.getParams(key) ?? null

      const min_texts = params?.min_texts ?? 0
      const min_images = params?.min_images ?? 0
      const args_type = params?.args_type ?? null
      const types: string[] = []
      if (min_texts >= 1) types.push('text')
      if (min_images >= 1) types.push('image')
      if (args_type !== null) types.push('arg')

      if (keyWords) {
        return keyWords.map(keyword => ({
          name: keyword,
          types
        }))
      }

      return []
    })

    const memeList = (await Promise.all(tasks)).flat()
    const total = memeList.length

    const img = await Render.render(
      'meme/list',
      {
        memeList,
        total
      }
    )
    await e.reply(img)
    return true
  } catch (error) {
    logger.error('加载表情列表失败:', error)
    await e.reply('加载表情列表失败，请稍后重试', { reply: true })
    return true
  }
}, {
  name: '清语表情:列表',
  priority: -Infinity,
  permission: 'all'
})
