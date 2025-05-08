import { DataTypes, literal, Op, sequelize } from '@/models/db/base'
import type { dbType, MemeInfoType } from '@/types'
type Model = dbType['meme']

/**
 * 定义 `meme` 表（包含 JSON 数据存储、关键字、参数、标签等）。
 */
export const table = sequelize.define('meme', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  /**
   * 唯一标识符
   */
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  /**
   * 关键字列表（JSON 数组）
   */
  keyWords: {
    type: DataTypes.JSON,
    allowNull: false
  },

  /**
   * 最小文本数量
   */
  min_texts: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  /**
   * 最大文本数量
   */
  max_texts: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  /**
   * 最小图片数量
   */
  min_images: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  /**
   * 最大图片数量
   */
  max_images: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  /**
   * 默认文本（可选 JSON 数组）
   */
  default_texts: {
    type: DataTypes.JSON,
    allowNull: true
  },

  /**
   * 参数类型（可选 JSON 字段）
   */
  options: {
    type: DataTypes.JSON,
    allowNull: true
  },
  /**
   * 标签（可选 JSON 数组）
   */
  tags: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  freezeTableName: true,
  defaultScope: {
    raw: true
  }
})

await table.sync()

/**
 * 添加表情信息。
 *
 * @param key 表情的唯一标识符
 * @param keyWords 表情的关键字列表
 * @param min_texts 表情的最小文本数量
 * @param max_texts 表情的最大文本数量
 * @param min_images 表情的最小图片数量
 * @param max_images 表情的最大图片数量
 * @param default_texts 表情的默认文本列表
 * @param options 表情的参数类型
 * @param tags 表情的标签列表
 * @returns 添加结果
 */

export async function add ({
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
} = {}): Promise<[Model, boolean | null]> {
  if (force) {
    await table.destroy({
      where: {
        key
      }
    })
  }
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
  return await table.upsert(data) as [Model, boolean | null]
}

/**
 * 通过表情唯一标识符获取表情信息
 * @param key 表情的唯一标识符
 * @returns 表情的信息
 */
export async function get (key: string): Promise<Model | null> {
  return await table.findOne({
    where: {
      key
    }
  }) as Model | null
}

/**
 * 通过表情唯一标识符模糊获取所有相关的表情信息
 * @param key 表情的唯一标识符
 * @returns 表情的信息列表
 */
export async function getKeysByAbout (key: string): Promise<Model[]> {
  return await table.findAll({
    where: {
      key: {
        [Op.like]: `%${key}%`
      }
    }
  }) as Model[]
}

/**
 * 通过表情关键词获取表情信息
 * @param keyword 表情的关键字
 * @returns 表情信息
 */
export async function getByKeyWord (keyword: string): Promise<Model | null> {
  return await table.findOne({
    where: literal(`json_extract(keyWords, '$') LIKE '%"${keyword}"%'`)
  }) as Model | null
}

/**
 * 通过表情关键词模糊获取所有相关的表情信息
 * @param keywod 关键词
 * @returns 表情信息
 */
export async function getKeyWordsByAbout (keyword: string): Promise<Model[]> {
  return await table.findAll({
    where: literal(`json_extract(keyWords, '$') LIKE '%${keyword}%'`)
  }) as Model[]
}
/**
 * 获取表情信息列表
 * @returns 表情信息列表
 */
export async function getAll (): Promise<Model[]> {
  return await table.findAll() as Model[]
}
