import karin from 'node-karin'

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

export const meme = karin.command(createRegExp(), async (e) => {
  const match = e.msg.match(createRegExp())
  if (!match) return false
  const keyword = match[1]
  const UserText = match[2]?.trim() || ''
  const key = Utils.Tools.getKey(keyword)
  if (!key) return false

  await Meme.make(e, key, UserText)
  return true
})
