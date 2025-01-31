import fs from 'node:fs'

import FormData from 'form-data'
import { basePath, exists, logger, readJson, writeJson } from 'node-karin'

import { Config, Version } from '@/common'
import { BaseType } from '@/types'

import Request from './request'

type MemeData = BaseType['utils']['meme']

/** 表情包数据路径 */
const memePath: string = `${basePath}/${Version.Plugin_Name}/data/meme.json`

class Tools {
  private static baseUrl: string = ''
  private static infoMap: Record<string, MemeData>
  private static loaded: boolean = false

  /**
   * 获取表情包请求基础路径
   * @returns {string}
   */
  static getBaseUrl (): string {
    return (this.baseUrl ??= Config.server.url.replace(/\/+$/, '') ?? 'https://meme.wuliya.cn')
  }

  /**
   * 加载表情包数据
   */
  static async load (): Promise<void> {
    if (this.loaded) return
    if (!(await exists(memePath))) {
      logger.debug(logger.chalk.cyan('🚀 表情包数据不存在，开始生成...'))
      await this.generateMemeData()
    }
    this.infoMap = await readJson(memePath)
    this.loaded = true
  }

  /**
   * 表情包专用请求
   */
  static async request (
    endpoint: string,
    params: Record<string, unknown> | FormData = {},
    method: string = 'GET',
    responseType: 'json' | 'arraybuffer' | null = null
  ) {
    const baseUrl = this.getBaseUrl()
    const url = `${baseUrl}/memes/${endpoint}/`

    const isFormData = params instanceof FormData
    const headers: Record<string, string> = responseType ? { Accept: responseType } : {}

    return method === 'GET' || method === 'HEAD'
      ? await Request.get(url, params as Record<string, unknown>, headers, responseType ?? 'json')
      : await Request.post(url, params, isFormData ? undefined : headers, responseType ?? 'json')
  }

  /**
   * 生成本地表情包数据
   */
  static async generateMemeData (force: boolean = false): Promise<void> {
    if (await exists(memePath) && !force) {
      logger.debug(logger.chalk.cyan('⏩ 表情包数据已存在，跳过生成'))
      return
    }

    if (force && (await exists(memePath))) {
      fs.unlinkSync(memePath)
    }

    logger.info(logger.chalk.magenta.bold('🌟 开始生成表情包数据...'))
    const baseUrl = this.getBaseUrl()
    if (!baseUrl) {
      throw new Error('无法获取表情包请求基础路径')
    }

    const keysResponse = await Request.get<{ success: boolean; data: string[] }>(`${baseUrl}/memes/keys`)

    if (!keysResponse.success) {
      logger.info(keysResponse.data)
    }

    const keys = keysResponse.data
    const memeData: Record<string, MemeData> = {}

    const infoResponses = await Promise.all(
      keys.map(async (key: string) => {
        const infoResponse = await Request.get<MemeData>(`${baseUrl}/memes/${key}/info`)
        return { key, data: infoResponse.data }
      })
    )

    for (const { key, data } of infoResponses) {
      memeData[key] = data
    }

    await writeJson(memePath, memeData, true)
  }

  /**
   * 获取所有表情包的信息
   * @returns {object} - 返回表情包信息映射表
   */
  static getInfoMap (): Record<string, MemeData> {
    return this.loaded ? this.infoMap : {}
  }

  /**
   * 获取指定表情包的信息
   */
  static getInfo (memeKey: string): MemeData | null {
    return this.loaded ? this.infoMap[memeKey] || null : null
  }

  /**
   * 将关键字转换为表情包键
   */
  static getKey (keyword: string): string | null {
    if (!this.loaded) return null
    for (const [key, value] of Object.entries(this.infoMap)) {
      if (value.keywords.includes(keyword)) {
        return key
      }
    }
    return null
  }

  /**
   * 获取指定表情包的关键字
   */
  static getKeywords (memeKey: string): string[] | null {
    return this.loaded ? this.infoMap[memeKey]?.keywords || null : null
  }

  /**
   * 获取所有的关键词
   */
  static getAllKeywords (): string[] | null {
    if (!this.loaded) return null
    return Array.from(new Set(Object.values(this.infoMap).flatMap(info => info.keywords || [])))
  }

  /**
   * 获取所有的 key
   */
  static getAllKeys (): string[] | null {
    return this.loaded ? Object.keys(this.infoMap) : null
  }
}

export default Tools
