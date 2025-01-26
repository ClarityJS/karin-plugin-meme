import { RenderType } from './render.js';
import { ChangeType, VersionType } from './version.js';
export interface UtilsType {
    /**
     * @description 获取版本信息
     */
    version: VersionType;
    /**
     * @description 获取帮助信息
     */
    change: ChangeType;
    /**
     * @description 渲染模板
     */
    render: RenderType;
}
