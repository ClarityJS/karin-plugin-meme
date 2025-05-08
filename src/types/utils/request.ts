export interface ResponseType<D = any> {
  /** 是否成功请求 */
  success: boolean
  /** 状态码 */
  statusCode: number
  /** 消息 */
  msg: string
  /** 数据 */
  data: D
}
