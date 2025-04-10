import { MemeData } from '../../types/index.js';
type MemeParamsType = MemeData['params_type'];
/** 表情包工具类 */
declare class Tools {
    /**
    * 获取表情包请求基础路径
    * 该方法后续会扩展，为 Rust 版本做准备
    *
    * @returns 返回表情包基础 URL
    * @private
    */
    private static getBaseUrl;
    /**
     * 初始化表情包数据。
     * 如果数据已加载则直接返回，否则从本地或远程加载表情包数据。
     *
     * @returns 无返回值
     */
    static init(): Promise<void>;
    /**
     * 生成本地表情包数据。
     *
     * @param forceUpdate 是否进行全量更新，默认为增量更新
     * @returns 无返回值
     */
    static generateMemeData(forceUpdate?: boolean): Promise<void>;
    /**
     * 生成预设参数数据
     * @returns {Promise<void>}
     */
    static generatePresetData(): Promise<void>;
    /**
     * 生成预设参数数据
     * @returns {Promise<void>}
     */
    generateArgData(): Promise<void>;
    /**
     * 发送表情包相关请求
     * @param endpoint - 请求路径
     * @param params - 请求参数
     * @param responseType - 响应类型，默认为 JSON
     * @returns 返回请求结果
     */
    static request(endpoint: string, params?: Record<string, unknown> | FormData, responseType?: 'json' | 'arraybuffer' | null): unknown;
    /**
     * 获取表情预览地址
     * @param memeKey - 表情包 key
     * @returns 返回表情包预览 URL，如果 memeKey 为空则返回 null
     */
    static getPreviewUrl(memeKey?: string): string | null;
    /**
     * 获取指定关键字的表情包 key
     * @param keyword - 表情包关键字
     * @param type - 可选参数，决定从哪个数据库获取，'meme' 或 'preset'（默认'meme'）
     * @returns {Promise<string | null>} 返回对应的表情包键或 null
     */
    static getKey(keyword: string, type?: string): Promise<string | null>;
    /**
     * 获取指定表情包的关键字
     * @param memeKey - 表情包的唯一标识符
     * @returns 返回表情包关键字数组或 null
     */
    static getKeyWords(memeKey: string): Promise<string[] | null>;
    /**
     * 获取所有的关键词
     * @param type - 可选参数，决定从哪个数据库获取，'meme' 或 'preset'（默认 'meme'）
     * @returns 返回包含所有关键词的数组
     */
    static getAllKeyWords(type?: string): Promise<Array<string>>;
    /**
     * 获取所有的表情包 key
     *
     * @returns 返回所有的表情包 key 数组
     */
    static getAllKeys(): Promise<string[]>;
    /**
     * 获取指定表情包的参数类型
     * @param memeKey - 表情包的唯一标识符
     * @returns - 返回参数类型信息对象或 null
    */
    static getParams(memeKey: string): Promise<MemeParamsType | null>;
    /**
     * 获取指定表情包的标签
     * @param memekey - 表情包的唯一标识符
     * @returns - 返回标签对象或 null
     */
    static getTags(key: string): Promise<Record<string, any> | null>;
    /**
     * 获取指定表情包的默认文本
     * @param memekey - 表情包的唯一标识符
     * @returns - 返回默认文本数组或 null
     */
    static getDeftext(memekey: string): Promise<string[] | null>;
    /**
     * 获取快捷指令信息
     * @param {string} name - 表情包的唯一标识符(快捷指令)
     * @returns {Promise<object|null>} -返回快捷指令信息
     */
    static getPreseInfo(name: string): Promise<object | null>;
    /**
     * 获取所有的快捷指令信息
     * @param memeKey - 表情的键值
     * @returns 返回包含所有关键词的数组
     */
    static gatPresetAllName(memeKey: string): Promise<Array<string>>;
    /**
     * 获取指定表情包的参数描述
     * @param memekey - 表情包的唯一标识符
     * @returns - 返回参数描述对象或 null
     */
    static getParamInfo(memekey: string): Promise<{
        name: string;
        description: string | null;
    }[]>;
    /**
     * 获取指定 key 的参数描述信息
     * @param {string} memekey - 需要获取描述的 key。
     * @returns {object|null} - 返回描述信息
     */
    static getDescriptions(memekey: string): Promise<Record<string, string | null> | null>;
    /**
     * 检查输入是否在禁用表情包列表中
     * @param input - 输入的关键字或表情包键
     * @returns - 如果在禁用列表中返回 true，否则返回 false
     */
    static isBlacklisted(input: string): Promise<boolean>;
    /**
     * 删除指定 key 的表情包
     * @param memekeys - 需要删除的 key，可以是单个或数组
     * @returns 无返回值
     */
    static removeKey(memekeys: string | string[]): Promise<void>;
}
export default Tools;
