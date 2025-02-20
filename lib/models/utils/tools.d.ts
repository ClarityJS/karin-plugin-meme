import { BaseType } from '../../types/index.js';
type ArgsType = BaseType['utils']['meme']['params_type']['args_type'];
/** 表情包工具类 */
declare class Tools {
    /**
    * 获取表情包请求基础路径
    * 该方法后续会扩展，为 Rust 版本做准备
    *
    * @returns {string} 返回表情包基础 URL
    * @private
    */
    private static getBaseUrl;
    /**
     * 初始化表情包数据。
     * 如果数据已加载则直接返回，否则从本地或远程加载表情包数据。
     *
     * @returns {Promise<void>} 无返回值
     */
    static init(): Promise<void>;
    /**
     * 生成本地表情包数据。
     *
     * @param {boolean} [forceUpdate=false] 是否进行全量更新，默认为增量更新
     * @returns {Promise<void>} 无返回值
     */
    static generateMemeData(forceUpdate?: boolean): Promise<void>;
    /**
     * 发送表情包相关请求
     * @param {string} endpoint - 请求路径
     * @param {Record<string, unknown> | FormData} [params={}] - 请求参数
     * @param {'json' | 'arraybuffer' | null} [responseType=null] - 响应类型，默认为 JSON
     * @returns {Promise<unknown>} 返回请求结果
     */
    static request(endpoint: string, params?: Record<string, unknown> | FormData, responseType?: 'json' | 'arraybuffer' | null): unknown;
    /**
     * 获取表情预览地址
     * @param {string} [memeKey] - 表情包 key
     * @returns {string | null} 返回表情包预览 URL，如果 memeKey 为空则返回 null
     */
    static getPreviewUrl(memeKey?: string): string | null;
    /**
     * 获取指定关键字的表情包 key
     * @param {string} keyword - 表情包关键字
     * @returns {Promise<string | null>} 返回对应的表情包键或 null
     */
    static getKey(keyword: string): Promise<string | null>;
    /**
     * 获取指定表情包的关键字
     * @param {string} memeKey - 表情包的唯一标识符
     * @returns {Promise<string[] | null>} 返回表情包关键字数组或 null
     */
    static getKeyWords(memeKey: string): Promise<string[] | null>;
    /**
     * 获取所有的关键词
     * @returns {Promise<string[]>} 返回所有的关键词数组
     */
    static getAllKeyWords(): Promise<string[]>;
    /**
     * 获取所有的表情包 key
     *
     * @returns {Promise<string[]>} 返回所有的表情包 key 数组
     */
    static getAllKeys(): Promise<string[]>;
    /**
     * 获取指定表情包的参数类型
     * @param {string} memeKey - 表情包的唯一标识符
     * @returns {Promise<{
    *   min_texts?: number;
    *   max_texts?: number;
    *   min_images?: number;
    *   max_images?: number;
    *   default_texts?: string[];
    *   args_type?: string;
    * } | null>} - 返回参数类型信息对象或 null
    */
    static getParams(memeKey: string): Promise<{
        min_texts?: number;
        max_texts?: number;
        min_images?: number;
        max_images?: number;
        default_texts?: string[] | null;
        args_type?: ArgsType | null;
    } | null>;
    /**
     * 获取指定表情包的标签
     * @param {string} key - 表情包的唯一标识符
     * @returns {Promise<Record<string, any> | null>} - 返回标签对象或 null
     */
    static getTags(key: string): Promise<any>;
    /**
     * 获取指定表情包的默认文本
     * @param {string} key - 表情包的唯一标识符
     * @returns {Promise<string[] | null>} - 返回默认文本数组或 null
     */
    static getDeftext(key: string): Promise<any>;
    /**
     * 获取指定表情包的参数描述
     * @param {string} key - 表情包的唯一标识符
     * @returns {Promise<Record<string, string | null> | null>} - 返回参数描述对象或 null
     */
    static getDescriptions(key: string): Promise<Record<string, string | null> | null>;
    /**
     * 删除指定 key 的表情包
     * @param {string | string[]} keys - 需要删除的 key，可以是单个或数组
     * @returns {Promise<void>} 无返回值
     */
    static removeKey(keys: string | string[]): Promise<void>;
}
export default Tools;
