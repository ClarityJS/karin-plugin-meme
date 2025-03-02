import karin, { base64, common, ImageElement, Message, segment, TextElement } from 'node-karin'

import { Version } from '@/common'
import { gif, Utils } from '@/models'

export const slice = karin.command(/^#?(?:(清语)?表情|(?:clarity-)?meme)?gif分解$/, async (e: Message) => {
  try {
    const image = await Utils.Common.getImage(e)
    if (!image) throw new Error('没有找到图片')
    let replyMessage: (TextElement | ImageElement)[] = [
      segment.text('=========== 分解的图片 ===========\n')
    ]

    const gifImages = await gif.slice(image[0])

    for (const frame of gifImages.frames) {
      const base64Image = await base64(frame)
      replyMessage.push(segment.image(`base64://${base64Image}`))
    }
    replyMessage.push(segment.text('=========== 分解的图片 ==========='))

    await e.bot.sendForwardMsg(e.contact, common.makeForward(replyMessage, e.bot.account.selfId, e.bot.account.name), { news: [{ text: 'Gif分解' }], prompt: 'Gif分解', summary: Version.Plugin_Name, source: 'Gif分解' })
  } catch (error) {
    await e.reply(`处理 GIF 时出错，请稍后再试, ${error instanceof Error ? error.message : '未知错误'}`)
  }
})

export const gearshift = karin.command(/^#?(?:(清语)?表情|meme(?:-plugin)?)?gif变速\s*(.+?)$/i, async (e: Message) => {
  const message = (e.msg || '').trim()
  const match = message.match(gearshift.reg)
  if (!match) return
  const spend = Number(match[2])
  try {
    const image = await Utils.Common.getImage(e)
    if (!image) throw new Error('没有找到图片')
    const speedImage = await gif.gearshift(image[0], spend)
    await e.reply(segment.image(`base64://${await base64(speedImage)}`))
  } catch (error) {
    await e.reply(`处理 GIF 时出错，请稍后再试, ${error instanceof Error ? error.message : '未知错误'}`)
  }
})
