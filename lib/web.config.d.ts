import type { ConfigType } from './types/index.js';
declare const _default: {
    info: {
        name: string;
        description: string;
        author: {
            name: any;
            home: any;
            avatar: string;
        }[];
    };
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
