import { logger } from 'node-karin'
import axios from 'node-karin/axios'

import { utils } from '@/models'
import { Version } from '@/root'

let responseData = '加载失败'
try {
  const response = await axios.get(
    `https://api.wuliya.cn/api/count?name=${Version.Plugin_Name}&type=json`,
    { timeout: 500 }
  )
  responseData = response.data.data
} catch (error) {
  logger.error(logger.chalk.red.bold('⚠️ 访问统计数据失败，超时或网络错误'))
}

logger.info(logger.chalk.bold.rgb(0, 255, 0)('========= 🌟🌟🌟 ========='))
try {
  await utils.init()
  logger.info(logger.chalk.bold.cyan('🎉 表情包数据加载成功！'))
} catch (error: unknown) {
  logger.error(logger.chalk.bold.red(`💥 表情包数据加载失败！错误详情：${(error as Error).message}`))
}
logger.info(
  logger.chalk.bold.blue('📦 当前运行环境: ') +
  logger.chalk.bold.white(`${Version.Bot_Name}`) +
  logger.chalk.gray(' | ') +
  logger.chalk.bold.green('🏷️ 运行版本: ') +
  logger.chalk.bold.white(`V${Version.Bot_Version}`) +
  logger.chalk.gray(' | ') +
  logger.chalk.bold.yellow('📊 运行插件总访问/运行次数: ') +
  logger.chalk.bold.cyan(responseData)
)
logger.info(
  logger.chalk.bold.rgb(255, 215, 0)(`✨ ${Version.Plugin_AliasName} `) +
    logger.chalk.bold.rgb(255, 165, 0).italic(Version.Plugin_Version) +
    logger.chalk.rgb(255, 215, 0).bold(' 载入成功 ^_^')
)
logger.info(logger.chalk.cyan.bold('💬 雾里的小窝: 272040396'))
logger.info(logger.chalk.green.bold('========================='))
