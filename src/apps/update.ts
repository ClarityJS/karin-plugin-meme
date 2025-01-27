import { ExecException } from 'node:child_process'

import karin, { common, isPkg, logger, restart, segment, updateGitPlugin, updatePkg } from 'node-karin'

import { Version } from '@/utils'

export const update = karin.command(/^#?(?:清语表情|clarity-meme)(?:插件)?(?:强制)?更新(?:预览版)?$/i, async (e) => {
  let status: 'ok' | 'failed' | 'error' = 'failed'
  let data: ExecException | string = ''
  if (isPkg) {
    if (e.msg.includes('预览版')) {
      const update = await updatePkg(Version.Plugin_Name, 'beta')
      status = update.status
      data = update.data
    } else {
      const update = await updatePkg(Version.Plugin_Name)
      status = update.status
      data = update.data
    }
  } else {
    let cmd = 'git pull'
    if (e.msg.includes('强制')) cmd = 'git reset --hard && git pull --rebase'
    const update = await updateGitPlugin(Version.Plugin_Path, cmd)
    status = update.status
    data = update.data
  }
  logger.info(data)
  await e.bot.sendForwardMsg(e.contact, common.makeForward([segment.text(`${JSON.stringify(data).replace(/^"|"$/g, '')}`)], e.bot.selfId, e.bot.selfName), { news: [{ text: `更新${Version.Plugin_AliasName}` }], prompt: `更新${Version.Plugin_AliasName}`, summary: '更新插件', source: `${Version.Plugin_AliasName}` })
  if (status === 'ok') {
    try {
      await e.reply(`\n更新完成，开始重启 本次运行时间：${common.uptime()}`)
      await restart(e.bot.selfId, e.contact, e.messageId, true)
      return true
    } catch (error) {
      await e.reply(`${Version.Plugin_AliasName}重启失败，请手动重启以应用更新！`)
    }
  }
  return true
})
