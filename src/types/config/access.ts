export interface accessType {
  /** 是否开启名单限制 */
  enable: boolean
  /** 是否开启禁用表情列表 */
  blackListEnable: false

  /**  名单限制模式（白名单：0，黑名单：1） */
  mode: 0 | 1

  /** 用户白名单 */
  userWhiteList: string[]

  /** 用户黑名单 */
  userBlackList: string[]

  /** 禁用表情列表 */
  blackList: string[]
}
