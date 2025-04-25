export interface ProtectType {
  /**
   * 是否表情保护
   */
  enable: boolean
  /**
   * 主人保护
   */
  master: boolean
  /**
   * 用户保护
   */
  userEnable: boolean
  /**
   * 其他用户保护列表
   */
  user: string[]
  /**
   * 表情保护列表
   */
  list: string[]
}
