import { db } from '@/models'
type Model = db.base.Model

export interface presetType extends Model {
  /** 表情的关键词 */
  name: string,
  /** 表情的键值 */
  key: string,
  /** 表情参数名 */
  arg_name: string,
  /** 表情参数值 */
  arg_value: string | number,
}
