import { logger } from 'node-karin'

import { updateRegExp } from '@/apps/meme'
import { db, utils } from '@/models'
import Request from '@/models/utils/request'
import type { dbType, MemeInfoType, ResponseType } from '@/types'
type Model = dbType['meme']
type PresetModel = dbType['preset']

const keys = await get_meme_all_keys()
const presetKeys = await get_preset_all_keys()

/** 初始化数据 */
export async function init () {
  const shouldUpdateRegExp = !keys?.length || !presetKeys?.length
  await update_meme()
  await update_preset()
  if (shouldUpdateRegExp) await updateRegExp()
}

/**
 * 更新表情数据
 * @param force 是否强制更新
 * @returns 初始化结果
 */
export async function update_meme (force: boolean = false) {
  try {
    if (keys && keys.length > 0 && !force) return
    const url = await utils.get_base_url()
    const res:ResponseType<MemeInfoType> = await Request.get(`${url}/meme/infos`)
    if (!res.success) throw new Error(res.msg)
    if (res.data && Array.isArray(res.data)) {
      await Promise.all(res.data.map(meme => {
        const {
          key,
          keywords: keyWords,
          params: {
            min_texts,
            max_texts,
            min_images,
            max_images,
            default_texts,
            options
          },
          tags
        } = meme

        return add_meme({
          key,
          keyWords: keyWords?.length ? keyWords : null,
          min_texts,
          max_texts,
          min_images,
          max_images,
          default_texts: default_texts?.length ? default_texts : null,
          options: options?.length ? options : null,
          tags: tags?.length ? tags : null
        }, {
          force
        })
      }))
    }
  } catch (error) {
    logger.error(`初始化表情数据失败: ${error}`)
  }
}

/**
 * 更新预设数据
 * @param force 是否强制更新
 * @returns 初始化结果
 */
export async function update_preset (force: boolean = false) {
  try {
    if (presetKeys && presetKeys.length > 0 && !force) return
    const preset = utils.preset
    await Promise.all(
      preset.map(async (preset) => {
        await db.preset.add({
          name: preset.name,
          key: preset.key,
          option_name: preset.option_name,
          option_value: preset.option_value
        }, {
          force
        }
        )
      })
    )
  } catch (error) {
    logger.error(`初始化预设数据失败: ${error}`)
  }
}

/**
 * 添加表情
 * @param data 表情数据
 * - key 表情的唯一标识符
 * - keyWords 表情的关键词列表
 * - min_texts 表情最少的文本数
 * - max_texts 表情最多的文本数
 * - min_images 表情最少的图片数
 * - max_images 表情最多的图片数
 * - default_texts 表情的默认文本列表
 * - options 表情的参数类型
 * - tags 表情的标签列表
 * @param force 是否强制更新
 * @returns 添加结果
 */
export async function add_meme ({
  key,
  keyWords,
  min_texts,
  max_texts,
  min_images,
  max_images,
  default_texts,
  options,
  tags
}: {
  key: MemeInfoType['key'],
  keyWords: MemeInfoType['keywords'],
  min_texts: MemeInfoType['params']['min_texts'],
  max_texts: MemeInfoType['params']['max_texts'],
  min_images: MemeInfoType['params']['min_images'],
  max_images: MemeInfoType['params']['max_images'],
  default_texts: MemeInfoType['params']['default_texts'],
  options: MemeInfoType['params']['options'],
  tags: MemeInfoType['tags']
}, {
  force = false
}: {
  force?: boolean
}): Promise<[Model, boolean | null]> {
  const data = {
    key,
    keyWords,
    min_texts,
    max_texts,
    min_images,
    max_images,
    default_texts,
    options,
    tags
  }
  return await db.meme.add(data, { force })
}

/**
 * 获取所有预设的键值信息
 * @returns 键值信息列表
 */
export async function get_preset_all_keys (): Promise<string[] | null> {
  const res = await db.preset.getAll()
  return res.map(preset => preset.key).flat() ?? null
}

/**
 * 获取所有预设表情的关键词信息
 * @returns 关键词信息列表
 */
export async function get_preset_all_keywords (): Promise<string[] | null> {
  const res = await db.preset.getAll()
  return res.map(preset => preset.name).flat() ?? null
}

/**
 * 通过关键词获取预设表情的键值
 * @param keyword 关键词
 * @returns 键值
 */
export async function get_preset_key_by_keyword (keyword: string): Promise<string | null> {
  const res = await get_preset_info_by_keyword(keyword)
  if (!res) return null
  return res.key
}
/**
 * 获取指定的预设表情信息
 * @param key 表情的唯一标识符
 * @returns 预设表情信息
 */
export async function get_preset_info (key: string): Promise<PresetModel | null> {
  return await db.preset.get(key)
}

/**
 * 通过关键词获取预设表情信息
 * @param keyword 表情关键词
 * @returns 预设表情信息
 */
export async function get_preset_info_by_keyword (keyword: string): Promise<PresetModel | null> {
  return await db.preset.getByKeyWord(keyword)
}

/**
 * 获取所有相关预设表情的键值
 * @param key 表情的唯一标识符
 * @returns 所有相关预设表情的键值列表
 */
export async function get_preset_all_about_keywords_by_key (keywords: string): Promise<string[] | null> {
  const res = await db.preset.getAbout(keywords)
  return res.map(preset => preset.name).flat() ?? null
}

/**
 * 获取所有表情的键值信息
 * @returns 键值信息列表
 */
export async function get_meme_all_keys (): Promise<string[] | null> {
  const res = await db.meme.getAll()
  return res.map(meme => meme.key).flat() ?? null
}

/**
 * 通过关键词获取表情键值
 * @param keyword 表情关键词
 * @returns 表情键值
 */
export async function get_meme_key_by_keyword (keyword: string): Promise<string | null> {
  const res = await get_meme_info_by_keyword(keyword)
  if (!res) return null
  return res.key
}
/**
 * 获取所有所有相关表情的键值
 * @param key 表情的唯一标识符
 * @returns 所有相关表情的键值列表
 */
export async function get_meme_keys_by_about (key: string): Promise<string[] | null> {
  const res = await db.meme.getKeysByAbout(key)
  return res.map(meme => meme.key).flat() ?? null
}
/**
 * 获取所有表情的关键词信息
 * @returns 关键词信息列表
 */
export async function get_meme_all_keywords (): Promise<string[] | null> {
  const res = await db.meme.getAll()
  return res.map((item) => JSON.parse(String(item.keyWords))).flat() ?? null
}

/**
 * 通过键值获取表情的关键词信息
 * @param key 表情的唯一标识符
 * @returns 表情的关键词信息
 */
export async function get_meme_keyword (key: string): Promise<string[] | null> {
  const res = await get_meme_info(key)
  if (!res) return null
  return JSON.parse(String(res.keyWords))
}

/**
 * 获取所有相关表情的关键词信息
 * @param keyword 表情关键词
 * @returns 所有相关表情的关键词列表
 */
export async function get_meme_keywords_by_about (keyword: string): Promise<string[] | null> {
  const res = await db.meme.getKeyWordsByAbout(keyword)
  return res.map((item) => JSON.parse(String(item.keyWords))).flat() ?? null
}

/**
 * 获取表情信息
 * @param key 表情唯一标识符
 * @returns 表情信息
 */
export async function get_meme_info (key: string): Promise<Model | null> {
  return await db.meme.get(key) ?? null
}

/**
 * 通过关键词获取表情信息
 * @param keyword 表情关键词
 * @returns 表情信息
 */
export async function get_meme_info_by_keyword (keyword: string): Promise<Model | null> {
  return await db.meme.getByKeyWord(keyword) ?? null
}

/**
 * 获取图片
 * @param image_id 图片唯一标识符
 * @returns 图片数据
 */
export async function get_meme_image (image_id: string): Promise<Buffer> {
  try {
    const url = await utils.get_base_url()
    const res = await Request.get(`${url}/image/${image_id}`, {}, {}, 'arraybuffer')
    if (!res.success) throw new Error('获取图片失败')
    return res.data
  } catch (error) {
    logger.error(error)
    throw new Error((error as Error).message)
  }
}

/**
 * 上传图片
 * @param image 图片数据
 * @param type 上传的图片类型
 * - url 图片的网络地址
 * - path 图片的本地路径
 * - data 图片的base64数据
 * @param headers  请求头，仅在type为url时生效
 * @returns image_id 图片的唯一标识符
 */
export async function upload_image (
  image: Buffer | string,
  type: 'url' | 'path' | 'data' = 'url',
  headers?: Record<string, string>
): Promise<string> {
  try {
    const url = await utils.get_base_url()
    let data
    switch (type) {
      case 'url':
        data = {
          type: 'url',
          url: image,
          ...(headers && { headers })
        }
        break
      case 'path':
        data = {
          type: 'path',
          path: image
        }
        break
      case 'data':
        data = {
          type: 'data',
          data: Buffer.isBuffer(image) ? image.toString('base64') : image
        }
        break
    }
    const res = await Request.post(`${url}/image/upload`, data, {}, 'json')
    if (!res.success) throw new Error('图片上传失败')
    return res.data.image_id
  } catch (error) {
    logger.error(error)
    throw new Error((error as Error).message)
  }
}
/**
 * 获取表情预览地址
 * @param key 表情唯一标识符
 * @returns 表情数据
 */
export async function get_meme_preview (key: string): Promise<Buffer> {
  try {
    const url = await utils.get_base_url()
    const res = await Request.get(`${url}/memes/${key}/preview`)
    if (!res.success) throw new Error(res.msg)
    const image = await get_meme_image(res.data.image_id)
    return image
  } catch (error) {
    logger.error(error)
    throw new Error((error as Error).message)
  }
}

/**
 * 生成表情图片
 * @param memekey 表情唯一标识符
 * @param data 表情数据
 * @returns 表情图片数据
 */
export async function make_meme (memekey: string, data: Record<string, unknown>): Promise<Buffer> {
  try {
    const url = await utils.get_base_url()
    const res = await Request.post(`${url}/memes/${memekey}`, data, {}, 'json')
    if (!res.success) {
      throw new Error(res.msg)
    }
    const image = await get_meme_image(res.data.image_id)
    if (!image) throw new Error('获取图片失败')
    return image
  } catch (error) {
    logger.error(error)
    throw new Error((error as Error).message)
  }
}
