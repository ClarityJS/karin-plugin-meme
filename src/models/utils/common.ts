import { buffer, logger, Message } from 'node-karin'

import { Config } from '@/common'
import Request from '@/models/utils/request'
import { AvatarInfoResponseType, ImageInfoResponseType } from '@/types'

/**
 * 获取基础 URL
 * @returns 基础 URL
 */
export async function get_base_url (): Promise<string> {
  const baseUrl = Config.server.url || 'https://meme.wuliya.cn'
  return Promise.resolve(baseUrl.replace(/\/+$/, ''))
}

/**
 * 获取用户头像
 * @param e 消息事件
 * @param userList 用户列表
 * @param type 返回类型 url 或 buffer
 * @returns 用户头像
 */

export async function get_user_avatar (
  e: Message,
  userId: string,
  type: 'url' | 'buffer' = 'url'
): Promise<AvatarInfoResponseType | null> {
  try {
    if (!e) throw new Error('消息事件不能为空')
    if (!userId) throw new Error('用户ID不能为空')
    const avatarUrl = await e.bot.getAvatarUrl(userId)
    if (!avatarUrl) throw new Error(`获取用户头像失败: ${userId}`)
    switch (type) {
      case 'url':
        return {
          userId,
          avatar: avatarUrl
        }
      case 'buffer':
      {
        const res = await Request.get(avatarUrl, {}, {}, 'arraybuffer')
        return {
          userId,
          avatar: res.data
        }
      }
    }
  } catch (error) {
    logger.error(error)
    return null
  }
}

/**
 * 获取用户昵称
 * @param e 消息事件
 * @param userId 用户 ID
 * @returns 用户昵称
 */
export async function get_user_name (e: Message, userId: string): Promise<string> {
  try {
    let nickname: string | null = null
    let userInfo
    if (e.isGroup) {
      userInfo = await e.bot.getGroupMemberInfo(e.groupId, userId)
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      nickname = userInfo.card?.trim() || userInfo.nick?.trim() || null
    } else if (e.isPrivate) {
      userInfo = await e.bot.getStrangerInfo(userId)
      nickname = userInfo.nick.trim() ?? null
    } else {
      nickname = e.sender.nick.trim() ?? null
    }
    if (!nickname) throw new Error('获取用户昵称失败')
    return nickname
  } catch (error) {
    logger.error(`获取用户昵称失败: ${error}`)
    return '未知'
  }
}

/**
 * 获取图片
 * @param e 消息事件
 * @param type 返回类型 url 或 base64
 * @returns 图片数组信息
 */
export async function get_image (
  e: Message,
  type: 'url' | 'base64' = 'url'
): Promise<ImageInfoResponseType[]> {
  const imagesInMessage = e.elements
    .filter((m) => m.type === 'image')
    .map((img) => ({
      userId: e.sender.userId,
      file: img.file
    }))

  const tasks: Promise<ImageInfoResponseType>[] = []

  let quotedImages: Array<{ userId: string, file: string }> = []
  let source = null
  /**
   * 获取引用消息的内容
   */
  if (Config.meme.quotedImages) {
    let MsgId: string | null | undefined = null

    if (e.replyId) {
      MsgId = (await e.bot.getMsg(e.contact, e.replyId)).messageId
    } else {
      MsgId = e.elements.find((m) => m.type === 'reply')?.messageId
    }

    if (MsgId) {
      source = (await e.bot.getHistoryMsg(e.contact, MsgId, 2))?.[0] ?? null
    }
  }

  /**
   * 提取引用消息中的图片
   */
  if (source) {
    const sourceArray = Array.isArray(source) ? source : [source]

    quotedImages = sourceArray
      .flatMap(item => item.elements)
      .filter(msg => msg.type === 'image')
      .map(img => ({
        userId: sourceArray[0].sender.userId,
        file: img.file
      }))
  }

  /**
   * 如果没有找到引用的图片，但消息是回复类型，则获取回复者的头像作为图片
   */
  if (
    quotedImages.length === 0 &&
    imagesInMessage.length === 0 &&
    source &&
    e.replyId
  ) {
    const sourceArray = Array.isArray(source) ? source : [source]
    const quotedUser = sourceArray[0]?.sender.userId

    if (quotedUser) {
      if (type === 'url') {
        const avatar = await get_user_avatar(e, quotedUser, 'url')
        if (avatar?.avatar) {
          quotedImages.push({
            userId: quotedUser,
            file: avatar.avatar as string
          })
        }
      }
      if (type === 'base64') {
        const avatarBuffer = await get_user_avatar(e, quotedUser, 'buffer')
        if (avatarBuffer?.avatar) {
          const buf = await buffer(avatarBuffer.avatar)
          quotedImages.push({
            userId: quotedUser,
            file: buf.toString('base64')
          })
        }
      }
    }
  }

  /**
   * 处理引用消息中的图片
   */
  if (quotedImages.length > 0) {
    for (const item of quotedImages) {
      if (type === 'url') {
        tasks.push(Promise.resolve({
          userId: item.userId,
          image: item.file.toString()
        }))
      } else {
        const buf = await buffer(item.file)
        tasks.push(Promise.resolve({
          userId: item.userId,
          image: buf.toString('base64')
        }))
      }
    }
  }

  /**
   * 处理消息中的图片
   */
  if (imagesInMessage.length > 0) {
    const imagePromises = imagesInMessage.map(async (item) => {
      if (type === 'url') {
        return {
          userId: item.userId,
          image: item.file.toString()
        }
      } else {
        const buf = await buffer(item.file)
        return {
          userId: item.userId,
          image: buf.toString('base64')
        }
      }
    })
    tasks.push(...imagePromises)
  }

  const results = await Promise.allSettled(tasks)
  const images = results
    .filter((res): res is PromiseFulfilledResult<{ userId: string, image: string }> =>
      res.status === 'fulfilled' && Boolean(res.value))
    .map(res => res.value)

  return images
}
