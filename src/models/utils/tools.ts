import { logger } from 'node-karin'

import { db, utils } from '@/models'
import Request from '@/models/utils/request'
import type { dbType, MemeInfoType, ResponseType } from '@/types'
type Model = dbType['meme']

export async function init () {
  await init_meme()
}

/**
 * 初始化表情数据
 * @returns 初始化结果
 */
export async function init_meme () {
  try {
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
        })
      }))
    }
  } catch (error) {
    logger.error(error)
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
  return await db.meme.add(data)
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
export async function get_meme_keyword_by_key (key: string): Promise<string[] | null> {
  const res = await get_meme_info(key)
  if (!res) return null
  return res.keyWords
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
 * 获取表情图片
 * @param image_id 图片唯一标识符
 * @returns 图片数据
 */
export async function get_image (image_id: string): Promise<Buffer | null> {
  try {
    const url = await utils.get_base_url()
    const res = await Request.get(`${url}/image/${image_id}`, {}, {}, 'arraybuffer')
    if (!res.success) throw new Error(res.msg)
    return res.data
  } catch (error) {
    logger.error(error)
    return null
  }
}
/**
 * 获取表情预览地址
 * @param key 表情唯一标识符
 * @returns 表情数据
 */
export async function get_meme_preview (key: string): Promise<Buffer | string | null> {
  try {
    const url = await utils.get_base_url()
    const res = await Request.get(`${url}/memes/${key}/preview`)
    if (!res.success) throw new Error(res.msg)
    const { image_id } = res.data
    return await get_image(image_id)
  } catch (error) {
    logger.error(error)
    return '预览图获取失败'
  }
}
