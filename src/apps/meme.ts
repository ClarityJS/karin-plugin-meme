import karin, { Message, segment } from 'node-karin'

import { Config, Version } from '@/common'
import { Meme, Utils } from '@/models'

const createRegExp = async (): Promise<RegExp> => {
  const keywords = (await Utils.Tools.getAllKeyWords()) ?? []
  const shortcuts = (await Utils.Tools.getAllShortcuts()) ?? []

  const prefix = Config.meme.forceSharp ? '^#' : '^#?'

  const escapedKeywords = keywords.map((keyword) =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )
  const keywordsRegex = `(${escapedKeywords.join('|')})`

  const escapedShortcuts = shortcuts
    .filter(Boolean)
    .map((shortcut: any) => {
      return shortcut.key
    })
  const shortcutsRegex = `(${escapedShortcuts.join('|')})`

  const combinedRegex = `(${keywordsRegex}|${shortcutsRegex})`

  return new RegExp(`${prefix}${combinedRegex}`, 'i')
}

export const meme = karin.command(
  await createRegExp(),
  async (e: Message) => {
    if (!Config.meme.enable) return false
    const match = e.msg.match(await createRegExp())
    if (!match) return false
    const matchKeywordOrShortcut = match[1]
    let userText = match[2] ? match[2].trim() : ''

    let isShortcut = false
    let memeKey: string | null = null

    const shortcutKey = await Utils.Tools.getKeyByShortcuts(matchKeywordOrShortcut)
    let shortcutKeyWoerd
    if (shortcutKey) {
      isShortcut = true
      memeKey = shortcutKey
      const result = match.flat().filter(result => result !== null && result !== undefined).reverse()
      let data = ''
      if (result.length === 5) {
        data = `${result[1]}/${result[0]}`
      } else if (result.length === 3) {
        data = result[0]
      }
      userText = data
      shortcutKeyWoerd = result[2]
    } else {
      memeKey = await Utils.Tools.getKey(matchKeywordOrShortcut)
    }
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
      if (userText) {
        const trimmedText = userText.trim()

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
        userText,
        isShortcut,
        shortcutKeyWoerd
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
