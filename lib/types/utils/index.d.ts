import { MemeData } from '../../types/utils/meme.js';
import { RequestType } from '../../types/utils/request.js';
export interface UtilsType {
    requset: RequestType<any>;
    meme: MemeData;
}
