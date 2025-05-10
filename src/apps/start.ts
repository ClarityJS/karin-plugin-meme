import karin, { logger, Message } from 'node-karin'

import { server, utils } from '@/models'

export const start = karin.command(/^#?(?:(?:柠糖)?(?:表情|meme))(?:开启|启动)(?:表情)?(?:服务端)?$/i, async (e: Message) => {
  try {
    await server.start()
    await e.reply('表情服务端已启动成功\n地址:' + await utils.get_base_url())
  } catch (error) {
    logger.error(error)
    await e.reply('启动失败')
  }
}, {
  name: '柠糖表情:启动表情服务端',
  priority: -Infinity,
  event: 'message',
  permission: 'master'
})
