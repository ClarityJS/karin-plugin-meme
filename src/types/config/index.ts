import { memeType } from './meme'
import { otherType } from './other'
import { serverType } from './server'

export interface ConfigType {
  /** 表情配置文件 */
  meme: memeType
  /** 其他配置文件 */
  other: otherType
  /** 服务器配置文件 */
  server: serverType
}
