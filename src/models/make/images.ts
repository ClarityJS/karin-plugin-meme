import { Message } from 'node-karin'

import { utils } from '@/models'

export async function handleImages (
  e: Message,
  min_images: number,
  max_images: number,
  allUsers: string[],
  userText: string,
  formdata: Record<string, unknown>
): Promise<
| { success: true, text: string }
| { success: false, message: string }
> {
  let images = []
  const messageImages = await utils.get_image(e)
  let userAvatars = []

  const imagePromises = messageImages.map(async (msgImage) => {
    const [image, name] = await Promise.all([
      utils.upload_image(msgImage.image, 'url'),
      utils.get_user_name(e, msgImage.userId)
    ])
    return {
      name,
      id: image
    }
  })
  images = await Promise.all(imagePromises)

  if (allUsers.length > 0) {
    const avatarBuffers = await utils.get_user_avatar(e, allUsers[0], 'url')
    if (avatarBuffers) {
      const image = await utils.upload_image(avatarBuffers.avatar, 'url')
      userAvatars.push({
        name: await utils.get_user_name(e, avatarBuffers.userId),
        id: image
      })
    }
  }

  if (images.length + userAvatars.length < min_images) {
    const triggerAvatar = await utils.get_user_avatar(e, e.userId, 'url')
    if (triggerAvatar) {
      const image = await utils.upload_image(triggerAvatar.avatar, 'url')
      userAvatars.unshift({
        name: await utils.get_user_name(e, triggerAvatar.userId),
        id: image
      })
    }
  }

  images = [...images, ...userAvatars]
  formdata['images'] = images

  return images.length < min_images
    ? {
        success: false,
        message: min_images === max_images
          ? `该表情需要${min_images}张图片`
          : `该表情需要 ${min_images} ~ ${max_images}张图片`
      }
    : {
        success: true,
        text: userText
      }
}
