import { base64, Message } from 'node-karin'

import { Config } from '@/common'
import { Utils } from '@/models'
import { handle, handleArgs } from '@/models/Meme/args'
import { handleImages } from '@/models/Meme/images'
import { preset } from '@/models/Meme/preset'
import { handleTexts } from '@/models/Meme/texts'
import { BaseType } from '@/types'
type ArgsType = BaseType['utils']['meme']['params_type']['args_type']
type PresetType = BaseType['utils']['preset']

interface ApiResponse {
  success: boolean;
  data?: ArrayBuffer;
  message?: string;
}
/**
 * 生成并发送表情图片。
 *
 * @param e - 消息对象，包含消息的详细信息。
 * @param memekey - 用于请求的表情键。
 * @param userText - 用户输入的文本。
 * @param min_texts - 最小文本数量。
 * @param max_texts - 最大文本数量。
 * @param min_images - 最小图片数量。
 * @param max_images - 最大图片数量。
 * @param default_texts - 默认文本数组。
 * @param args_type - 参数类型，定义了额外的参数。
 * @param isPreset - 是否使用预设。
 * @param Preset - 预设对象。
 * @returns 返回base64编码的图片数据。
 */

export async function make (
  e: Message,
  memekey:string,
  min_texts: number,
  max_texts: number,
  min_images:number,
  max_images: number,
  default_texts:string[] | null,
  args_type: ArgsType | null,
  userText?: string,
  isPreset: boolean = false,
  { Preset }: { Preset?: PresetType } = {}
): Promise<string> {
  const formData = new FormData()
  let quotedUser = null
  let source = null
  let MsgId: string | null | undefined = null

  if (e.replyId) {
    MsgId = (await e.bot.getMsg(e.contact, e.replyId)).messageId
  } else {
    MsgId = e.elements.find((m) => m.type === 'reply')?.messageId
  }

  if (MsgId) {
    source = (await e.bot.getHistoryMsg(e.contact, MsgId, 2))?.[0] ?? null
  }
  if (source) {
    const sourceArray = Array.isArray(source) ? source : [source]
    quotedUser = sourceArray[0].sender.userId.toString()
  }

  const allUsers = [
    ...new Set([
      ...e.elements
        .filter(m => m?.type === 'at')
        .map(at => at?.targetId?.toString() ?? ''),
      ...[...(userText?.matchAll(/@\s*(\d+)/g) ?? [])].map(match => match[1] ?? '')
    ])
  ].filter(targetId => targetId && targetId !== quotedUser)

  if (userText) {
    userText = userText.replace(/@\s*\d+/g, '').trim()
  } else {
    userText = ''
  }

  /** 处理参数表情 */
  if (args_type !== null) {
    const args = await handleArgs(e, memekey, userText, allUsers, formData, isPreset, Preset)
    if (!args.success) {
      throw new Error(args.message)
    }
    userText = args.text
  }

  /** 处理图片表情 */
  if (max_images !== 0) {
    const images = await handleImages(e, min_images, max_images, allUsers, userText, formData)
    if (!images.success) {
      throw new Error(images.message)
    }
  }
  /** 处理文字表情 */
  if (max_texts !== 0) {
    const text = await handleTexts(e, min_texts, max_texts, default_texts, allUsers, userText, formData)
    if (!text.success) {
      throw new Error(text.message)
    }
  }
  const response = await Utils.Tools.request(memekey, formData, 'arraybuffer') as ApiResponse
  if (!response.success) {
    throw new Error(response.message)
  }
  if (Config.stat.enable) {
    const stat = await Utils.Common.getStat(memekey)
    await Utils.Common.addStat(memekey, stat + 1)
  }
  const basedata = await base64(response.data) as ResponseType
  return `base64://${basedata}`
}

export { handle, handleArgs, handleImages, handleTexts, preset }
