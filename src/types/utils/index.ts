import { MemeData } from './meme'
import { RequestType } from './request'

export interface UtilsType {
  requset: RequestType<any>
  meme: MemeData
}
