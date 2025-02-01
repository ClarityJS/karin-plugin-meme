import FormData from 'form-data'
import { base64, Message, segment } from 'node-karin'

import { Utils } from '@/models'
import { BaseType } from '@/types'

import { handleImages } from './images'
import { handleTexts } from './texts'
type ArgsType = BaseType['utils']['meme']['params_type']['args_type']

const Meme = {
  async make (e: Message, memekey:string, userText: string, min_texts: number, max_texts: number, min_images:number, max_images: number, default_texts:string[], args_type: ArgsType) {
    const formData = new FormData()

    const atsInMessage = e.elements
      .filter((m) => m.type === 'at')
      .map((at) => at.targetId)

    const manualAts = [...userText.matchAll(/@\s*(\d+)/g)].map((match) => match[1])
    const allUsers = [...new Set([...atsInMessage, ...manualAts])]
    userText = userText.replace(/@\s*\d+/g, '').trim()
    /** 处理图片表情 */
    if (max_images !== 0) {
      await handleImages(e, userText, formData, min_images, allUsers)
    }
    /** 处理文字表情 */
    if (max_texts !== 0) {
      handleTexts(e, userText, formData)
    }
    const response = await Utils.Tools.request(memekey, formData, 'arraybuffer')
    if (response.success) {
      const basedata = await base64(response.data)
      return e.reply(segment.image(`base64://${basedata}`))
    } else if (!response.success) {
      return e.reply(response.message as string)
    }
  }
}

export { Meme }
