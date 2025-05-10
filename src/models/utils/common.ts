import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import {
  buffer,
  Elements,
  exists,
  ImageElement,
  karinPathBase,
  logger,
  Message,
  mkdir,
  readFile
} from 'node-karin'

import { Config } from '@/common'
import Request from '@/models/utils/request'
import { Version } from '@/root'
import type { AvatarInfoResponseType, ImageInfoResponseType } from '@/types'

/**
 * 获取基础 URL
 * @returns 基础 URL
 */
export async function get_base_url (): Promise<string> {
  try {
    let base_url:string
    switch (Config.server.mode) {
      case '0':
        base_url = Config.server.url.replace(/\/+$/, '') || 'https://meme.wuliya.cn'
        break
      case '1':{
        const resources_path = path.join(os.homedir(), '.meme_generator', 'resources')
        if (!(await exists(resources_path))) {
          throw new Error('请先使用[#柠糖表情下载表情服务端资源]')
        }
        base_url = `http://127.0.0.1:${Config.server.port}`
        break
      }
      default:
        throw new Error('请检查服务器模式')
    }

    return Promise.resolve(base_url)
  } catch (error) {
    logger.error(error)
    throw new Error((error as Error).message)
  }
}

/**
 * 异步判断是否在海外环境
 * @returns 如果在海外环境返回 true，否则返回 false
 * @throws 如果获取 IP 位置失败，则抛出异常
 */
export async function isAbroad (): Promise<boolean> {
  const urls = [
    'https://blog.cloudflare.com/cdn-cgi/trace',
    'https://developers.cloudflare.com/cdn-cgi/trace'
  ]

  try {
    const responses = await Promise.all(
      urls.map((url) => Request.get(url, null, null, 'text'))
    )
    const traceTexts = responses.map((res) => res.data).filter(Boolean)
    const traceLines = traceTexts
      .flatMap((text: string) =>
        text.split('\n').filter((line: string) => line)
      )
      .map((line) => line.split('='))

    const traceMap = Object.fromEntries(traceLines)
    return traceMap.loc !== 'CN'
  } catch (error) {
    throw new Error(`获取 IP 所在地区出错: ${(error as Error).message}`)
  }
}

/**
 * 获取用户头像
 * @param e 消息事件
 * @param userId 用户ID
 * @param type 返回类型 url 或 base64
 * @returns 用户头像
 */

export async function get_user_avatar (
  e: Message,
  userId: string,
  type: 'url' | 'base64' = 'url'
): Promise<AvatarInfoResponseType | null> {
  try {
    if (!e) throw new Error('消息事件不能为空')
    if (!userId) throw new Error('用户ID不能为空')

    const avatarDir = path.join(
      karinPathBase,
      Version.Plugin_Config_Name,
      'data',
      'avatar'
    )
    const cachePath = path.join(avatarDir, `${userId}.png`).replace(/\\/g, '/')

    if (Config.meme.cache && (await exists(cachePath))) {
      const headRes = await Request.head(await e.bot.getAvatarUrl(userId))
      const lastModified = headRes.data['last-modified']
      const cacheStat = await fs.stat(cachePath)

      if (new Date(lastModified) <= cacheStat.mtime) {
        switch (type) {
          case 'base64': {
            const data = await readFile(cachePath)
            if (!data) throw new Error(`通过缓存获取用户头像失败: ${userId}`)
            return {
              userId,
              avatar: data.toString('base64')
            }
          }
          case 'url':
          default:
            return {
              userId,
              avatar: cachePath
            }
        }
      }
    }

    const avatarUrl = await e.bot.getAvatarUrl(userId)
    if (!avatarUrl) throw new Error(`获取用户头像失败: ${userId}`)

    if (Config.meme.cache && !(await exists(avatarDir))) {
      await mkdir(avatarDir)
    }

    const res = await Request.get(avatarUrl, {}, {}, 'arraybuffer')
    const avatarData = res.data

    if (Config.meme.cache) {
      await fs.writeFile(cachePath, avatarData)
    }

    switch (type) {
      case 'base64':
        return {
          userId,
          avatar: avatarData.toString('base64')
        }
      case 'url':
      default:
        return {
          userId,
          avatar: Config.meme.cache ? cachePath : avatarUrl
        }
    }
  } catch (error) {
    logger.error(error)
    return null
  }
}

/**
 * 获取用户昵称
 * @param e 消息事件
 * @param userId 用户 ID
 * @returns 用户昵称
 */
export async function get_user_name (
  e: Message,
  userId: string
): Promise<string> {
  try {
    let nickname: string | null = null
    let userInfo
    if (e.isGroup) {
      userInfo = await e.bot.getGroupMemberInfo(e.groupId, userId)
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      nickname = userInfo.card?.trim() || userInfo.nick?.trim() || null
    } else if (e.isPrivate) {
      userInfo = await e.bot.getStrangerInfo(userId)
      nickname = userInfo.nick.trim() ?? null
    } else {
      nickname = e.sender.nick.trim() ?? null
    }
    if (!nickname) throw new Error('获取用户昵称失败')
    return nickname
  } catch (error) {
    logger.error(`获取用户昵称失败: ${error}`)
    return '未知'
  }
}

/**
 * 获取图片
 * @param e 消息事件
 * @param type 返回类型 url 或 base64
 * @returns 图片数组信息
 */
export async function get_image (
  e: Message,
  type: 'url' | 'base64' = 'url'
): Promise<ImageInfoResponseType[]> {
  const imagesInMessage = e.elements
    .filter((m) => m.type === 'image')
    .map((img) => ({
      userId: e.sender.userId,
      file: img.file
    }))

  const tasks: Promise<ImageInfoResponseType>[] = []

  let quotedImages: Array<{ userId: string; file: string }> = []
  let source = null
  /**
   * 获取引用消息的内容
   */
  let MsgId: string | null | undefined = null

  if (e.replyId) {
    MsgId = (await e.bot.getMsg(e.contact, e.replyId)).messageId
  } else {
    MsgId = e.elements.find((m) => m.type === 'reply')?.messageId
  }

  if (MsgId) {
    source = (await e.bot.getHistoryMsg(e.contact, MsgId, 2))?.[0] ?? null
  }

  /**
   * 提取引用消息中的图片
   */
  if (source) {
    const sourceArray = Array.isArray(source) ? source : [source]

    quotedImages = sourceArray.flatMap(({ elements, sender }) =>
      elements
        .filter((element: Elements) => element.type === 'image')
        .map((element: ImageElement) => ({
          userId: sender.userId,
          file: element.file
        }))
    )
  }

  /**
   * 处理引用消息中的图片
   */
  if (quotedImages.length > 0) {
    for (const item of quotedImages) {
      if (type === 'url') {
        tasks.push(
          Promise.resolve({
            userId: item.userId,
            image: item.file.toString()
          })
        )
      } else {
        const buf = await buffer(item.file)
        tasks.push(
          Promise.resolve({
            userId: item.userId,
            image: buf.toString('base64')
          })
        )
      }
    }
  }

  /**
   * 处理消息中的图片
   */
  if (imagesInMessage.length > 0) {
    const imagePromises = imagesInMessage.map(async (item) => {
      if (type === 'url') {
        return {
          userId: item.userId,
          image: item.file.toString()
        }
      } else {
        const buf = await buffer(item.file)
        return {
          userId: item.userId,
          image: buf.toString('base64')
        }
      }
    })
    tasks.push(...imagePromises)
  }

  const results = await Promise.allSettled(tasks)
  const images = results
    .filter(
      (res): res is PromiseFulfilledResult<ImageInfoResponseType> =>
        res.status === 'fulfilled' && Boolean(res.value)
    )
    .map((res) => res.value)

  return images
}
