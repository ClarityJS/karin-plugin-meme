import { buffer, logger, Message } from 'node-karin'

import { Config } from '@/common'
import { db } from '@/models'
import Request from '@/models/utils/request'

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
 * 获取 QQ 用户的昵称。
 *
 * @param e - 消息对象，包含当前对话信息。
 * @param qq - 需要查询昵称的 QQ 号。
 * @returns 返回用户昵称
 *
 */
export async function getNickname (e: Message, qq: string): Promise<string> {
  if (!qq || !e) return '未知'
  try {
    if (e.isGroup) {
      const MemberInfo = await e.bot.getGroupMemberInfo(e.groupId, qq, true)
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      return (MemberInfo?.card || MemberInfo?.nick) || '未知'
    } else if (e.isPrivate) {
      const FriendInfo = await e.bot.getStrangerInfo(qq)
      return FriendInfo?.nick || '未知'
    }
  } catch {
    return '未知'
  }
  return '未知'
}

export async function getGender (e: Message, qq: string): Promise<string> {
  if (!qq || !e) return 'unknown'

  try {
    if (e.isGroup) {
      const MemberInfo = await e.bot.getGroupMemberInfo(e.groupId, qq, true)
      return MemberInfo.sex ?? 'unknown'
    } else if (e.isPrivate) {
      const FriendInfo = await e.bot.getStrangerInfo(qq)
      return FriendInfo?.sex ?? '未知'
    }
  } catch {
    return 'unknown'
  }
  return 'unknown'
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
      .map(img => img.file)
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
/**
 * 添加或更新统计信息。
 *
 * @param key - 统计项的唯一标识符
 * @param number - 需要添加或更新的数值
 * @returns 返回创建或更新的记录，如果失败则返回 `null`
 */
export async function addStat (key: string, number: number): Promise<object | null> {
  return await db.stat.add(key, number) || null
}

/**
 * 获取指定统计信息的 `all` 值。
 *
 * @param key - 统计项的唯一标识符
 * @returns 返回 `all` 字段的值，如果记录不存在则返回 `null`
 */
export async function getStat (key: string): Promise<any | null> {
  return await db.stat.get(key, 'all') ?? null
}

/**
 * 获取所有统计信息。
 *
 * @returns 返回所有统计记录的数组，如果查询失败则返回 `null`
 */
export async function getStatAll (): Promise<object[] | null> {
  return await db.stat.getAll() || null
}
