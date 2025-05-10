import karin, { logger, Message } from 'node-karin'

import { server } from '@/models'

export const restart = karin.command(/^#?(?:(?:柠糖)(?:表情|meme))(?:重启|重新启动)(?:表情)?(?:服务端)?$/i, async (e: Message) => {
  try {
    await server.restart()
    await e.reply('表情服务端已重新启动成功')
  } catch (error) {
    logger.error(error)
    await e.reply('启动失败')
  }
})
