import { logger, Message } from 'node-karin'

import { Config } from '@/common'
import Request from '@/models/utils/request'
import { AvatarInfoResponseType } from '@/types'

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
  userList: string[],
  type: 'url' | 'buffer' = 'url'
): Promise<AvatarInfoResponseType[] | null> {
  try {
    if (!e) throw new Error('消息事件不能为空')
    if (!userList.length) throw new Error('用户列表不能为空')
    const avatar = userList.map(async userId => {
      const avatarUrl = await e.bot.getAvatarUrl(userId, 140)
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
    })
    if (!avatar) throw new Error('获取用户头像失败')
    return Promise.all(avatar)
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
    if (e.isGroup) {
      const userInfo = await e.bot.getGroupMemberInfo(e.groupId, userId)
      nickname = userInfo.card?.trim() ?? userInfo.nick?.trim() ?? null
    } else if (e.isPrivate) {
      const userInfo = await e.bot.getStrangerInfo(userId)
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
