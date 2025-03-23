import karin, { logger, Message, segment } from 'node-karin'

import { Config, Version } from '@/common'
import { Meme, Utils } from '@/models'
import { BaseType } from '@/types'

type PresetType = BaseType['utils']['preset']

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

memeRegExp = await createRegex(() => Utils.Tools.getAllKeyWords('meme'))
presetRegExp = await createRegex(() => Utils.Tools.getAllKeyWords('preset'))

/**
 * 更新正则
 */
export const updateRegExp = async () => {
  memeRegExp = await createRegex(() => Utils.Tools.getAllKeyWords('meme'))
  presetRegExp = await createRegex(() => Utils.Tools.getAllKeyWords('preset'))
  meme.reg = memeRegExp
}

/**
 * 用户权限检查
 */
const checkUserAccess = (e: Message): boolean => {
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
  return true
}

/**
 * 禁用表情检查
 */
const checkBlacklisted = async (keyword: string): Promise<boolean> => {
  if (Config.access.blackListEnable && await Utils.Tools.isBlacklisted(keyword)) {
    logger.info(`[清语表情] 该表情 "${keyword}" 在禁用列表中，跳过生成`)
    return true
  }
  return false
}

/**
 * 防误触发处理
 */
const checkUserText = (min_texts: number, max_texts: number, UserText: string): boolean => {
  if (min_texts === 0 && max_texts === 0 && UserText) {
    const trimmedText = UserText.trim()
    if (
      !/^(@\s*\d+\s*)+$/.test(trimmedText) &&
      !/^(#\S+\s+[^#]+)(\s+#\S+\s+[^#]+)*$/.test(trimmedText)
    ) {
      return false
    }
  }
  return true
}

/**
 * 表情包生成准备
 */
const validatePrepareMeme = async (
  e: Message,
  keyword: string,
  memeKeyType: 'meme' | 'preset',
  isPreset: boolean = false
) => {
  const UserText = e.msg.match(new RegExp(`#?${keyword}(.*)`))?.[1]?.trim() ?? ''
  const memeKey = await Utils.Tools.getKey(keyword, memeKeyType)
  if (!memeKey) return false
  const params = await Utils.Tools.getParams(memeKey)
  if (!params) return false

  const min_texts = params.min_texts ?? 0
  const max_texts = params.max_texts ?? 0
  const min_images = params.min_images ?? 0
  const max_images = params.max_images ?? 0
  const defText = params.default_texts ?? null
  const args_type = params.args_type ?? null

  /* 检查用户权限 */
  if (!checkUserAccess(e)) return false

  /* 检查禁用表情列表 */
  if (await checkBlacklisted(keyword)) return false

  /* 防误触发处理 */
  if (!checkUserText(min_texts, max_texts, UserText)) return false

  try {
    const Preset = isPreset ? { Preset: await Utils.Tools.getPreseInfo(keyword) as PresetType | undefined } : {}
    const result = await Meme.make(
      e,
      memeKey,
      min_texts,
      max_texts,
      min_images,
      max_images,
      defText,
      args_type,
      UserText,
      isPreset,
      Preset
    )
    await e.reply(segment.image(result))
    return true
  } catch (error) {
    if (Config.meme.errorReply) {
      await e.reply(`[${Version.Plugin_AliasName}] 生成表情失败, 错误信息: ${(error as Error).message}`)
    }
  }
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
    return validatePrepareMeme(e, keyword, 'meme')
  },
  {
    name: '清语表情:表情包合成',
    priority: -Infinity,
    event: 'message',
    permission: 'all'
  }
)

/**
 * 预设命令
 */
export const preset = karin.command(presetRegExp,
  async (e: Message) => {
    if (!Config.meme.enable) return false

    const match = e.msg.match(presetRegExp)
    if (!match) return false

    const keyword = match[1]
    return validatePrepareMeme(e, keyword, 'preset', true)
  },
  {
    name: '清语表情:预设合成',
    priority: -Infinity,
    event: 'message',
    permission: 'all'
  }
)
