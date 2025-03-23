import { MemeData } from '@/types/utils/meme'
import { PresetType } from '@/types/utils/preset'
import { RequestType } from '@/types/utils/request'

export interface UtilsType {
  requset: RequestType<any>
  meme: MemeData
  preset: PresetType
}
