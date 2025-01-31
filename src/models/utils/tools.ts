import fs from 'node:fs'

import FormData from 'form-data'
import { basePath, exists, logger, readJson, writeJson } from 'node-karin'

import { Config, Version } from '@/common'
import { BaseType } from '@/types'

import Request from './request'
type MemeData = BaseType['utils']['meme']

/** 表情包数据路径 */
const memePath: string = `${basePath}/${Version.Plugin_Name}/data/meme.json`

const Tools = {
  baseUrl: '', /** 表情包请求基础路径 */
  infoMap: {} as Record<string, MemeData>,
  loaded: false,
  /**
   * 获取表情包请求基础路径
   * @returns string
   */
  getBaseUrl () {
    if (Config.server.url) {
      this.baseUrl = Config.server.url.replace(/\/+$/, '')
      return this.baseUrl
    }
    this.baseUrl = 'https://meme.wuliya.cn'
    return this.baseUrl
  },
  /**
   * 加载表情包数据
   */
  async load () {
    if (this.loaded) return
    if (!await exists(memePath)) {
      logger.debug(logger.chalk.cyan('🚀 表情包数据不存在，开始生成...'))
      await this.generateMemeData()
    }
    this.infoMap = await readJson(memePath)
    this.loaded = true
  },
  /** 表情包专用请求 */
  async request (
    endpoint: string,
    params: Record<string, unknown> | FormData = {},
    method: string = 'GET',
    responseType: 'json' | 'arraybuffer' | null = null
  ) {
    const baseUrl = this.getBaseUrl()
    const url = `${baseUrl}/memes/${endpoint}/`

    const isFormData = params instanceof FormData
    const headers: Record<string, string> = responseType ? { Accept: responseType } : {}

    const response = method === 'GET' || method === 'HEAD'
      ? await Request.get(url, params as Record<string, unknown>, headers, responseType ?? 'json')
      : await Request.post(url, params, isFormData ? undefined : headers, responseType ?? 'json')

    return response
  },
  /**
   * 生成本地表情包数据
   * @param force 是否强制生成
   * @returns Promise<void>
   */
  async generateMemeData (force: boolean = false) {
    if (await exists(memePath) && !force) {
      logger.debug(logger.chalk.cyan('⏩ 表情包数据已存在，跳过生成'))
      return
    }

    if (force && await exists(memePath)) {
      fs.unlinkSync(memePath)
    }

    logger.info('开始生成表情包数据')
    const baseUrl = this.getBaseUrl()
    if (!baseUrl) {
      throw new Error('无法获取表情包请求基础路径')
    }

    const keysResponse = await Request.get<{ success: boolean; data: string[] }>(`${baseUrl}/memes/keys`)

    if (!keysResponse.success) {
      console.log(keysResponse.data)
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
  },

  /**
   * 获取所有表情包的信息
   * @returns {object} - 返回表情包信息映射表
   */
  getInfoMap (): Record<string, MemeData> {
    if (!this.loaded) return {}
    return this.infoMap
  },
  /**
   * 获取指定表情包的信息
   * @param {string} memeKey - 表情包的唯一标识符
   * @returns {object} - 返回表情包的信息或 null
   */
  getInfo (memeKey: string): MemeData | null {
    if (!this.loaded) return null
    return this.infoMap[memeKey] || null
  },

  /**
   * 将关键字转换为表情包键
   * @param {string} keyword - 表情包关键字
   * @returns {string|null} - 返回对应的表情包键或 null
   */
  getKey (keyword: string): string | null {
    if (!this.loaded) return null
    for (const [key, value] of Object.entries(this.infoMap)) {
      if (value.keywords.includes(keyword)) {
        return key
      }
    }
    return null
  },
  /**
     * 获取指定表情包的关键字
     * @param {string} memeKey - 表情包的唯一标识符
     * @returns {Array<string>|null} - 返回表情包关键字数组或 null
     */
  getKeywords (memeKey: string): string[] | null {
    if (!this.loaded) return null
    const memeKeywords = this.infoMap[memeKey].keywords
    return memeKeywords
  },

  /**
   * 获取所有的关键词
   * @returns {Array<string>} - 返回包含所有关键词的数组
   */
  getAllKeywords ():string[] | null {
    if (!this.loaded) return null
    const keywords = Object.values(this.infoMap)
      .flatMap(info => info.keywords || [])
    return Array.from(new Set(keywords))
  },

  /**
       * 获取所有的 key
       * @returns {Array<string>} - 返回所有的表情包 key 的数组
       */
  getAllKeys ():string[] | null {
    if (!this.loaded) return null
    return Object.keys(this.infoMap)
  }

}

export default Tools
