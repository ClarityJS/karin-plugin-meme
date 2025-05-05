import { Message } from 'node-karin'

import { Config } from '@/common'
import { utils } from '@/models'

export async function handleTexts (
  e: Message,
  memekey: string,
  min_texts: number,
  max_texts: number,
  userText:string,
  allUsers: string[],
  formdata: Record<string, unknown>
): Promise<
  | { success: true, texts: string }
  | { success: false, message: string }
> {
  const texts: string[] = []

  /** 用户输入的文本 */
  if (userText) {
    const splitTexts = userText.split('/').map((text) => text.trim())
    for (const text of splitTexts) {
      if (text) {
        texts.push(text)
      }
    }
  }

  if (texts.length === 0 && Config.meme.userName) {
    if (allUsers.length >= 1) {
      const User = allUsers[0]
      const Nickname = await utils.get_user_name(e, User)
      texts.push(Nickname)
    } else {
      const Nickname = await utils.get_user_name(e, e.userId)
      texts.push(Nickname)
    }
  }
  const memeInfo = await utils.get_meme_info(memekey)
  const default_texts = memeInfo?.default_texts ?? null
  if (
    texts.length < min_texts &&
    default_texts
  ) {
    while (texts.length < min_texts) {
      const randomIndex = Math.floor(Math.random() * default_texts.length)
      texts.push(default_texts[randomIndex])
    }
  }

  formdata['texts'] = texts

  return texts.length < min_texts
    ? {
        success: false,
        message: min_texts === max_texts
          ? `该表情需要${min_texts}个文本`
          : `该表情需要 ${min_texts} ~ ${max_texts}个文本`
      }
    : {
        success: true,
        texts: userText
      }
}
