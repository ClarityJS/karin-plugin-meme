import { db } from '@/models'
import type { MemeOptionType } from '@/types'
type Model = db.base.Model

export interface memeType extends Model {
  /** 主键id */
  id: number
  /** 表情的键值 */
  key: string
  /** 表情关键词 */
  keyWords: string[]
  /** 最小文本数量 */
  min_texts: number
  /** 最大文本数量 */
  max_texts: number
  /** 最小图片数量 */
  min_images: number
  /** 最大图片数量 */
  max_images: number
  /** 默认文本 */
  default_texts: string[]
  /** 参数类型 */
  options: MemeOptionType[]
  /** 标签 */
  tags: string[]
}
