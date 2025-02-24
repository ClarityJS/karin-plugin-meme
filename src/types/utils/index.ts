import { MemeData } from '@/types/utils/meme'
import { RequestType } from '@/types/utils/request'

export interface UtilsType {
  requset: RequestType<any>
  meme: MemeData
}
