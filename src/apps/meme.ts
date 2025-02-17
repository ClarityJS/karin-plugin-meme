import karin, { Message } from 'node-karin'

import { Config } from '@/common'
import { Meme, Utils } from '@/models'

const createRegExp = (): RegExp => {
  const keywords = Utils.Tools.getAllKeywords() ?? []
  const prefix = Config.meme.forceSharp ? '^#' : '^#?'
  const escapedKeywords = keywords.map(keyword =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )

  const keywordsRegex = `(${escapedKeywords.join('|')})`
  return new RegExp(`${prefix}${keywordsRegex}(.*)`, 'i')
}

export const meme = karin.command(createRegExp(), async (e: Message) => {
  if (!Config.meme.enable) return false
  const match = e.msg.match(createRegExp())
  console.log(createRegExp())
  if (!match) return false
  const keyword = match[1]
  const UserText = match[2].trim() || ''
  const memeKey = Utils.Tools.getKey(keyword)
  if (!memeKey) return false
  const params = Utils.Tools.getParams(memeKey)
  if (!params) return false

  const { min_texts, max_texts, min_images, max_images, default_texts, args_type } = params
  await Meme.make(e, memeKey, UserText, min_texts, max_texts, min_images, max_images, default_texts, args_type)
  return true
}, {
  name: '清语表情:表情包合成',
  priority: -Infinity,
  event: 'message'
})
