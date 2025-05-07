import { config, Message } from 'node-karin'

import { Config } from '@/common'
import { utils } from '@/models'

export async function handleImages (
  e: Message,
  memeKey: string,
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
  const messageImages = await utils.get_image(e, 'url')
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
      let image
      if (Config.meme.enable) {
        image = await utils.upload_image(avatarBuffers.avatar, 'path')
      } else {
        image = await utils.upload_image(avatarBuffers.avatar, 'url')
      }
      userAvatars.push({
        name: await utils.get_user_name(e, avatarBuffers.userId),
        id: image
      })
    }
  }

  /**
   * 特殊处理：当 min_images === 1 时，因没有多余的图片，表情保护功能会失效
   */
  if (min_images === 1 && messageImages.length === 0) {
    const triggerAvatar = await utils.get_user_avatar(e, e.userId, 'url')
    if (triggerAvatar) {
      let image
      if (Config.meme.cache) {
        image = await utils.upload_image(triggerAvatar.avatar, 'path')
      } else {
        image = await utils.upload_image(triggerAvatar.avatar, 'url')
      }
      userAvatars.push({
        name: await utils.get_user_name(e, triggerAvatar.userId),
        id: image
      })
    }
  }

  if (images.length + userAvatars.length < min_images) {
    const triggerAvatar = await utils.get_user_avatar(e, e.userId, 'url')
    if (triggerAvatar) {
      let image
      if (Config.meme.enable) {
        image = await utils.upload_image(triggerAvatar.avatar, 'path')
      } else {
        image = await utils.upload_image(triggerAvatar.avatar, 'url')
      }
      userAvatars.unshift({
        name: await utils.get_user_name(e, triggerAvatar.userId),
        id: image
      })
    }
  }

  /** 表情保护逻辑 */
  if (Config.protect.enable) {
    const protectList = Config.protect.list
    if (protectList.length > 0) {
      /** 处理表情保护列表可能含有关键词 */
      const memeKeys = await Promise.all(protectList.map(async item => {
        const key = await utils.get_meme_key_by_keyword(item)
        return key ?? item
      }))
      if (memeKeys.includes(memeKey)) {
        const avatarUserIds = messageImages
          .filter(img => img.isAvatar)
          .map(img => img.userId)
        const allProtectedUsers = [...allUsers, ...avatarUserIds]

        if (allProtectedUsers.length > 0) {
          const masterQQArray = config.master()
          /** 优先检查补充头像的用户 */
          const protectUser = avatarUserIds.length > 0
            ? avatarUserIds[0]
            : allProtectedUsers.length === 1
              ? allProtectedUsers[0]
              : allProtectedUsers[1]

          if (Config.protect.master) {
            if (!e.isMaster && masterQQArray.includes(protectUser)) {
              userAvatars.reverse()
            }
          } else if (Config.protect.userEnable) {
            const protectUsers = Array.isArray(Config.protect.user)
              ? Config.protect.user.map(String)
              : [String(Config.protect.user)]
            if (protectUsers.includes(protectUser)) {
              userAvatars.reverse()
            }
          }
        }
      }
    }
  }

  images = [...userAvatars, ...images].slice(0, max_images)
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
