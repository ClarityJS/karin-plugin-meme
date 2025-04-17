import { dbType } from '../../types/index.js';
type Model = dbType['stat'];
/**
 * 定义 'stat' 表模型，用于存储 key 和 all 值。
 */
export declare const table: import("sequelize").ModelCtor<import("sequelize").Model<any, any>>;
/**
 * 添加或更新统计信息。如果 key 存在，则更新 all 的值；如果 key 不存在，则创建新的记录。
 *
 * @param key - meme 的 key 值
 * @param all - meme 的 all 值
 * @returns 返回创建或更新的记录
 */
export declare function add(key: string, all: number): Promise<[Model, boolean | null]>;
/**
 * 获取指定统计的信息。
 *
 * @param key - 要查询的 meme 的 key 值
 * @param field - 要查询的字段名 (例如: 'all', 'key')
 * @returns 返回查询到的字段值，如果记录不存在或字段不存在则返回 null
 */
export declare function get(key: string, field: string): Promise<Model | null>;
/**
 * 获取所有统计信息。
 *
 * @returns 返回所有记录的数组
 */
export declare function getAll(): Promise<Model[]>;
export {};
