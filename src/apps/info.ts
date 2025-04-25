import karin, { common, ImageElement, Message, segment, TextElement } from 'node-karin'

import { Config } from '@/common'
import { Utils } from '@/models'

export const info = karin.command(/^#?(?:(清语)?表情|(?:clarity-)?meme)\s*详情\s*(.+?)$/i, async (e: Message) => {
  if (!Config.meme.enable) return false
  const message = (e.msg || '').trim()
  const match = message.match(info.reg)
  if (!match) return

  const keyword = match[2]
  const memeKey = await Utils.Tools.getKey(keyword) ?? null
  const memeParams = memeKey ? await Utils.Tools.getParams(memeKey) : null

  if (!memeKey || !memeParams) {
    await e.reply('未找到相关表情包详情, 请稍后再试', { reply: true })
    return true
  }

  const {
    min_texts = null,
    max_texts = null,
    min_images = null,
    max_images = null
  } = memeParams

  const argsdescObj = await Utils.Tools.getDescriptions(memeKey) ?? null
  const argsdesc = argsdescObj
    ? Object.entries(argsdescObj).map(([paramName, description]) => `[${paramName}: ${description}]`).join(' ')
    : null

  const aliasList = await Utils.Tools.getKeyWords(memeKey) ?? null
  const alias = aliasList ? aliasList.map(text => `[${text}]`).join(' ') : '[无]'

  const argsCmd = await Utils.Tools.gatPresetAllName(memeKey) ?? null
  const argsCmdList = argsCmd?.length ? argsCmd.map(name => `[${name}]`).join(' ') : '[无]'

  const defTextList = await Utils.Tools.getDeftext(memeKey) ?? null
  const defText = defTextList ? defTextList.map((text: string) => `[${text}]`).join(' ') : '[无]'

  const tagsList = await Utils.Tools.getTags(memeKey) ?? null
  const tags = tagsList ? tagsList.map((tag:string) => `[${tag}]`).join(' ') : '[无]'

  let previewImageBase64 = null
  try {
    const previewImageUrl = Utils.Tools.getPreviewUrl(memeKey)
    if (previewImageUrl) {
      previewImageBase64 = await common.base64(previewImageUrl)
    }
  } catch {
  }

  const replyMessage: (TextElement | ImageElement)[] = [
    segment.text(`名称: ${memeKey}\n`),
    segment.text(`别名: ${alias}\n`),
    segment.text(`图片数量: ${min_images} ~ ${max_images ?? '[未知]'}\n`),
    segment.text(`文本数量: ${min_texts} ~ ${max_texts ?? '[未知]'}\n`),
    segment.text(`默认文本: ${defText}\n`),
    segment.text(`标签: ${tags}`)
  ]

  if (argsdesc) {
    replyMessage.push(segment.text(`\n可选参数:\n${argsdesc}`))
  }

  if (argsCmdList) {
    replyMessage.push(segment.text(`\n参数命令:\n${argsCmdList}`))
  }

  if (previewImageBase64) {
    replyMessage.push(segment.text('\n预览图片:\n'))
    replyMessage.push(segment.image(`base64://${previewImageBase64}`))
  } else {
    replyMessage.push(segment.text('\n预览图片:\n'))
    replyMessage.push(segment.text('预览图片加载失败'))
  }

  await e.reply(replyMessage, { reply: true })
  return true
}, {
  name: '清语表情:详情',
  priority: -Infinity,
  event: 'message',
  permission: 'all'
})
