import karin, { Message } from 'node-karin'

import { Config } from '@/common'
import { Meme, Utils } from '@/models'
import { BaseType } from '@/types'
type MemeData = BaseType['utils']['meme']
type ArgsType = MemeData['params_type']['args_type']

const createRegExp = async (): Promise<RegExp> => {
  const keywords = await Utils.Tools.getAllKeyWords() ?? []
  const prefix = Config.meme.forceSharp ? '^#' : '^#?'
  const escapedKeywords = keywords.map(keyword =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )

  const keywordsRegex = `(${escapedKeywords.join('|')})`
  return new RegExp(`${prefix}${keywordsRegex}(.*)`, 'i')
}

export const meme = karin.command(await createRegExp(), async (e: Message) => {
  if (!Config.meme.enable) return false

  const match = e.msg.match(await createRegExp())
  if (!match) return false
  const keyword = match[1]
  const UserText = match[2].trim() || ''
  console.log(keyword)
  const memeKey = await Utils.Tools.getKey(keyword)
  console.log(memeKey)
  if (!memeKey) return false
  const params = await Utils.Tools.getParams(memeKey)
  console.log(params)
  if (!params) return false

  const { min_texts, max_texts, min_images, max_images, default_texts, args_type } = params
  await Meme.make(
    e,
    memeKey,
    UserText,
    min_texts ?? 0,
    max_texts ?? 0,
    min_images ?? 0,
    max_images ?? 0,
    default_texts ?? [],
    args_type as unknown as ArgsType | null ?? null
  )
  return true
}, {
  name: '清语表情:表情包合成',
  priority: -Infinity,
  event: 'message'
})
