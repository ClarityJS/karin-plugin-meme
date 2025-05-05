import { base64, logger, Message } from 'node-karin'

import { utils } from '@/models'
import { handleImages } from '@/models/make/images'
import { handleTexts } from '@/models/make/texts'
import { MemeOptionType } from '@/types'

export async function make_meme (
  e: Message,
  memekey: string,
  min_texts: number,
  max_texts: number,
  min_images:number,
  max_images: number,
  options: MemeOptionType[] | null,
  userText: string
) {
  try {
    const getquotedUser = async (e: Message): Promise<string | null> => {
      let source = null
      let MsgId: string | null = null

      if (e.replyId) {
        MsgId = (await e.bot.getMsg(e.contact, e.replyId)).messageId ?? null
      } else {
        MsgId = e.elements.find((m) => m.type === 'reply')?.messageId ?? null
      }
      if (MsgId) {
        source = (await e.bot.getHistoryMsg(e.contact, MsgId, 2))?.[0] ?? null
      }
      if (source) {
        const sourceArray = Array.isArray(source) ? source : [source]
        return sourceArray[0].sender.userId.toString()
      }
      return null
    }

    const quotedUser = await getquotedUser(e)
    const allUsers = [
      ...new Set([
        ...e.elements
          .filter(m => m?.type === 'at')
          .map(at => at?.targetId?.toString() ?? ''),
        ...[...(userText?.matchAll(/@\s*(\d+)/g) ?? [])].map(match => match[1] ?? '')
      ])
    ].filter(targetId => targetId && targetId !== quotedUser)
    let formdata: Record<string, unknown> = {
      images: [],
      texts: [],
      options: {}
    }

    if (max_texts > 0) {
      const text = await handleTexts(e, memekey, min_texts, max_texts, userText, allUsers, formdata)
      if (!text.success) {
        throw new Error(text.message)
      }
    }

    if (max_images > 0) {
      const image = await handleImages(e, min_images, max_images, allUsers, userText, formdata)
      if (!image.success) {
        throw new Error(image.message)
      }
    }
    const response = await utils.make_meme(memekey, formdata)
    const basedata = await base64(response)
    return `base64://${basedata}`
  } catch (error) {
    logger.error(error)
    throw new Error((error as Error).message)
  }
}
