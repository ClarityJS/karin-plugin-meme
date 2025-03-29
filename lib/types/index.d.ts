import { AdminTypeConfig } from '../types/admin/index.js';
import { CommonType } from '../types/common/index.js';
import { ConfigType } from '../types/config/index.js';
import { HelpType } from '../types/help/index.js';
import { UtilsType } from '../types/utils/index.js';
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
