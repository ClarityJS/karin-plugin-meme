import { logger } from 'node-karin'

import { Config } from '@/common'
import { db, Utils } from '@/models'
import Request from '@/models/utils/request'
import { BaseType } from '@/types'

type ArgsType = BaseType['utils']['meme']['params_type']['args_type']

/** 表情包工具类 */
class Tools {
  /**
  * 获取表情包请求基础路径
  * 该方法后续会扩展，为 Rust 版本做准备
  *
  * @returns 返回表情包基础 URL
  * @private
  */
  private static getBaseUrl (): string {
    return Config.server?.url?.replace(/\/+$/, '') || 'https://meme.wuliya.cn'
  }

  /**
   * 初始化表情包数据。
   * 如果数据已加载则直接返回，否则从本地或远程加载表情包数据。
   *
   * @returns 无返回值
   */
  static async init (): Promise<void> {
    logger.debug(logger.chalk.cyan('🚀 开始加载表情包数据...'))

    const memeData = await db.meme.getAll()

    if (!memeData || memeData.length === 0) {
      logger.debug(logger.chalk.cyan('🚀 表情包数据不存在，开始生成...'))
      await this.generateMemeData(true)
    } else {
      logger.debug(logger.chalk.cyan('✅ 表情包数据已存在，加载完成'))
    }
  }

  /**
   * 生成本地表情包数据。
   *
   * @param forceUpdate 是否进行全量更新，默认为增量更新
   * @returns 无返回值
   */
  static async generateMemeData (forceUpdate:boolean = false): Promise<void> {
    try {
      const baseUrl = this.getBaseUrl()
      if (!baseUrl) {
        logger.error('❌ 无法获取表情包请求基础路径')
        return
      }

      logger.info(logger.chalk.magenta.bold('🌟 开始生成表情包数据...'))

      const localKeys = forceUpdate ? new Set() : new Set(await this.getAllKeys())

      const remoteKeysResponse = await Utils.Request.get(`${baseUrl}/memes/keys`)
      if (!remoteKeysResponse.success || !remoteKeysResponse.data.length) {
        logger.warn('⚠️ 未获取到任何表情包键值，跳过数据更新。')
        return
      }
      const remoteKeys = new Set(remoteKeysResponse.data)

      const keysToUpdate = forceUpdate
        ? [...remoteKeys]
        : [...remoteKeys].filter(key => !localKeys.has(key))

      const keysToDelete = [...localKeys].filter(key => !remoteKeys.has(key))

      if (!keysToUpdate.length && !keysToDelete.length) {
        logger.info(logger.chalk.cyan('✅ 表情包数据已是最新，无需更新或删除。'))
        return
      }

      logger.debug(logger.chalk.magenta(`🔄 需要更新 ${keysToUpdate.length} 个表情包`))
      logger.debug(logger.chalk.red(`🗑️  需要删除 ${keysToDelete.length} 个表情包`))

      if (keysToDelete.length) {
        await this.removeKey(keysToDelete as string[])
        logger.info(logger.chalk.yellow(`🗑️ 已删除 ${keysToDelete.length} 个表情包`))
      }

      await Promise.all(
        keysToUpdate.map(async key => {
          const infoResponse = await Utils.Request.get(`${baseUrl}/memes/${key}/info`)
          if (!infoResponse.success) {
            logger.error(`❌ 获取表情包详情失败: ${key} - ${infoResponse.message}`)
            return
          }

          const info = infoResponse.data

          const processValue = <T>(value: T | null): T | null => {
            if (Array.isArray(value) && value.length === 0) return null
            if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
              return null
            }
            return value
          }

          const keyWords = processValue(info.keywords) ?? null
          const shortcuts = processValue(info.shortcuts) ?? null
          const tags = processValue(info.tags) ?? null
          const params = processValue(info.params_type) ?? null

          const min_texts = params?.min_texts ?? null
          const max_texts = params?.max_texts ?? null
          const min_images = params?.min_images ?? null
          const max_images = params?.max_images ?? null
          const defText = params?.default_texts?.length ? params.default_texts : null
          const args_type = params?.args_type ?? null

          await db.meme.add(
            key as string,
            info,
            keyWords,
            params,
            min_texts,
            max_texts,
            min_images,
            max_images,
            defText,
            args_type,
            shortcuts,
            tags,
            { force: true }
          )
        })
      )

      logger.info(logger.chalk.green.bold('✅ 表情包数据更新完成！'))
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`❌ 生成本地表情包数据失败: ${error.message}`)
      } else {
        logger.error(`❌ 生成本地表情包数据失败: ${String(error)}`)
      }
      throw error
    }
  }

  /**
   * 发送表情包相关请求
   * @param endpoint - 请求路径
   * @param params - 请求参数
   * @param responseType - 响应类型，默认为 JSON
   * @returns 返回请求结果
   */
  static request (
    endpoint: string,
    params: Record<string, unknown> | FormData = {},
    responseType: 'json' | 'arraybuffer' | null = null
  ): unknown {
    const baseUrl = this.getBaseUrl()
    const url = `${baseUrl}/memes/${endpoint}/`

    const isFormData = params instanceof FormData
    const headers: Record<string, string> = responseType ? { Accept: responseType } : {}
    return Request.post(url, params, isFormData ? undefined : headers, responseType ?? 'json')
  }

  /**
   * 获取表情预览地址
   * @param memeKey - 表情包 key
   * @returns 返回表情包预览 URL，如果 memeKey 为空则返回 null
   */
  static getPreviewUrl (memeKey?: string): string | null {
    return memeKey ? `${this.getBaseUrl()}/memes/${memeKey}/preview`.trim() : null
  }

  /**
   * 获取指定关键字的表情包 key
   * @param {string} keyword - 表情包关键字
   * @returns {Promise<string | null>} 返回对应的表情包键或 null
   */
  static async getKey (keyword: string): Promise<string | null> {
    const result = await db.meme.getByField('keyWords', keyword, 'key')
    return result.length > 0 ? result[0].key : null
  }

  /**
   * 获取指定表情包的关键字
   * @param memeKey - 表情包的唯一标识符
   * @returns 返回表情包关键字数组或 null
   */
  static async getKeyWords (memeKey: string): Promise<string[] | null> {
    return JSON.parse(await db.meme.getByKey(memeKey, 'keyWords')) || null
  }

  /**
   * 获取所有的关键词
   * @returns 返回所有的关键词数组
   */
  static async getAllKeyWords (): Promise<string[]> {
    const keyWordsList = await db.meme.getAllSelect('keyWords')
    return keyWordsList.map(item => JSON.parse(item)).flat() || []
  }

  /**
   * 获取所有的表情包 key
   *
   * @returns 返回所有的表情包 key 数组
   */
  static async getAllKeys (): Promise<string[]> {
    return (await db.meme.getAllSelect('key'))?.flat() || []
  }

  /**
   * 获取指定表情包的参数类型
   * @param memeKey - 表情包的唯一标识符
   * @returns - 返回参数类型信息对象或 null
  */
  static async getParams (memeKey: string): Promise<{
    min_texts?: number;
    max_texts?: number;
    min_images?: number;
    max_images?: number;
    default_texts?: string[] | null;
    args_type?: ArgsType | null;
  } | null> {
    if (!memeKey) return null

    const memeParams = await db.meme.getByKey(memeKey, 'params')

    if (!memeParams) {
      return null
    }

    const { min_texts, max_texts, min_images, max_images, default_texts, args_type } = JSON.parse(memeParams)

    return { min_texts, max_texts, min_images, max_images, default_texts, args_type }
  }

  /**
   * 获取指定表情包的标签
   * @param memekey - 表情包的唯一标识符
   * @returns - 返回标签对象或 null
   */
  static async getTags (key: string): Promise<Record<string, any> | null> {
    return JSON.parse(await db.meme.getByKey(key, 'tags')) || null
  }

  /**
   * 获取指定表情包的默认文本
   * @param memekey - 表情包的唯一标识符
   * @returns - 返回默认文本数组或 null
   */
  static async getDeftext (memekey: string): Promise<string[] | null> {
    return JSON.parse(await db.meme.getByKey(memekey, 'defText')) || null
  }

  /**
   * 获取指定表情包的参数描述
   * @param memekey - 表情包的唯一标识符
   * @returns - 返回参数描述对象或 null
   */
  static async getDescriptions (memekey: string): Promise<Record<string, string | null> | null> {
    const args_type = JSON.parse(await db.meme.getByKey(memekey, 'args_type'))
    if (args_type === null) {
      return null
    }

    const properties = args_type.args_model?.properties || null

    const descriptions: Record<string, string | null> = Object.entries(properties)
      .filter(([paramName]) => paramName !== 'user_infos')
      .reduce((acc, [paramName, paramInfo]) => {
        const info = paramInfo as { description?: string; title?: string }
        acc[paramName] = (info.description ?? info.title) ?? null
        return acc
      }, {} as Record<string, string | null>)

    return descriptions
  }

  /**
   * 获取指定表情包参数的类型
   * @param  memekey -表情包的唯一标识符
   * @param  paramName - 参数名称
   * @returns - 返回参数的类型或 null
   */
  static async getParamType (memekey: string, paramName: string): Promise<string | null> {
    const params = await this.getParams(memekey)
    if (!params || !params.args_type) {
      return null
    }
    const argsModel = params.args_type.args_model
    const properties: { [key: string]: any } = argsModel.properties

    if (properties[paramName]) {
      const paramInfo = properties[paramName]
      if (paramName === 'user_infos') {
        return null
      }

      if (paramInfo.type) {
        return paramInfo.type
      }
    }

    return null
  }

  /**
   * 检查输入是否在禁用表情包列表中
   * @param input - 输入的关键字或表情包键
   * @returns - 如果在禁用列表中返回 true，否则返回 false
   */
  static async isBlacklisted (input: string):Promise<boolean> {
    const blacklistedKeys = await Promise.all(
      Config.access.blackList.map(async (item) => {
        return await this.getKey(item) ?? item
      })
    )

    if (blacklistedKeys.includes(input)) {
      return true
    }

    const memeKey = await this.getKey(input)
    return memeKey ? blacklistedKeys.includes(memeKey) : false
  }

  /**
   * 删除指定 key 的表情包
   * @param memekeys - 需要删除的 key，可以是单个或数组
   * @returns 无返回值
   */
  static async removeKey (memekeys: string | string[]): Promise<void> {
    const keyArray = Array.isArray(memekeys) ? memekeys : [memekeys]
    await Promise.all(keyArray.map(memekey => db.meme.remove(memekey)))
  }
}

export default Tools
