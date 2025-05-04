import karin, { base64, ImageElement, logger, Message, segment, TextElement } from 'node-karin'

import { utils } from '@/models'

export const info = karin.command(/^#?(?:(?:清语)?表情)详情\s*(.+?)$/i, async (e: Message) => {
  try {
    const [, searchKey] = e.msg.match(info.reg)!
    const memeInfo = await utils.get_meme_info_by_keyword(searchKey) ?? await utils.get_meme_info(searchKey)

    if (!memeInfo) {
      throw new Error('没有找到该表情信息')
    }

    const {
      key: memeKey,
      keyWords: alias,
      min_images,
      max_images,
      min_texts,
      max_texts,
      default_texts: defText,
      tags
    } = memeInfo

    const previewImage = await utils.get_meme_preview(memeKey)
    const aliasArray = typeof alias === 'string' ? JSON.parse(alias) : (Array.isArray(alias) ? alias : [])
    const defTextArray = typeof defText === 'string' ? JSON.parse(defText) : (Array.isArray(defText) ? defText : [])
    const tagsArray = typeof tags === 'string' ? JSON.parse(tags) : (Array.isArray(tags) ? tags : [])

    const replyMessage: (TextElement | ImageElement)[] = [
      segment.text(`名称: ${memeKey}\n`),
      segment.text(`别名: ${aliasArray.join(', ')}\n`),
      segment.text(`图片数量: ${min_images === max_images ? min_images : `${min_images} ~ ${max_images ?? '[未知]'}`}\n`),
      segment.text(`文本数量: ${min_texts === max_texts ? min_texts : `${min_texts} ~ ${max_texts ?? '[未知]'}`}\n`),
      segment.text(`默认文本: ${defTextArray.length > 0 ? defTextArray.join(', ') : '[无]'}\n`),
      segment.text(`标签: ${tagsArray.length > 0 ? tagsArray.join(', ') : '[无]'}`)
    ]
    if (previewImage) {
      replyMessage.push(segment.text('\n预览图片:\n'))
      replyMessage.push(segment.image(`base64://${await base64(previewImage)}`))
    } else {
      replyMessage.push(segment.text('\n预览图片:\n'))
      replyMessage.push(segment.text('预览图获取失败'))
    }

    await e.reply(replyMessage)
  } catch (error) {
    logger.error(error)
    await e.reply((error as Error).message)
  }
}, {
  name: '清语表情:表情详情',
  priority: -Infinity,
  event: 'message',
  permission: 'all'
})
