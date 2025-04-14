import { ImageElement } from 'node-karin';
/**
 * 渲染
 * @param name 文件名称 不包含 `.html`
 * @param params 渲染参数
 */
declare const Render: {
    render(name: string, params?: Record<string, any>): Promise<ImageElement>;
};
export { Render };
