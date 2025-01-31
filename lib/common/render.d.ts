/**
 * 渲染
 * @param name 文件名称 不包含 `.html`
 * @param params 渲染参数
 */
declare const Render: {
    render(name: string, params?: any): Promise<import("node-karin").ImageElement>;
};
export { Render };
