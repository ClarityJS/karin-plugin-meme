import karin, { Message } from 'node-karin'

import { Render } from '@/common'
import { server } from '@/models'
import { Version } from '@/root'

export const status = karin.command(/^#?(?:(?:柠糖)?(?:表情|meme))?(?:服务端)(?:状态)?$/i, async (e: Message) => {
  const img = await Render.render('server/status', {
    version: Version.Plugin_Version,
    serverVersion: await server.get_meme_server_version() ?? '未知',
    status: await server.get_meme_server_version() ? '运行中' : '未运行',
    runtime: await server.get_meme_server_runtime(),
    memory: await server.get_meme_server_memory() ?? `${await server.get_meme_server_memory()} MB` ?? '未知',
    total: await server.get_meme_server_meme_total()
  })
  await e.reply(img)
}, {
  name: '柠糖表情:表情服务端状态',
  priority: -Infinity,
  event: 'message',
  permission: 'master'
})
