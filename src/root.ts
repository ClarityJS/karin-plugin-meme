import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config, requireFileSync } from 'node-karin'

import type { VersionType } from '@/types'

const filePath = fileURLToPath(import.meta.url).replace(/\\/g, '/')
const dirPath = path.resolve(filePath, '../../').replace(/\\/g, '/')
const basename = path.basename(dirPath)

const pkg = requireFileSync(`${dirPath}/package.json`)

export const isPackaged = Object.freeze(dirPath.includes('node_modules'))

const Version:VersionType = {
  /** 当前Bot名称 */
  get Bot_Name () {
    return config.pkg().name === 'node-karin' ? 'Karin' : config.pkg().name
  },
  /** 当前Bot版本 */
  get Bot_Version () {
    return config.pkg().version
  },
  /** 当前Bot路径 */
  get Bot_Path () {
    return process.cwd().replace(/\\/g, '/')
  },
  /** 插件包路径 */
  get Plugin_Path () {
    return dirPath
  },
  /** 插件包名称 */
  get Plugin_Name () {
    return isPackaged ? pkg.name : basename
  },
  /** 插件包配置名称 */
  get Plugin_Config_Name () {
    return pkg.name.replace('/', '-')
  },
  /** 插件包别名 */
  get Plugin_AliasName () {
    return '清语表情'
  },
  /** 插件包版本 */
  get Plugin_Version () {
    return pkg.version
  },
  get Plugin_Anthor () {
    return pkg.author
  }
}

export { pkg, Version }
