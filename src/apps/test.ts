import karin, { base64, common, ImageElement, Message, segment, TextElement } from 'node-karin'

import { db, Utils } from '@/models'

export const test = karin.command(/^#?(?:(清语)?表情|(?:clarity-)?meme)测试$/i, async (e: Message) => {
  const all = await Utils.Tools.getKey('骑')
  console.log(all)
  return true
}, {
  name: '清语表情:测试',
  priority: -Infinity,
  event: 'message'
})
