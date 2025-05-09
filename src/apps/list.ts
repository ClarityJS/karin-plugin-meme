import karin, { logger, Message } from 'node-karin'

import { Config, Render } from '@/common'
import { utils } from '@/models'
import { Version } from '@/root'

export const list = karin.command(/^#?(?:(?:柠糖)?(表情|meme))列表$/i, async (e: Message) => {
  if (!Config.meme.enable) return false
  try {
    const keys = await utils.get_meme_all_keys()
    if (!keys || keys.length === 0) {
      await e.reply(`[${Version.Plugin_AliasName}]没有找到表情列表, 请使用[#柠糖表情更新资源], 稍后再试`, { reply: true })
      return true
    }

    const tasks = keys.map(async (key) => {
      const keyWords = await utils.get_meme_keyword(key)
      const params = await utils.get_meme_info(key)

      const min_texts = params?.min_texts ?? 0
      const min_images = params?.min_images ?? 0
      const options = params?.options ?? null
      const types: string[] = []
      if (min_texts >= 1) types.push('text')
      if (min_images >= 1) types.push('image')
      if (options !== null) types.push('option')

      if (keyWords) {
        return {
          name: keyWords.join('/'),
          types
        }
      }

      return []
    })
    const memeList = (await Promise.all(tasks)).flat()
    const total = memeList.length

    const img = await Render.render(
      'list/index',
      {
        memeList,
        total
      }
    )
    await e.reply(img)
    return true
  } catch (error) {
    logger.error(error)
  }
})
