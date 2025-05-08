import { col, DataTypes, fn, literal, Op, sequelize } from '@/models/db/base'
import type { dbType } from '@/types'
type Model = dbType['preset']
/**
 * 定义 `preset` 表（包含 JSON 数据存储、关键字、参数、标签等）。
 */
export const table = sequelize.define('preset', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  /**
   * 表情的快捷指令
   * @type {string}
   */
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  /**
   * 表情包的键值
   * 对应预设参数的表情的键值
   * @type {string}
   */
  key: {
    type: DataTypes.STRING,
    allowNull: false
  },
  /**
   * 对应表情选项名称
   * @type {string}
   */
  option_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  /**
   * 对应表情选项值
   * @type {string}
   */
  option_value: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  defaultScope: {
    raw: true
  }
})

await table.sync()

/**
 * 添加或更新表情预设记录
 * @param name - 表情的关键词
 * @param key - 表情包键值
 * @param option_name - 选项名称
 * @param option_value - 选项值
 * @param force - 是否强制创建新记录
 * @returns  创建或更新后的记录对象
 */
export async function add ({
  name,
  key,
  option_name,
  option_value
}: {
  name: string,
  key: string,
  option_name: string,
  option_value: string | number
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
  name = String(name)
  const data = {
    name,
    key,
    option_name,
    option_value
  }
  return await table.upsert(data) as [Model, boolean | null]
}

/**
 * 通过表情唯一标识符获取表情快捷指令信息
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
 * 通过表情唯一标识符获取所有表情快捷指令信息
 * @param key 表情的唯一标识符
 * @returns 表情的信息
 */
export async function getAbout (key: string): Promise<Model[]> {
  return await table.findAll({
    where: {
      key
    }
  }) as Model[]
}

/**
 * 通过预设表情关键词获取表情信息
 * @param keyword 表情关键词
 * @returns 表情信息
 */
export async function getByKeyWord (keyword: string): Promise<Model | null> {
  return await table.findOne({
    where: {
      name: keyword
    }
  }) as Model | null
}

/**
 * 通过预设表情关键词获取所有相关表情信息
 * @param keyword 表情关键词
 * @returns 表情信息
 */
export async function getByKeyWordAbout (keyword: string): Promise<Model[]> {
  return await table.findAll({
    where: {
      name: keyword
    }
  }) as Model[]
}

/**
 * 获取所有表情预设记录
 * @returns {} 找到的记录对象数组
 */
export async function getAll (): Promise<Model[]> {
  return await table.findAll() as Model[]
}

/**
 * 通过表情唯一标识符删除对应的表情信息
 * @param key 表情的唯一标识符
 * @returns 删除成功与否
 */
export async function remove (key: string): Promise<boolean> {
  return Boolean(await table.destroy({ where: { key } }))
}
