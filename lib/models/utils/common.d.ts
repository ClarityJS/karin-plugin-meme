import { Message } from 'node-karin';
/**
 * 获取用户的头像 Buffer 列表
 * @param {Message} e - 消息对象
 * @param {string[]} userList - 需要获取头像的用户 ID 列表
 * @returns {Promise<Buffer[]>} - 返回头像的 Buffer 数组
 */
export declare function getAvatar(e: Message, userList: string[]): Promise<Buffer[]>;
/**
 * 获取 QQ 用户的昵称。
 *
 * @param e - 消息对象，包含当前对话信息。
 * @param qq - 需要查询昵称的 QQ 号。
 * @returns 返回用户昵称
 *
 */
export declare function getNickname(e: Message, qq: string): Promise<string>;
export declare function getGender(e: Message, qq: string): Promise<string>;
/**
 * 获取消息中的图片（包括直接发送的图片和引用消息中的图片）
 * @param {Message} e - 消息对象
 * @returns {Promise<Buffer[]>} - 返回图片的 Buffer 数组
 */
export declare function getImage(e: Message): Promise<Buffer[]>;
/**
 * 添加或更新统计信息。
 *
 * @param key - 统计项的唯一标识符
 * @param number - 需要添加或更新的数值
 * @returns 返回创建或更新的记录，如果失败则返回 `null`
 */
export declare function addStat(key: string, number: number): Promise<object | null>;
/**
 * 获取指定统计信息的 `all` 值。
 *
 * @param key - 统计项的唯一标识符
 * @returns 返回 `all` 字段的值，如果记录不存在则返回 `null`
 */
export declare function getStat(key: string): Promise<any | null>;
/**
 * 获取所有统计信息。
 *
 * @returns 返回所有统计记录的数组，如果查询失败则返回 `null`
 */
export declare function getStatAll(): Promise<object[] | null>;
