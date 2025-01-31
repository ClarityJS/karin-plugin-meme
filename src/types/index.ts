import { AdminTypeConfig } from './admin'
import { CommonType } from './common'
import { ConfigType } from './config'
import { HelpType } from './help'
import { UtilsType } from './utils'

export interface BaseType {
  /** 设置渲染配置 */
  admin: AdminTypeConfig;
  /** 设置公共配置 */
  common: CommonType;
  /** 配置文件 */
  config: ConfigType;
  /** 帮助文件 */
  help: HelpType;
  /** 工具文件 */
  utils: UtilsType;
}
