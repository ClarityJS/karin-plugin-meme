import { karinPathBase, logger } from 'node-karin'
import { col, DataTypes, fn, literal, type Model, Op, Sequelize } from 'sequelize'

import { Version } from '@/root'

const dbPath = `${karinPathBase}/${Version.Plugin_Name}/data/`

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
  literal,
  Model,
  Op,
  sequelize
}
