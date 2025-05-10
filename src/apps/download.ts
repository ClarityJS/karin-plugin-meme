import karin, { logger, Message } from 'node-karin'

import { server } from '@/models'

export const download = karin.command(/^#?(?:(?:柠糖)(?:表情|meme))(?:下载|更新)表情服务端资源$/i, async (e: Message) => {
  try {
    await e.reply('正在下载/更新表情服务端资源，请稍等...')
    const res = await server.download_server_resource()
    if (!res) {
      await e.reply('表情服务端资源下载失败')
      return
    }
    await e.reply('表情服务端资源下载成功')
  } catch (error) {
    logger.error(error)
    await e.reply('下载表情服务端资源失败, 请前往控制台查看日志')
  }
}, {
  name: '柠糖表情:下载表情服务端资源',
  priority: -Infinity,
  event: 'message',
  permission: 'master'
})
