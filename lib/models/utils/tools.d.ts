import { BaseType } from '../../types/index.js';
type MemeData = BaseType['utils']['meme'];
declare class Tools {
    private static baseUrl;
    private static infoMap;
    private static loaded;
    /**
     * 获取表情包请求基础路径
     * @returns {string}
     */
    static getBaseUrl(): string;
    /**
     * 加载表情包数据
     * @returns {Promise<void>}
     */
    static load(): Promise<void>;
    /**
     * 表情包专用请求
     * @param {string} endpoint - 请求路径
     * @param {Record<string, unknown> | FormData} params - 请求参数
     * @param {string} responseType - 响应类型，默认为 json
     */
    static request(endpoint: string, params?: Record<string, unknown> | FormData, responseType?: 'json' | 'arraybuffer' | null): Promise<{
        success: boolean;
        data: any;
        message?: string;
    }>;
    /**
     * 获取表情预览地址
     * @param {string} memeKey - 表情包 key
     * @returns {string | null} - 表情预览地址，如果表情包 key 为空则返回 null
     */
    static getPreviewUrl(memeKey?: string): string | null;
    /**
     * 生成本地表情包数据
     * @param {boolean} force - 是否强制生成
     * @returns {Promise<void>} - 生成表情包数据
     */
    static generateMemeData(force?: boolean): Promise<void>;
    /**
     * 获取所有表情包的信息
     * @returns {object} - 返回表情包信息映射表
     */
    static getInfoMap(): Record<string, MemeData>;
    /**
     * 获取指定表情包的信息
     * @param {string} memeKey - 表情包 key
     * @returns {object} - 表情包信息，如果表情包 key 为空则返回 null
     */
    static getInfo(memeKey: string): MemeData | null;
    /**
     * 将关键字转换为表情包键
     */
    static getKey(keyword: string): string | null;
    /**
     * 获取指定表情包的关键字
     */
    static getKeywords(memeKey: string): string[] | null;
    /**
     * 获取所有的关键词
     */
    static getAllKeywords(): string[] | null;
    /**
     * 获取所有的 key
     */
    static getAllKeys(): string[] | null;
    /**
     * 获取表情包的参数
     */
    static getParams(memeKey: string): {
        min_texts: number;
        max_texts: number;
        min_images: number;
        max_images: number;
        default_texts: string[];
        args_type: import("../../types/utils/meme.js").ArgsType | null;
    } | null | undefined;
}
export default Tools;
