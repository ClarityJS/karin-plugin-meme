import karin, { logger, Message, segment } from 'node-karin'

import { Config, Version } from '@/common'
import { Meme, Utils } from '@/models'

/**
 * 生成正则
 */
const generateRegExp = async (): Promise<RegExp> => {
  const keywords = (await Utils.Tools.getAllKeyWords()) ?? []
  const prefix = Config.meme.forceSharp ? '^#' : '^#?'
  const escapedKeywords = keywords.map((keyword) =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )
  const keywordsRegex = `(${escapedKeywords.join('|')})`
  return new RegExp(`${prefix}${keywordsRegex}(.*)`, 'i')
}

let memeRegExp = await generateRegExp()
/**
 * 更新正则
 */
export const updateRegExp = async () => {
  const reg = await generateRegExp()
  meme.reg = reg
  memeRegExp = reg
}

/**
 * 表情包命令
 */
export const meme = karin.command(memeRegExp,
  async (e: Message) => {
    if (!Config.meme.enable) return false

    const match = e.msg.match(memeRegExp)
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

    if (Config.access.enable) {
      const userId = e.userId
      if (Config.access.mode === 0 && !Config.access.userWhiteList.includes(userId)) {
        logger.info(`[清语表情] 用户 ${userId} 不在白名单中，跳过生成`)
        return false
      } else if (Config.access.mode === 1 && Config.access.userBlackList.includes(userId)) {
        logger.info(`[清语表情] 用户 ${userId} 在黑名单中，跳过生成`)
        return false
      }
    }

    /**
     *  禁用表情列表
     */
    if (Config.access.blackListEnable && await Utils.Tools.isBlacklisted(keyword)) {
      logger.info(`[清语表情] 该表情 "${keyword}" 在禁用列表中，跳过生成`)
      return false
    }

    /**
     * 防误触发处理
     */
    if (min_texts === 0 && max_texts === 0) {
      if (UserText) {
        const trimmedText = UserText.trim()
        if (
          !/^(@\s*\d+\s*)+$/.test(trimmedText) &&
          !/^(#\S+\s+[^#]+)(\s+#\S+\s+[^#]+)*$/.test(trimmedText)
        ) {
          return false
        }
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
