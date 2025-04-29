import { Message } from 'node-karin'

import { Config } from '@/common'
import Request from '@/models/utils/request'

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
interface AvatarInfo {
  userId: string
  avatar: string | Buffer | null
}

export async function get_avatar (
  e: Message,
  userList: string[],
  type: 'url' | 'buffer' = 'url'
): Promise<AvatarInfo[]> {
  const avatar = userList.map(async userId => {
    const avatarUrl = await e.bot.getAvatarUrl(userId, 140)

    if (type === 'buffer' && avatarUrl) {
      const res = await Request.get(avatarUrl, {}, {}, 'arraybuffer')
      return {
        userId,
        avatar: res.data
      }
    }

    return {
      userId,
      avatar: avatarUrl
    }
  })

  return Promise.all(avatar)
}
