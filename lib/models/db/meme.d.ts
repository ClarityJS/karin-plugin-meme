import { BaseType } from '../../types/index.js';
type MemeData = BaseType['utils']['meme'];
/**
 * 定义 `meme` 表（包含 JSON 数据存储、关键字、参数、标签等）。
 */
export declare const table: import("sequelize").ModelCtor<import("sequelize").Model<any, any>>;
/**
 * 添加或更新表情包记录。
 *
 * @param key - 表情包的唯一标识符
 * @param info - 存储表情包的基本信息（JSON 格式）
 * @param keyWords - 表情包的关键字（JSON 数组），如果没有提供，传 `null`
 * @param params - 表情包的参数（JSON 格式），如果没有提供，传 `null`
 * @param min_texts - 表情包的最小文本数量
 * @param max_texts - 表情包的最大文本数量
 * @param min_images - 表情包的最小图片数量
 * @param max_images - 表情包的最大图片数量
 * @param defText - 默认文本数组（可选），如果没有提供，传 `null`
 * @param args_type - 参数类型（JSON 格式，可选），如果没有提供，传 `null`
 * @param shortcuts - 表情包的快捷方式（JSON 格式，可选），如果没有提供，传 `null`
 * @param tags - 表情包的标签（JSON 数组，可选），如果没有提供，传 `null`
 * @param options - 选项对象，包含 `force` 属性来控制是否全量更新（默认为 `false`，表示增量更新）
 * @returns 返回创建或更新的表情包记录对象
 * @throws 如果数据库操作失败，抛出错误
 */
export declare function add(key: string, info: MemeData, keyWords: MemeData['keywords'], params: MemeData['params_type'], min_texts: MemeData['params_type']['min_texts'], max_texts: MemeData['params_type']['max_texts'], min_images: MemeData['params_type']['min_images'], max_images: MemeData['params_type']['max_images'], defText: MemeData['params_type']['default_texts'], args_type: MemeData['params_type']['args_type'], shortcuts: MemeData['shortcuts'], tags: MemeData['tags'], { force }: {
    force?: boolean | undefined;
}): Promise<import("sequelize").Model<any, any> | undefined>;
/**
 * 通过 key 查询表情包数据。
 *
 * @param key - 唯一标识符
 * @returns 返回查询到的记录或 `null`
 */
export declare function get(key: string): Promise<import("sequelize").Model<any, any> | null>;
/**
 * 通过 key 查询指定字段的值。
 *
 * @param key - 表情包的唯一标识符
 * @param name - 需要查询的字段（支持单个或多个字段）
 * @returns 返回查询到的数据或 `null`
 */
export declare function getByKey(key: string, name?: string | string[]): Promise<any>;
/**
 * 通过指定字段查询数据（自动识别 JSON、字符串、数值）。
 *
 * @param field - 字段名（可能是 JSON 数组、字符串或数值）
 * @param value - 需要匹配的值（支持多个）
 * @param returnField - 返回字段（默认 `key`）
 * @returns 返回符合条件的记录数组
 */
export declare function getByField(field: string, value: string | number | string[] | number[], returnField?: string | string[]): Promise<any[]>;
/**
 * 通过字段名查询所有不同的值。
 *
 * @param name - 需要查询的字段
 * @returns 返回该字段的所有值数组
 */
export declare function getAllSelect(name: string): Promise<any[]>;
/**
 * 获取所有记录。
 *
 * @returns 返回所有记录的数组
 */
export declare function getAll(): Promise<import("sequelize").Model<any, any>[]>;
/**
 * 删除指定 `key` 的表情包记录。
 *
 * @param key - 需要删除的表情包的唯一标识符
 * @returns 如果成功删除返回 `true`，否则返回 `false`
 */
export declare function remove(key: string): Promise<boolean>;
export {};
