import
karin,
{
  common,
  ExecException,
  getPluginInfo,
  logger,
  Message,
  restart,
  updateGitPlugin,
  updatePkg
} from 'node-karin'

import { updateRegExp } from '@/apps/meme'
import { Config } from '@/common'
import { utils } from '@/models'
import { Version } from '@/root'

async function updateNpmPackage (version: string, pluginName: string) {
  const resolve = await updatePkg(pluginName, version)
  return {
    data: resolve.data,
    status: resolve.status
  }
}

async function updateGitRepository (force: boolean, pluginPath: string) {
  const cmd = force
    ? 'git reset --hard HEAD && git pull --rebase'
    : 'git pull'
  const resolve = await updateGitPlugin(pluginPath, cmd)
  return {
    data: resolve.data,
    status: resolve.status
  }
}

export const update = karin.command(/^#?(?:(?:清语)?表情)(?:插件)?(?:(强制|预览版))?更新$/i, async (e: Message) => {
  let status: 'ok' | 'failed' | 'error' = 'failed'
  let data: ExecException | string = ''
  const pluginType = getPluginInfo(Version.Plugin_Name)?.type

  if (pluginType === 'npm') {
    const version = e.msg.includes('预览版') ? 'beta' : 'latest'
    const result = await updateNpmPackage(version, Version.Plugin_Name)
    data = result.data
    status = result.status
  } else if (pluginType === 'git') {
    const force = e.msg.includes('强制')
    const result = await updateGitRepository(force, Version.Plugin_Path)
    status = result.status
    data = result.data
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

export const updateRes = karin.command(/^#?(?:(?:清语)?表情)更新(表情包)?(资源|数据)?$/i, async (e: Message) => {
  try {
    await e.reply('正在更新表情包数据...')
    await utils.update_meme(true)
    await utils.update_preset(true)
    await updateRegExp()
    await e.reply('表情包数据更新完成')
    logger.mark(logger.chalk.rgb(255, 165, 0)('✅ 表情包数据更新完成 🎉'))
    return true
  } catch (error) {
    await e.reply(`表情包数据更新失败: ${(error as Error).message}`)
    logger.error(`表情包数据更新出错: ${(error as Error).message}`)
    return false
  }
}, {
  name: '清语表情:更新表情包资源',
  priority: -Infinity,
  event: 'message',
  permission: 'master'
})

export const autoUpdateRes = Config.other.autoUpdateRes && karin.task(`[${Version.Plugin_AliasName}]:自动更新表情资源`, Config.other.autoUpdateResCron, async () => {
  try {
    await utils.update_meme(true)
    await utils.update_preset(true)
  } catch (error) {
    logger.error(`自动更新表情包资源出错: ${(error as Error).message}`)
  }
}, {
  name: '清语表情:自动更新表情包资源',
  log: true
})
