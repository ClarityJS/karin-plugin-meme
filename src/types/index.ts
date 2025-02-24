import { AdminTypeConfig } from '@/types/admin'
import { CommonType } from '@/types/common'
import { ConfigType } from '@/types/config'
import { HelpType } from '@/types/help'
import { UtilsType } from '@/types/utils'

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
