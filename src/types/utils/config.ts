export interface meme {
  /** 表情开关 */
  enabled: boolean
}
export interface other {
  /** 渲染精度 */
  renderScale: number
}
export interface ConfigType {
  /** 表情配置文件 */
  meme: meme
  /** 其他配置文件 */
  other: other
}
