import { MemeData } from '../../types/utils/meme.js';
import { PresetType } from '../../types/utils/preset.js';
import { RequestType } from '../../types/utils/request.js';
export interface UtilsType {
    requset: RequestType<any>;
    meme: MemeData;
    preset: PresetType;
}
