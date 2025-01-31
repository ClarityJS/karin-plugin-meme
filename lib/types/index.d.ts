import { AdminTypeConfig } from './admin/index.js';
import { CommonType } from './common/index.js';
import { ConfigType } from './config/index.js';
import { HelpType } from './help/index.js';
import { UtilsType } from './utils/index.js';
export interface BaseType {
    /** 设置渲染配置 */
    admin: AdminTypeConfig;
    /** 设置公共配置 */
    common: CommonType;
    /** 配置文件 */
    config: ConfigType;
    /** 帮助文件 */
    help: HelpType;
    /** 工具文件 */
    utils: UtilsType;
}
