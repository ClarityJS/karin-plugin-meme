import { col, DataTypes, fn, literal, Op, sequelize } from '@/models/db/base'
import type { MemeData } from '@/types'
import { dbType } from '@/types'
type Model = dbType['meme']

/**
 * 定义 `meme` 表（包含 JSON 数据存储、关键字、参数、标签等）。
 */
export const table = sequelize.define('meme', {
  /**
   * 唯一标识符
   */
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },

  /**
   * 存储信息的 JSON 字段
   */
  info: {
    type: DataTypes.JSON,
    allowNull: false
  },

  /**
   * 关键字列表（JSON 数组）
   */
  keyWords: {
    type: DataTypes.JSON,
    allowNull: false
  },

  /**
   * 参数列表（JSON 数组）
   */
  params: {
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
  defText: {
    type: DataTypes.JSON,
    allowNull: true
  },

  /**
   * 参数类型（可选 JSON 字段）
   */
  args_type: {
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
 * 添加或更新表情包记录。
 *
 * @param key - 表情包的唯一标识符
 * @param info - 存储表情包的基本信息（JSON 格式）
 * @param keyWords - 表情包的关键字（JSON 数组），如果没有提供，传 `null`
 * @param params - 表情包的参数（JSON 格式），如果没有提供，传 `null`
 * @param min_texts - 表情包的最小文本数量
 * @param max_texts - 表情包的最大文本数量
 * @param min_images - 表情包的最小图片数量
 * @param max_images - 表情包的最大图片数量
 * @param defText - 默认文本数组（可选），如果没有提供，传 `null`
 * @param args_type - 参数类型（JSON 格式，可选），如果没有提供，传 `null`
 * @param tags - 表情包的标签（JSON 数组，可选），如果没有提供，传 `null`
 * @param options - 选项对象，包含 `force` 属性来控制是否全量更新（默认为 `false`，表示增量更新）
 * @returns 返回创建或更新的表情包记录对象
 * @throws 如果数据库操作失败，抛出错误
 */
export async function add (
  key: MemeData['key'],
  info: MemeData,
  keyWords: MemeData['keywords'],
  params: MemeData['params_type'],
  min_texts: MemeData['params_type']['min_texts'],
  max_texts: MemeData['params_type']['max_texts'],
  min_images: MemeData['params_type']['min_images'],
  max_images: MemeData['params_type']['max_images'],
  defText: MemeData['params_type']['default_texts'],
  args_type: MemeData['params_type']['args_type'],
  tags: MemeData['tags'],
  { force = false }
) {
  const data = {
    key,
    info,
    keyWords,
    params,
    min_texts,
    max_texts,
    min_images,
    max_images,
    defText,
    args_type,
    tags
  }
  if (force) {
    await table.destroy({ where: { key } })
    return await table.create(data)
  }

  return await table.upsert(data)
}

/**
 * 通过 key 查询表情包数据。
 *
 * @param key - 唯一标识符
 * @returns 返回查询到的记录
 */
export async function get (key: string): Promise<Model | null> {
  return await table.findOne({
    where: { key }
  }) as Model | null
}

/**
 * 通过 key 查询指定字段的值。
 *
 * @param key - 表情包的唯一标识符
 * @param name - 需要查询的字段（支持单个或多个字段）
 * @returns 返回查询到的数据
 */
export async function getByKey (key: string, name: string | string[] = '*'): Promise<Model | null> {
  const queryOptions: { attributes?: string[] } = {}

  if (name !== '*' && Array.isArray(name)) {
    queryOptions.attributes = name
  } else if (name !== '*') {
    queryOptions.attributes = [name]
  }

  const res = await table.findByPk(key, queryOptions)

  if (!res) return null

  if (typeof name === 'string' && name !== '*') {
    return (res as { [key: string]: any })[name] ?? null
  }

  return res.toJSON()
}

/**
 * 通过指定字段查询数据（自动识别 JSON、字符串、数值）。
 *
 * @param field - 字段名（可能是 JSON 数组、字符串或数值）
 * @param value - 需要匹配的值（支持多个）
 * @param returnField - 返回字段（默认 `key`）
 * @returns 返回符合条件的记录数组
 */
export async function getByField (
  field: string,
  value: string | number | string[] | number[],
  returnField: string | string[] = 'key'
): Promise<Model[] | Model > {
  if (!field) {
    throw new Error('查询字段不能为空')
  }

  const values = Array.isArray(value) ? value : [value]

  const whereConditions = values.map(v => {
    if (typeof v === 'number') {
      return { [field]: v }
    }
    return {
      [Op.or]: [
        { [field]: v },
        literal(`CASE WHEN json_valid(${field}) THEN EXISTS (SELECT 1 FROM json_each(${field}) WHERE json_each.value = '${v}') ELSE 0 END`)
      ]
    }
  })

  const whereClause = { [Op.and]: whereConditions }

  const attributes = Array.isArray(returnField) ? returnField : [returnField]

  const res = await table.findAll({
    attributes,
    where: whereClause
  })

  return Array.isArray(returnField)
    ? res.map(item => item.toJSON())
    : res.map(item => (item as { [key: string]: any })[returnField])
}

/**
 * 通过字段名查询所有不同的值。
 *
 * @param name - 需要查询的字段
 * @returns 返回该字段的所有值数组
 */
export async function getAllSelect (name: string): Promise<string[]> {
  const res = await table.findAll({
    attributes: [[fn('DISTINCT', col(name)), name]]
  })
  return res.map(item => (item as { [key: string]: any })[name])
}

/**
 * 获取所有记录。
 *
 * @returns 返回所有记录的数组
 */
export async function getAll (): Promise<Model[]> {
  return await table.findAll() as Model[]
}

/**
 * 删除指定 `key` 的表情包记录。
 *
 * @param key - 需要删除的表情包的唯一标识符
 * @returns 如果成功删除返回 `true`，否则返回 `false`
 */
export async function remove (key: string): Promise<boolean> {
  return Boolean(await table.destroy({ where: { key } }))
}
