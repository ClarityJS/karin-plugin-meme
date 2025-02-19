import karin, { Message } from 'node-karin'
import lodash from 'node-karin/lodash'

import { Render, Version } from '@/common'
import { Help } from '@/models'
import { BaseType } from '@/types'

type HelpType = BaseType['help']
export const help = karin.command(/^#?(?:(清语)?表情|(?:clarity-)?meme)(?:命令|帮助|菜单|help|说明|功能|指令|使用说明)$/i, async (e: Message) => {
  const helpGroup: HelpType['helpList'] = []

  lodash.forEach(Help.List.helpList, (group) => {
    if (group.auth && group.auth === 'master' && !e.isMaster) {
      return true
    }
    lodash.forEach(group.list, (help) => {
      let icon = help.icon * 1
      if (!icon) {
        help.css = 'display:none'
      } else {
        let x = (icon - 1) % 10
        let y = (icon - x - 1) / 10
        help.css = `background-position:-${x * 50}px -${y * 50}px`
      }
    })

    helpGroup.push(group)
  })
  const themeData = Help.Theme.getThemeData(Help.Cfg.helpCfg)
  const img = await Render.render(
    'help/index',
    {
      helpCfg: Help.Cfg.helpCfg,
      helpGroup,
      ...themeData
    }
  )
  await e.reply(img)
  return true
}, {
  name: '清语表情:帮助',
  priority: -Infinity,
  event: 'message'
})

export const version = karin.command(/^#?(?:(清语)?表情|(?:clarity-)?meme)(?:版本|版本信息|version|versioninfo)$/i, async (e: Message) => {
  const img = await Render.render(
    'help/version-info',
    {
      currentVersion: Version.Plugin_Version,
      changelogs: Version.Plugin_Logs
    }
  )
  await e.reply(img)
  return true
}, {
  name: '清语表情:版本',
  priority: -Infinity,
  event: 'message'
})
