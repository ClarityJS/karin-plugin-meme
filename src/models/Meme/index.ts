import FormData from 'form-data'
import { base64, Message, segment } from 'node-karin'

import { Utils } from '@/models'

import { handleTexts } from './texts'

const Meme = {
  async make (e: Message, memekey:string, userText: string) {
    const formData = new FormData()
    const texts = handleTexts(e, userText, formData)
    const data = await Utils.Tools.request(memekey, formData, 'POST', 'arraybuffer')
    const basedata = await base64(data.data)
    return e.reply(segment.image(`base64://${basedata}`))
  }
}

export { Meme }
