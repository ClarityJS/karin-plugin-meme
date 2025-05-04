import karin, { logger, Message, segment } from 'node-karin'

import { Config } from '@/common'
import { make, utils } from '@/models'
import { Version } from '@/root'

let memeRegExp: RegExp

/**
 * 生成正则
 */
const createRegex = async (getKeywords: () => Promise<string[]>): Promise<RegExp> => {
  const keywords = (await getKeywords()) ?? []
  const prefix = Config.meme.forceSharp ? '^#' : '^#?'
  const escapedKeywords = keywords.map((keyword) =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )
  const keywordsRegex = `(${escapedKeywords.join('|')})`
  return new RegExp(`${prefix}${keywordsRegex}(.*)`, 'i')
}

memeRegExp = await createRegex(async () => await utils.get_meme_all_keywords() ?? [])

export const meme = karin.command(memeRegExp, async (e: Message) => {
  try {
    const [, keyword, text] = e.msg.match(memeRegExp)!
    const key = await utils.get_meme_key_by_keyword(keyword)
    if (!key) return false
    const meme = await utils.get_meme_info(key)
    const min_texts = meme?.min_texts ?? 0
    const max_texts = meme?.max_texts ?? 0
    const min_images = meme?.min_images ?? 0
    const max_images = meme?.max_images ?? 0
    const options = meme?.options ?? null
    const res = await make.make_meme(
      e,
      key,
      min_texts,
      max_texts,
      min_images,
      max_images,
      options,
      text
    )
    await e.reply([segment.image(res)])
  } catch (error) {
    logger.error(error)
    return await e.reply(`[${Version.Plugin_AliasName}]: 生成表情失败, 错误信息: ${(error as Error).message}`)
  }
})
