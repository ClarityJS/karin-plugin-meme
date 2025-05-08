import { db } from '@/models'

export interface AvatarInfoResponseType {
  /** 用户id */
  userId: string
  /** 头像 */
  avatar: string
}

export interface ImageInfoResponseType {
  /** 用户id */
  userId: string
  /** 图片 */
  image: string
}

export interface PresetInfoResponseType {
  /** 预设名称 */
  name: string
  /** 表情的键值 */
  key: string
  /** 表情的选项名称 */
  option_name: string
  /** 表情的选项值 */
  option_value: string | number
}
