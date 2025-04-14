import { Model } from '../../models/db/base.js';
export declare const table: import("sequelize").ModelCtor<Model<any, any>>;
/**
 * 添加或更新表情预设记录
 * @param name - 唯一指令标识符（主键）
 * @param key - 表情包键值
 * @param arg_name - 参数名称
 * @param arg_value - 参数值
 * @returns  创建或更新后的记录对象
 */
export declare function add(name: string, key: string, arg_name: string, arg_value: string | number): Promise<Model>;
/**
 * 根据唯一指令标识符获取表情预设记录
 * @param  name - 唯一指令标识符（主键）
 * @returns 找到的记录对象，如果未找到则返回 null
 */
export declare function get(name: string): Promise<Model | null>;
/**
 * 获取所有表情预设记录
 * @returns {} 找到的记录对象数组
 */
export declare function getAll(): Promise<Model[]>;
/**
 * 通过指定字段查询数据（自动识别 JSON、字符串、数值）
 * @param field - 字段名（可能是 JSON 数组、字符串或数值）
 * @param value - 需要匹配的值（支持多个）
 * @param returnField - 返回字段（默认 key）
 * @returns  - 返回符合条件的记录数组
 */
export declare function getByField(field: string, value: string | number | string[] | number[], returnField?: string | string[]): Promise<object[]>;
/**
 * 根据表情包键值获取所有表情预设记录
 * @param  key - 表情包键值
 * @returns  找到的记录对象数组
 */
export declare function getAllByKey(key: string): Promise<Model | Model[]>;
/**
 * 根据参数名称获取所有表情预设记录
 * @param name - 参数名称
 * @returns  找到的记录对象数组
 */
export declare function getAllSelect(name: string): Promise<string[]>;
/**
 * 根据唯一指令标识符删除表情预设记录
 * @param  name - 唯一指令标识符（主键）
 * @returns 删除的记录数量
 */
export declare function remove(name: string): Promise<boolean>;
/**
 * 删除所有表情预设记录
 * @returns 删除操作完成
 */
export declare function removeAll(): Promise<boolean>;
