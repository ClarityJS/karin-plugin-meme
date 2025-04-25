import { Message } from 'node-karin'

import { Utils } from '@/models'
/** 文本表情处理 */
export async function handleImages (e: Message, min_images: number, max_images: number, allUsers: string[], userText: string, formData: FormData) {
  const messageImages: Buffer[] = await Utils.Common.getImage(e)
  let userAvatars: Buffer[] = []
  if (allUsers.length > 0) {
    const avatarBuffers = await Utils.Common.getAvatar(e, allUsers)
    avatarBuffers.filter(Boolean).forEach((buffer) => {
      userAvatars.push(buffer)
    })
  }

  if (userAvatars.length + messageImages.length < min_images) {
    const triggerAvatar = await Utils.Common.getAvatar(e, [e.userId])
    if (triggerAvatar[0]) {
      userAvatars.unshift(triggerAvatar[0])
    }
  }
  const finalImages = [...userAvatars, ...messageImages].slice(0, max_images)
  finalImages.forEach((buffer, index) => {
    const blob = new Blob([buffer], { type: 'image/png' })
    formData.append('images', blob, `image${index}.png`)
  })

  return finalImages.length < min_images
    ? {
        success: false,
        userText,
        message: `该表情需要 ${min_images} ~ ${max_images}张图片`
      }
    : {
        success: true,
        userText
      }
}
