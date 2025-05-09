import karin, { base64, ImageElement, logger, Message, segment, TextElement } from 'node-karin'

import { Config } from '@/common'
import { utils } from '@/models'
import type { MemeInfoType, MemeOptionType } from '@/types'

export const info = karin.command(/^#?(?:(?:柠糖)?表情)详情\s*(.+)$/i, async (e: Message) => {
  try {
    if (!Config.meme.enable) return false
    const [, searchKey] = e.msg.match(info.reg)!
    const memeInfo = await utils.get_meme_info_by_keyword(searchKey) ?? await utils.get_meme_info(searchKey)

    if (!memeInfo) {
      throw new Error(`没有找到该表情${searchKey}信息`)
    }

    const {
      key: memeKey,
      keyWords: alias,
      min_images,
      max_images,
      min_texts,
      max_texts,
      default_texts: defText,
      options,
      tags
    } = memeInfo
    const presetList = await utils.get_preset_all_about_keywords_by_key(memeKey)
    const aliasArray = typeof alias === 'string' ? JSON.parse(alias) : (Array.isArray(alias) ? alias : [])
    const defTextArray = typeof defText === 'string' ? JSON.parse(defText) : (Array.isArray(defText) ? defText : [])
    const tagsArray = typeof tags === 'string' ? (JSON.parse(tags)).map((tag: MemeInfoType['tags']) => `[${tag}]`) : (Array.isArray(tags) ? tags : [])
    const optionsArray = typeof options === 'string' ? JSON.parse(options) : (Array.isArray(options) ? options : [])
    const optionArray = optionsArray.length > 0 ? optionsArray.map((opt: MemeOptionType) => `[${opt.name}: ${opt.description}]`).join('') : null
    const optionCmdArray = Array.isArray(presetList) ? presetList.map(cmd => `[${cmd}]`).join(' ') : null

    const replyMessage: (TextElement | ImageElement)[] = [
      segment.text(`名称: ${memeKey}\n`),
      segment.text(`别名: ${aliasArray.map((alias: MemeInfoType['keywords']) => `[${alias}]`).join(' ')}\n`),
      segment.text(`图片数量: ${min_images === max_images ? min_images : `${min_images} ~ ${max_images ?? '[未知]'}`}\n`),
      segment.text(`文本数量: ${min_texts === max_texts ? min_texts : `${min_texts} ~ ${max_texts ?? '[未知]'}`}\n`),
      segment.text(`默认文本: ${defTextArray.length > 0 ? defTextArray.join('') : '[无]'}\n`),
      segment.text(`标签: ${tagsArray.length > 0 ? tagsArray.join('') : '[无]'}`)
    ]
    if (optionCmdArray) {
      replyMessage.push(segment.text(`\n可选预设:\n${optionCmdArray}`))
    }
    if (optionArray) {
      replyMessage.push(segment.text(`\n可选选项:\n${optionArray}`))
    }

    try {
      const previewImage = await utils.get_meme_preview(memeKey)
      if (previewImage) {
        replyMessage.push(segment.text('\n预览图片:\n'))
        replyMessage.push(segment.image(`base64://${await base64(previewImage)}`))
      }
    } catch (error) {
      replyMessage.push(segment.text('\n预览图片:\n'))
      replyMessage.push(segment.text('预览图获取失败'))
    }

    await e.reply(replyMessage, { reply: true })
  } catch (error) {
    logger.error(error)
    await e.reply((error as Error).message, { reply: true })
  }
}, {
  name: '柠糖表情:表情详情',
  priority: -Infinity,
  event: 'message',
  permission: 'all'
})
