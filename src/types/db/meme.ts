import { db } from '@/models'
import { MemeData } from '@/types/utils'
type Model = db.base.Model

export interface memeType extends Model {
  /** 表情键值 */
  key: string,
  /** 表情信息 */
  info: MemeData
  /** 表情关键词 */
  keyWords: MemeData['keywords']
  /** 表情参数 */
  params: MemeData['params_type']
  /** 表情最小文本数量 */
  min_texts: MemeData['params_type']['min_texts']
  /** 表情最大文本数量 */
  max_texts: MemeData['params_type']['max_texts']
  /** 表情最小图片数量 */
  min_images: MemeData['params_type']['min_images']
  /** 表情最大图片数量 */
  max_images: MemeData['params_type']['max_images']
  /** 表情默认文本 */
  defText: MemeData['params_type']['default_texts']
  /** 表情参数类型 */
  args_type: MemeData['params_type']['args_type']
  /** 表情标签 */
  tags: MemeData['tags']
}
