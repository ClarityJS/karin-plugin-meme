import karin, { Message } from 'node-karin'

import { Config, Render } from '@/common'
import { AdminTypeConfig } from '@/models/admin'
import { Version } from '@/root'
import type { ConfigType } from '@/types'

function checkNumberValue (value: number, limit: string): number {
  const [min, max] = limit.split('-').map(Number)
  return Math.min(Math.max(value, min), max)
}

const createUnifiedRegExp = (): RegExp => {
  const groupNames = Object.values(AdminTypeConfig)
    .map(group => group.title)
    .join('|')

  const itemNames = Object.values(AdminTypeConfig)
    .flatMap((group: { cfg: Record<string, { title: string }> }) => Object.values(group.cfg).map((item: { title: string }) => item.title))
    .join('|')

  return new RegExp(`^#柠糖表情设置\\s*(${groupNames})?\\s*(${itemNames})?\\s*(.*)`)
}

async function renderAndReply (e: Message) {
  const schema = AdminTypeConfig
  const cfg = Config.All()
  const img = await Render.render('admin/index', {
    title: Version.Plugin_AliasName,
    schema,
    cfg
  })
  await e.reply(img)
}

export const admin = karin.command(createUnifiedRegExp(), async (e: Message) => {
  const regRet = createUnifiedRegExp().exec(e.msg)
  if (!regRet) return false

  const groupTitle = regRet[1]
  const keyTitle = regRet[2]
  const value = regRet[3].trim()

  const groupEntry = Object.entries(AdminTypeConfig).find(
    ([, group]) => group.title === groupTitle
  )

  const cfgEntry = groupEntry
    ? Object.entries(groupEntry[1].cfg).find(([_, item]) => item.title === keyTitle)
    : null

  if (!groupEntry || !cfgEntry) {
    await renderAndReply(e)
    return true
  }

  const [groupName] = groupEntry
  const [cfgKey, cfgItem] = cfgEntry

  switch (cfgItem.type) {
    case 'boolean': {
      const isOn = value === '开启'
      Config.Modify(groupName as keyof ConfigType, cfgKey, isOn)
      break
    }
    case 'number': {
      const number = checkNumberValue(Number(value), cfgItem.limit ?? '0-0')
      Config.Modify(groupName as keyof ConfigType, cfgKey, number)
      break
    }
    case 'string': {
      Config.Modify(groupName as keyof ConfigType, cfgKey, value)
      break
    }
    case 'array': {
      let list = (Config[groupName as keyof ConfigType] as unknown as Record<string, string[]>)[cfgKey] ?? []
      if (/^添加/.test(value)) {
        const itemToAdd = value.replace(/^添加/, '').trim()
        if (!list.includes(itemToAdd)) {
          list.push(itemToAdd)
        }
      } else if (/^删除/.test(value)) {
        const itemToRemove = value.replace(/^删除/, '').trim()
        list = list.filter((item: string) => item !== itemToRemove)
      } else {
        list = value.split(',').map(v => v.trim())
      }
      Config.Modify(groupName as keyof ConfigType, cfgKey, list)
      break
    }
  }

  await renderAndReply(e)
  return true
},
{
  name: '柠糖表情:设置',
  priority: -Infinity,
  event: 'message',
  permission: 'master'
})
