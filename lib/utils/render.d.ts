import type { UtilsType } from '../types/index.js';
type RenderType = UtilsType['render'];
/**
 * 渲染
 * @param name 文件名称 不包含 `.html`
 * @param params 渲染参数
 */
declare const Render: {
    render(name: RenderType["name"], params?: RenderType["parms"]): Promise<import("node-karin").ImageElement>;
};
export { Render };
