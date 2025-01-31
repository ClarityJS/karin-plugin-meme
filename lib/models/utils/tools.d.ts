import FormData from 'form-data';
import { BaseType } from '../../types/index.js';
type MemeData = BaseType['utils']['meme'];
declare const Tools: {
    baseUrl: string;
    infoMap: Record<string, MemeData>;
    loaded: boolean;
    /**
     * 获取表情包请求基础路径
     * @returns string
     */
    getBaseUrl(): string;
    /**
     * 加载表情包数据
     */
    load(): Promise<void>;
    /** 表情包专用请求 */
    request(endpoint: string, params?: Record<string, unknown> | FormData, method?: string, responseType?: "json" | "arraybuffer" | null): Promise<{
        success: boolean;
        data: any;
        message?: string;
    }>;
    /**
     * 生成本地表情包数据
     * @param force 是否强制生成
     * @returns Promise<void>
     */
    generateMemeData(force?: boolean): Promise<void>;
    /**
     * 获取所有表情包的信息
     * @returns {object} - 返回表情包信息映射表
     */
    getInfoMap(): Record<string, MemeData>;
    /**
     * 获取指定表情包的信息
     * @param {string} memeKey - 表情包的唯一标识符
     * @returns {object} - 返回表情包的信息或 null
     */
    getInfo(memeKey: string): MemeData | null;
    /**
     * 将关键字转换为表情包键
     * @param {string} keyword - 表情包关键字
     * @returns {string|null} - 返回对应的表情包键或 null
     */
    getKey(keyword: string): string | null;
    /**
       * 获取指定表情包的关键字
       * @param {string} memeKey - 表情包的唯一标识符
       * @returns {Array<string>|null} - 返回表情包关键字数组或 null
       */
    getKeywords(memeKey: string): string[] | null;
    /**
     * 获取所有的关键词
     * @returns {Array<string>} - 返回包含所有关键词的数组
     */
    getAllKeywords(): string[] | null;
    /**
         * 获取所有的 key
         * @returns {Array<string>} - 返回所有的表情包 key 的数组
         */
    getAllKeys(): string[] | null;
};
export default Tools;
