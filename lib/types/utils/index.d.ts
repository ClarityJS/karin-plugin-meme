import { MemeData } from './meme.js';
import { RequestType } from './request.js';
export interface UtilsType {
    requset: RequestType<any>;
    meme: MemeData;
}
