import path from 'node:path';
import karin, { segment } from 'node-karin';
import { Version } from './version.js';
/**
 * 渲染精度
 * @param {string} pct 缩放百分比
 */
function scale(pct = 1) {
    const scale = Math.min(2, Math.max(0.5, 100 / 100));
    pct = pct * scale;
    return `style=transform:scale(${pct})`;
}
/**
 * 渲染
 * @param name 文件名称 不包含 `.html`
 * @param params 渲染参数
 */
const Render = {
    async render(name, params = {}) {
        name = name.replace(/.html$/, '');
        const root = `${Version.Plugin_Path}/resources`;
        const img = await karin.render({
            name: path.basename(name),
            type: 'jpeg',
            file: `${root}/${name}.html`,
            data: {
                _res_path: `${Version.Plugin_Path}/resources`.replace(/\\/g, '/'),
                defaultLayout: `${Version.Plugin_Path}/resources/common/layout/default.html`.replace(/\\/g, '/'),
                sys: {
                    scale: scale(params.scale || 1)
                },
                copyright: `${Version.Bot_Name}<span class="version"> ${Version.Bot_Version}</span> & ${Version.Plugin_Name}<span class="version"> ${Version.Plugin_Version}`,
                ...params
            },
            screensEval: '#containter',
            fullPage: true,
            pageGotoParams: {
                waitUntil: 'load',
                timeout: 60000
            }
        });
        return segment.image(`base64://${img}`);
    }
};
export { Render };
