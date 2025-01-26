import { logger } from 'node-karin';
import { Version } from './utils/index.js';
logger.info(logger.chalk.bold.rgb(0, 255, 0)('========= 🌟🌟🌟 ========='));
logger.info(logger.chalk.bold.blue('📦 当前运行环境: ') +
    logger.chalk.bold.white(`${Version.Bot_Name}`) +
    logger.chalk.gray(' | ') +
    logger.chalk.bold.green('运行版本: ') +
    logger.chalk.bold.white(`${Version.Bot_Version}`));
logger.info(logger.chalk.bold.rgb(255, 215, 0)(`✨ ${Version.Plugin_AliasName} `) +
    logger.chalk.bold.rgb(255, 165, 0).italic(Version.Plugin_Version) +
    logger.chalk.rgb(255, 215, 0).bold(' 载入成功 ^_^'));
logger.info(logger.chalk.cyan.bold('💬 雾里的小窝: 272040396'));
logger.info(logger.chalk.green.bold('========================='));
