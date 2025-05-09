import karin, { logger, Message, segment } from 'node-karin'

import { Config } from '@/common'
import { make, utils } from '@/models'
import { Version } from '@/root'

let memeRegExp: RegExp, presetRegExp: RegExp

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
presetRegExp = await createRegex(async () => await utils.get_preset_all_keywords() ?? [])

/**
 * 更新正则
 */
export const updateRegExp = async () => {
  memeRegExp = await createRegex(async () => await utils.get_meme_all_keywords() ?? [])
  presetRegExp = await createRegex(async () => await utils.get_preset_all_keywords() ?? [])
  preset.reg = presetRegExp
  meme.reg = memeRegExp
}

/**
 * 权限检查
 * @param e 消息
 * @returns 是否有权限
 */
const checkUserAccess = (e: Message): boolean => {
  if (Config.access.enable) {
    const userId = e.userId
    if (Config.access.mode === 0 && !Config.access.userWhiteList.includes(userId)) {
      logger.info(`[${Version.Plugin_AliasName}] 用户 ${userId} 不在白名单中，跳过生成`)
      return false
    } else if (Config.access.mode === 1 && Config.access.userBlackList.includes(userId)) {
      logger.info(`[${Version.Plugin_AliasName}] 用户 ${userId} 在黑名单中，跳过生成`)
      return false
    }
  }
  return true
}

/**
 * 禁用表情检查
 * @param keywordOrKey - 表情关键词或key
 * @returns 是否在禁用列表中
 */
const checkBlacklisted = async (keywordOrKey: string): Promise<boolean> => {
  if (!Config.access.blackListEnable || Config.access.blackList.length < 0) {
    return false
  }
  const key = await utils.get_meme_key_by_keyword(keywordOrKey)
  if (!key) {
    return false
  }

  const blacklistKeys = await Promise.all(
    Config.access.blackList.map(async item => {
      const convertedKey = await utils.get_meme_key_by_keyword(item)
      return convertedKey ?? item
    })
  )

  if (blacklistKeys.includes(key)) {
    logger.info(`[${Version.Plugin_AliasName}] 该表情 "${key}" 在禁用列表中，跳过生成`)
    return true
  }

  return false
}

/**
 * 防误触发处理
 */
const checkUserText = (min_texts: number, max_texts: number, userText: string): boolean => {
  if (min_texts === 0 && max_texts === 0 && userText) {
    const trimmedText = userText.trim()
    if (
      !/^(@\s*\d+\s*)+$/.test(trimmedText) &&
      !/^(#\S+\s+[^#]+(?:\s+#\S+\s+[^#]+)*)$/.test(trimmedText)
    ) {
      return false
    }
  }
  return true
}

export const meme = karin.command(memeRegExp, async (e: Message) => {
  try {
    const [, keyword, userText] = e.msg.match(meme.reg)!
    const key = await utils.get_meme_key_by_keyword(keyword)
    if (!key) return false
    const memeInfo = await utils.get_meme_info(key)
    const min_texts = memeInfo?.min_texts ?? 0
    const max_texts = memeInfo?.max_texts ?? 0
    const min_images = memeInfo?.min_images ?? 0
    const max_images = memeInfo?.max_images ?? 0
    const options = memeInfo?.options ?? null
    /* 检查用户权限 */
    if (!checkUserAccess(e)) return false

    /* 检查禁用表情列表 */
    if (await checkBlacklisted(keyword)) return false

    /* 防误触发处理 */
    if (!checkUserText(min_texts, max_texts, userText)) return false

    const res = await make.make_meme(
      e,
      key,
      min_texts,
      max_texts,
      min_images,
      max_images,
      options,
      userText
    )
    await e.reply([segment.image(res)])
  } catch (error) {
    logger.error(error)
    if (Config.meme.errorReply) {
      return await e.reply(`[${Version.Plugin_AliasName}]: 生成表情失败, 错误信息: ${(error as Error).message}`)
    }
    return true
  }
}, {
  name: '柠糖表情:表情合成',
  priority: -Infinity,
  event: 'message',
  permission: 'all'
})

export const preset = karin.command(presetRegExp, async (e: Message) => {
  if (!Config.meme.enable) return false
  try {
    const [, keyword, userText] = e.msg.match(preset.reg)!
    const key = await utils.get_preset_key_by_keyword(keyword)
    if (!key) return false
    const memeInfo = await utils.get_meme_info(key)
    const min_texts = memeInfo?.min_texts ?? 0
    const max_texts = memeInfo?.max_texts ?? 0
    const min_images = memeInfo?.min_images ?? 0
    const max_images = memeInfo?.max_images ?? 0
    const options = memeInfo?.options ?? null
    /* 检查用户权限 */
    if (!checkUserAccess(e)) return false

    /* 检查禁用表情列表 */
    if (await checkBlacklisted(keyword)) return false

    /* 防误触发处理 */
    if (!checkUserText(min_texts, max_texts, userText)) return false

    const res = await make.make_meme(
      e,
      key,
      min_texts,
      max_texts,
      min_images,
      max_images,
      options,
      userText,
      true
    )
    await e.reply([segment.image(res)])
  } catch (error) {
    logger.error(error)
    if (Config.meme.errorReply) {
      return await e.reply(`[${Version.Plugin_AliasName}]: 生成表情失败, 错误信息: ${(error as Error).message}`)
    }
    return true
  }
}, {
  name: '柠糖表情:预设表情合成',
  priority: -Infinity,
  event: 'message',
  permission: 'all'
})

await updateRegExp()
