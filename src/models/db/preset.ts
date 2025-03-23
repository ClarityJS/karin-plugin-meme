import { col, DataTypes, fn, literal, Model, Op, sequelize } from '@/models/db/base'

export const table = sequelize.define('arg', {
  /**
   * 唯一标识符, 表情的指令，相当于快捷指令
   * @type {string}
   */
  name: {
    type: DataTypes.JSON,
    primaryKey: true,
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
   * 对应表情参数名
   * @type {string}
   */
  arg_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  /**
   * 对应表情参数值
   * @type {string}
   */
  arg_value: {
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
 * @param name - 唯一指令标识符（主键）
 * @param key - 表情包键值
 * @param arg_name - 参数名称
 * @param arg_value - 参数值
 * @returns  创建或更新后的记录对象
 */
export async function add (name: string, key: string, arg_name: string, arg_value: string | number): Promise<Model> {
  const existingRecord = await table.findOne({ where: { name }, raw: false })

  if (existingRecord) {
    return await existingRecord.update({ key, arg_name, arg_value })
  } else {
    return await table.create({ name, key, arg_name, arg_value })
  }
}

/**
 * 根据唯一指令标识符获取表情预设记录
 * @param  name - 唯一指令标识符（主键）
 * @returns 找到的记录对象，如果未找到则返回 null
 */
export async function get (name: string): Promise<Model | null> {
  return await table.findOne({ where: { name } })
}

/**
 * 获取所有表情预设记录
 * @returns {} 找到的记录对象数组
 */
export async function getAll (): Promise<Model[]> {
  return await table.findAll()
}

/**
 * 通过指定字段查询数据（自动识别 JSON、字符串、数值）
 * @param field - 字段名（可能是 JSON 数组、字符串或数值）
 * @param value - 需要匹配的值（支持多个）
 * @param returnField - 返回字段（默认 key）
 * @returns  - 返回符合条件的记录数组
 */
export async function getByField (field: string, value: string | number | string[] | number[], returnField: string | string[] = 'key'): Promise<object[]> {
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
 * 根据表情包键值获取所有表情预设记录
 * @param  key - 表情包键值
 * @returns  找到的记录对象数组
 */
export async function getAllByKey (key: string): Promise<Model | Model[]> {
  return await table.findAll({ where: { key } })
}

/**
 * 根据参数名称获取所有表情预设记录
 * @param name - 参数名称
 * @returns  找到的记录对象数组
 */
export async function getAllSelect (name: string): Promise<string[]> {
  const res = await table.findAll({
    attributes: [[fn('DISTINCT', col(name)), name]],
    raw: true
  })
  return res.map(item => (item as { [key: string]: any })[name] as string)
}

/**
 * 根据唯一指令标识符删除表情预设记录
 * @param  name - 唯一指令标识符（主键）
 * @returns 删除的记录数量
 */
export async function remove (name: string): Promise<boolean> {
  return Boolean(await table.destroy({ where: { name } }))
}

/**
 * 删除所有表情预设记录
 * @returns 删除操作完成
 */
export async function removeAll (): Promise<boolean> {
  return Boolean(await table.destroy({ truncate: true }))
}
