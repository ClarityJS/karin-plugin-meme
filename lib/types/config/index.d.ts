import { memeType } from '../../types/config/meme.js';
import { otherType } from '../../types/config/other.js';
import { serverType } from '../../types/config/server.js';
import { statType } from '../../types/config/stat.js';
export interface ConfigType {
    /** 表情配置文件 */
    meme: memeType;
    /** 其他配置文件 */
    other: otherType;
    /** 服务器配置文件 */
    server: serverType;
    /** 统计配置文件 */
    stat: statType;
}
