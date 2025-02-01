import { logger, Message } from 'node-karin'

import { Version } from '@/common'

import Request from './request'

const Common = {
  async getAvatar (e: Message, userList: string[]): Promise<Buffer[]> {
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

}

export default Common
