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
  if (allUsers.length > 0) {
    const avatarBuffers = await utils.get_user_avatar(e, allUsers[0], 'url')

    if (avatarBuffers) {
      const image = await utils.upload_image(avatarBuffers.avatar, 'url')
      userAvatars.push({
        name: await utils.get_user_name(e, avatarBuffers.userId),
        id: image
      })
      images.push(userAvatars)
    }
  }

  if (userAvatars.length + messageImages.length < min_images) {
    const triggerAvatar = await utils.get_user_avatar(e, e.userId, 'url')
    if (triggerAvatar) {
      const image = await utils.upload_image(triggerAvatar.avatar, 'url')
      userAvatars.unshift({
        name: await utils.get_user_name(e, triggerAvatar.userId),
        id: image
      })
    }
    images.push(userAvatars)
  }

  images = images.flat()
  formdata['images'] = images
  return {
    success: true,
    text: userText
  }
}
