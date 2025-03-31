import _ from 'lodash'
import { Message } from 'node-karin'

import { Utils } from '@/models'
import type { PresetType } from '@/types'

async function handleArgs (e: Message, memeKey: string, userText: string, allUsers: string[], formData: FormData, isPreset: boolean, Preset?: PresetType) {
  const argsMatches = userText.match(/#(\S+)\s+([^#]+)/g)
  const argsArray: { [key: string]: string } = {}

  if (argsMatches) {
    for (const match of argsMatches) {
      const matchResult = match.match(/#(\S+)\s+([^#]+)/)
      if (matchResult) {
        const [_, key, value] = matchResult
        argsArray[key] = value.trim()
      }
    }
  }
  if (isPreset && Preset?.arg_name) {
    argsArray[Preset.arg_name] = Preset.arg_value
  }

  const argsResult = await handle(e, memeKey, allUsers, argsArray)

  if (!argsResult.success) {
    return {
      success: argsResult.success,
      message: argsResult.message
    }
  }
  if (argsResult.argsString) {
    formData.append('args', argsResult.argsString)
  }

  return {
    success: true,
    text: userText.replace(/#(\S+)\s+([^#]+)/g, '').trim()
  }
}

async function handle (e: Message, key: string, allUsers: string[], args: { [s: string]: unknown } | ArrayLike<unknown>) {
  if (!args) {
    args = {}
  }

  const argsObj: { [key: string]: any } = {}
  const paramInfos = await Utils.Tools.getParamInfo(key)

  if (!paramInfos || paramInfos.length === 0) {
    return {
      success: false,
      message: '未找到任何参数信息'
    }
  }

  const paramMap = paramInfos.reduce((acc: { [key: string]: boolean }, { name }) => {
    acc[name] = true
    return acc
  }, {})

  for (const [argName, argValue] of Object.entries(args)) {
    if (!paramMap[argName]) {
      return {
        success: false,
        message: `该表情不支持参数：${argName}`
      }
    }
    argsObj[argName] = argValue
  }

  const userInfos = [
    {
      text: await Utils.Common.getNickname(e, allUsers[0] || e.sender.userId),
      gender: await Utils.Common.getGender(e, allUsers[0] || e.sender.userId)
    }
  ]
  return {
    success: true,
    argsString: JSON.stringify({
      user_infos: userInfos,
      ...argsObj
    })
  }
}

export { handle, handleArgs }
