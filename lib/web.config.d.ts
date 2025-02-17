import { BaseType } from './types/index.js';
type ConfigType = BaseType['config'];
declare const _default: {
    info: {};
    /** 动态渲染的组件 */
    components: () => import("node-karin").AccordionProps[];
    /** 前端点击保存之后调用的方法 */
    /** 这里简写了一下后面再改 */
    save: (newConfig: ConfigType) => {
        success: boolean;
        message: string;
    };
};
export default _default;
