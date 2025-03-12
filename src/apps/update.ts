import karin, { common, ExecException, getPluginInfo, logger, Message, restart, updateGitPlugin, updatePkg } from 'node-karin'

import { updateRegExp } from '@/apps/meme'
import { Config, Version } from '@/common'
import { Utils } from '@/models'

export const autoUpdateRes = Config.other.autoUpdateRes && karin.task('自动更新表情包数据', Config.other.autoUpdateResCron, async () => {
  await Utils.Tools.generateMemeData()
  await updateRegExp()
  logger.mark(logger.chalk.rgb(255, 165, 0)('✅ 表情包数据更新完成 🎉'))
  return true
}, {
  name: Version.Plugin_AliasName,
  log: true
}
)
export const update = karin.command(/^#?(?:清语表情|clarity-meme)(?:插件)?(?:(强制|预览版))?更新$/i, async (e: Message) => {
  let status: 'ok' | 'failed' | 'error' = 'failed'
  let data: ExecException | string = ''
  const pluginType = getPluginInfo(Version.Plugin_Name)?.type
  if (pluginType === 'npm') {
    if (e.msg.includes('预览版')) {
      const resolve = await updatePkg(Version.Plugin_Name, 'beta')
      data = resolve.data
      status = resolve.status
    } else {
      const resolve = await updatePkg(Version.Plugin_Name, 'latest')
      data = resolve.data
      status = resolve.status
    }
  } else if (pluginType === 'git') {
    let cmd = 'git pull'
    if (e.msg.includes('强制')) {
      cmd = 'git reset --hard HEAD && git pull --rebase'
    }
    const resolve = await updateGitPlugin(Version.Plugin_Path, cmd)
    status = resolve.status
    data = resolve.data
  }
  logger.debug(data)
  await e.bot.sendForwardMsg(e.contact, common.makeForward(JSON.stringify(data).slice(1, -1), e.bot.account.selfId, e.bot.account.name), { news: [{ text: `更新${Version.Plugin_Name}` }], prompt: `更新${Version.Plugin_Name}`, summary: Version.Plugin_Name, source: '更新插件' })
  if (status === 'ok') {
    try {
      await e.reply(`\n更新完成，开始重启 本次运行时间：${common.uptime()}`, { at: true })
      await restart(e.selfId, e.contact, e.messageId)
      return true
    } catch (error) {
      await e.reply(`${Version.Plugin_Name}重启失败，请手动重启以应用更新！`)
    }
  }
  return true
}, {
  name: '清语表情:更新',
  priority: -Infinity,
  event: 'message',
  permission: 'master'
})

export const updateRes = karin.command(/^#?(清语表情|meme(-plugin)?)(强制)?更新(表情包)?(资源|数据)?$/i, async (e: Message) => {
  try {
    if (e.msg.includes('强制')) {
      await Utils.Tools.generateMemeData(true)
    } else {
      await Utils.Tools.generateMemeData()
    }
    await updateRegExp()
    await e.reply('表情包数据更新完成')
    logger.mark(logger.chalk.rgb(255, 165, 0)('✅ 表情包数据更新完成 🎉'))
    return true
  } catch (error) {
    await e.reply(`表情包数据更新失败: ${error instanceof Error ? error.message : '未知错误'}`)
    logger.error(`表情包数据更新出错: ${error instanceof Error ? error.message : '未知错误'}`)
    return false
  }
}, {
  name: '清语表情:更新表情包资源',
  priority: -Infinity,
  event: 'message',
  permission: 'master'
})
