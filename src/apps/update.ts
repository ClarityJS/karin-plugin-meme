import karin, { common, exec, getCommit, getHash, getPkgVersion, getRemotePkgVersion, getTime, isPkg, Message, restart, segment, TextElement } from 'node-karin'

import { Version } from '@/common'

export const update = karin.command(/^#?(?:清语表情|clarity-meme)(?:插件)?(?:(强制|预览版))?更新$/i, async (e: Message) => {
  let msg: TextElement[] | TextElement = []
  let commit: string = ''
  let cmd: string = ''
  let localVersion: string
  let remoteVersion: string

  try {
    await e.reply('正在执行更新中...')

    if (isPkg) {
      localVersion = await getPkgVersion(Version.Plugin_Name)
      if (e.msg.includes('预览版')) {
        remoteVersion = await getRemotePkgVersion(Version.Plugin_Name, 'beta')
        cmd = `pnpm up ${Version.Plugin_Name}@beta`
      } else {
        remoteVersion = await getRemotePkgVersion(Version.Plugin_Name, 'latest')
        cmd = `pnpm up ${Version.Plugin_Name}`
      }
    } else {
      const branch = (await exec('git rev-parse --abbrev-ref HEAD')).stdout.trim()
      localVersion = await getHash(Version.Plugin_Path, true)
      remoteVersion = (await exec(`git rev-parse --short origin/${branch}`)).stdout.trim()

      if (localVersion === remoteVersion) {
        const time = await getTime(Version.Plugin_Path)
        msg = segment.text(`${Version.Plugin_Name} 已经是最新版本\n最后更新时间: ${time}`)
      } else {
        if (e.msg.includes('强制')) {
          cmd = `git reset --hard origin/${branch} && git pull --rebase`
        } else {
          cmd = 'git pull'
        }
        commit = await getCommit({ path: Version.Plugin_Path, count: 1, hash: localVersion, branch })
      }
    }

    if (cmd) {
      const updateResult = await exec(cmd)
      if (updateResult.stderr) {
        msg = [
          segment.text(`${Version.Plugin_Name} 更新失败: ${updateResult.stderr}`)
        ]
      } else {
        msg = [
          segment.text(`${Version.Plugin_Name} 更新成功`),
          segment.text(`更新日志: ${commit}`)
        ]
      }
    }

    await e.bot.sendForwardMsg(e.contact, common.makeForward(msg, e.bot.selfId, e.bot.selfName), { news: [{ text: `更新${Version.Plugin_Name}` }], prompt: `更新${Version.Plugin_Name}`, summary: '更新插件', source: `${Version.Plugin_Name}` })

    try {
      await e.reply(`\n更新完成，开始重启 本次运行时间：${common.uptime()}`)
      await restart(e.bot.selfId, e.contact, e.messageId)
    } catch (error) {
      await e.reply(`${Version.Plugin_Name}重启失败，请手动重启以应用更新！`)
      return true
    }
    return true
  } catch (error) {
    await e.reply(`${Version.Plugin_Name} 更新失败: ${error instanceof Error ? error.message : '未知错误'}`)
    return true
  }
})
