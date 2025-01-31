import { memeType } from './meme.js';
import { otherType } from './other.js';
import { serverType } from './server.js';
export interface ConfigType {
    /** 表情配置文件 */
    meme: memeType;
    /** 其他配置文件 */
    other: otherType;
    /** 服务器配置文件 */
    server: serverType;
}
