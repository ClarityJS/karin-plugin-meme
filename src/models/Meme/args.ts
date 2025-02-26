import _ from 'lodash'
import { Message } from 'node-karin'

import { Utils } from '@/models'

async function handleArgs (e: Message, memeKey: string, userText: string, allUsers: string[], formData: FormData) {
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

    const argsString = await handle(e, memeKey, allUsers, argsArray)
    if (!argsString.success) {
      return {
        success: argsString.success,
        message: argsString.message
      }
    }
    if (argsString.argsString) {
      formData.append('args', argsString.argsString)
    }
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

  for (const [argName, argValue] of Object.entries(args)) {
    const paramType = await Utils.Tools.getParamType(key, argName)

    if (!paramType) {
      return {
        success: false,
        message: `该参数表情不存在参数 ${argName}`
      }
    }

    if (paramType === 'integer') {
      argsObj[argName] = parseInt(argValue as string, 10)
    } else if (paramType === 'boolean') {
      argsObj[argName] = argValue === 'true' ? true : argValue === 'false' ? false : argValue
    } else {
      argsObj[argName] = argValue
    }
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
