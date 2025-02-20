import { buffer, logger, Message } from 'node-karin'

import { Config } from '@/common'

import Request from './request'

/**
 * 获取用户的头像 Buffer 列表
 * @param {Message} e - 消息对象
 * @param {string[]} userList - 需要获取头像的用户 ID 列表
 * @returns {Promise<Buffer[]>} - 返回头像的 Buffer 数组
 */
export async function getAvatar (e: Message, userList: string[]): Promise<Buffer[]> {
  const avatarPromises = userList.map(async (userId) => {
    try {
      const avatarUrl = await e.bot.getAvatarUrl(userId, 0)
      if (avatarUrl) {
        const response = await Request.get<Buffer>(avatarUrl, {}, {}, 'arraybuffer')
        if (response.success) {
          return Buffer.from(response.data)
        }
      }
    } catch (error) {
      logger.debug(`获取用户 ${userId} 头像失败:`, error)
    }
    return null
  })

  const avatarsList = await Promise.all(avatarPromises)

  return avatarsList.filter((buffer): buffer is Buffer => buffer !== null)
}

/**
 * 获取消息中的图片（包括直接发送的图片和引用消息中的图片）
 * @param {Message} e - 消息对象
 * @returns {Promise<Buffer[]>} - 返回图片的 Buffer 数组
 */
export async function getImage (e: Message): Promise<Buffer[]> {
  const imagesInMessage = e.elements
    .filter((m) => m.type === 'image')
    .map((img) => img.file)

  const tasks: Promise<Buffer>[] = []

  let quotedImages: (string | Buffer)[] = []
  let source = null

  /**
   * 获取引用消息的内容
   */
  if (Config.meme.quotedImages) {
    let MsgId: string | undefined

    if (e.replyId) {
      MsgId = (await e.bot.getMsg(e.contact, e.replyId)).messageId
    } else {
      MsgId = e.elements.find((m) => m.type === 'reply')?.messageId
    }

    if (MsgId) {
      source = (await e.bot.getHistoryMsg(e.contact, MsgId, 2))?.shift() ?? null
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
      .map(img => img.file)
  }

  /**
   * 如果没有找到引用的图片，但消息是回复类型，则获取回复者的头像作为图片
   */
  if (
    quotedImages.length === 0 &&
    imagesInMessage.length === 0 &&
    source &&
    e.elements.some(msg => msg.type === 'reply')
  ) {
    const sourceArray = Array.isArray(source) ? source : [source]
    const quotedUser = sourceArray[0]?.sender.userId

    if (quotedUser) {
      const avatarBuffer = await getAvatar(e, [quotedUser])
      if (avatarBuffer[0]) {
        quotedImages.push(avatarBuffer[0])
      }
    }
  }

  /**
   * 处理引用消息中的图片
   */
  if (quotedImages.length > 0) {
    quotedImages.forEach((item) => {
      if (Buffer.isBuffer(item)) {
        tasks.push(Promise.resolve(item))
      } else {
        tasks.push(Promise.resolve(buffer(item)))
      }
    })
  }

  /**
   * 处理消息中的图片
   */
  if (imagesInMessage.length > 0) {
    tasks.push(...imagesInMessage.map(async (imageUrl) => await buffer(imageUrl)))
  }

  /**
   * 执行所有任务，过滤出成功获取的图片
   */
  const results = await Promise.allSettled(tasks)
  const images = results
    .filter((res) => res.status === 'fulfilled' && res.value)
    .map((res) => (res as PromiseFulfilledResult<Buffer>).value)

  return images
}
