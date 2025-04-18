import { DataTypes, sequelize } from '@/models/db/base'
import { dbType } from '@/types'
type Model = dbType['stat']
/**
 * 定义 'stat' 表模型，用于存储 key 和 all 值。
 */
export const table = sequelize.define('stat', {
  /**
   * 唯一的 key 值
   */
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  /**
   * all 值，默认为 0
   */
  all: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
 * 添加或更新统计信息。如果 key 存在，则更新 all 的值；如果 key 不存在，则创建新的记录。
 *
 * @param key - meme 的 key 值
 * @param all - meme 的 all 值
 * @returns 返回创建或更新的记录
 */
export async function add (key: string, all: number): Promise<[Model, boolean | null]> {
  const data = { key, all }
  return await table.upsert(data) as [Model, boolean]
}

/**
 * 获取指定统计的信息。
 *
 * @param key - 要查询的 meme 的 key 值
 * @param field - 要查询的字段名 (例如: 'all', 'key')
 * @returns 返回查询到的字段值，如果记录不存在或字段不存在则返回 null
 */
export async function get (key: string, field: string): Promise<Model | null> {
  const record = await table.findOne({
    where: { key },
    attributes: [field],
    raw: true
  }) as Record<string, any> | null

  return record ? record[field] : null
}

/**
 * 获取所有统计信息。
 *
 * @returns 返回所有记录的数组
 */
export async function getAll (): Promise<Model[]> {
  return await table.findAll() as Model[]
}
