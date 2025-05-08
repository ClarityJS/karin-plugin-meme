import { db } from '@/models'
type Model = db.base.Model

export interface presetType extends Model {
  /** 主键id */
  id: number
  /** 预设名称 */
  name: string
  /** 表情的键值 */
  key: string
  /** 表情的选项名称 */
  option_name: string
  /** 表情的选项值 */
  option_value: string | number
}
