import karin, { ImageElement, logger, Message, segment, TextElement } from 'node-karin'

import { Config, Version } from '@/common'
import { Meme, Utils } from '@/models'

export const random = karin.command(/^#?(?:(清语)?表情|(?:clarity-)?meme)?随机(?:表情|meme)(包)?$/i, async (e:Message) => {
  if (!Config.meme.enable) return false
  try {
    const memeKeys = await Utils.Tools.getAllKeys() ?? null
    if (!memeKeys || memeKeys.length === 0) {
      throw new Error('未找到可用的表情包')
    }

    for (let i = memeKeys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[memeKeys[i], memeKeys[j]] = [memeKeys[j], memeKeys[i]]
    }

    for (const memeKey of memeKeys) {
      const params = await Utils.Tools.getParams(memeKey) ?? null
      if (!params) continue

      const min_texts = params.min_texts ?? 0
      const max_texts = params.max_texts ?? 0
      const min_images = params.min_images ?? 0
      const max_images = params.max_images ?? 0
      const defText = params.default_texts ?? null
      const args_type = params.args_type ?? null
      if (!defText) continue
      if (
        (min_texts === 1 && max_texts === 1) ||
          (min_images === 1 && max_images === 1) ||
          (min_texts === 1 && min_images === 1 && max_texts === 1 && max_images === 1)
      ) {
        try {
          let keyWords = await Utils.Tools.getKeyWords(memeKey) ?? null
          keyWords = keyWords ? keyWords.map(word => `[${word}]`) : ['[无]']

          const result = await Meme.make(
            e,
            memeKey,
            min_texts,
            max_texts,
            min_images,
            max_images,
            defText,
            args_type,
            '',
            false
          )

          let replyMessage: (TextElement | ImageElement)[] = [
            segment.text('本次随机表情信息如下:\n'),
            segment.text(`表情的名称: ${memeKey}\n`),
            segment.text(`表情的别名: ${keyWords}\n`)
          ]
          if (result) {
            replyMessage.push(segment.image(result))
          } else {
            throw new Error('表情生成失败,请重试!')
          }
          await e.reply(replyMessage)
          return true
        } catch (error) {
          throw new Error((error as Error).message)
        }
      }
    }

    throw new Error('未找到有效的表情包')
  } catch (error) {
    logger.error((error as Error).message)
    if (Config.meme?.errorReply) {
      await e.reply(`[${Version.Plugin_AliasName}] 生成随机表情失败, 错误信息: ${(error as Error).message}`)
    }
  }
}, {
  name: '清语表情:随机',
  priority: -Infinity,
  event: 'message',
  permission: 'all'
})
