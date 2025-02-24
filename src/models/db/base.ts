import { basePath, existToMkdir, logger } from 'node-karin'
import { col, DataTypes, fn, Model, Op, Sequelize } from 'sequelize'

import { Version } from '@/common'

const dbPath = `${basePath}/${Version.Plugin_Name}/data/`
/** 检查文件不存在自动创建 */
await existToMkdir(dbPath)

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `${dbPath}/data.db`,
  logging: false
})
/** 测试连接 */
try {
  await sequelize.authenticate()
  logger.debug(logger.chalk.bold.cyan(`[${Version.Plugin_AliasName}] 数据库连接成功`))
} catch (error) {
  logger.error(logger.chalk.bold.cyan(`[${Version.Plugin_AliasName}] 数据库连接失败: ${error}`))
}

export {
  col,
  DataTypes,
  fn,
  Model,
  Op,
  sequelize
}
