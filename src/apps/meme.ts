import karin, { Message, segment } from 'node-karin'

import { Config, Version } from '@/common'
import { Meme, Utils } from '@/models'
const createRegExp = async (): Promise<RegExp> => {
  const keywords = (await Utils.Tools.getAllKeyWords()) ?? []
  const prefix = Config.meme.forceSharp ? '^#' : '^#?'
  const escapedKeywords = keywords.map((keyword) =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )

  const keywordsRegex = `(${escapedKeywords.join('|')})`
  return new RegExp(`${prefix}${keywordsRegex}(.*)`, 'i')
}

export const meme = karin.command(
  await createRegExp(),
  async (e: Message) => {
    if (!Config.meme.enable) return false

    const match = e.msg.match(await createRegExp())
    if (!match) return false
    const keyword = match[1]
    const UserText = match[2].trim() || ''
    const memeKey = await Utils.Tools.getKey(keyword)
    if (!memeKey) return false
    const params = await Utils.Tools.getParams(memeKey)
    if (!params) return false

    const min_texts = params.min_texts ?? 0
    const max_texts = params.max_texts ?? 0
    const min_images = params.min_images ?? 0
    const max_images = params.max_images ?? 0
    const defText = params.default_texts ?? null
    const args_type = params.args_type ?? null

    /**
     * 防误触发处理
     */
    if (min_texts === 0 && max_texts === 0) {
      if (UserText && !/^(@\s*\d+\s*)+$/.test(UserText.trim())) {
        return false
      }
    }

    try {
      const result = await Meme.make(
        e,
        memeKey,
        min_texts,
        max_texts,
        min_images,
        max_images,
        defText,
        args_type,
        UserText
      )
      await e.reply(segment.image(result))
      return true
    } catch (error: any) {
      if (Config.meme.errorReply) {
        await e.reply(
          `[${Version.Plugin_AliasName}] 生成表情失败, 错误信息: ${error.message}`
        )
      }
    }
  },
  {
    name: '清语表情:表情包合成',
    priority: -Infinity,
    event: 'message',
    permission: 'all'
  }
)
