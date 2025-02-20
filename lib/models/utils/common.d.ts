import { Message } from 'node-karin';
/**
 * 获取用户的头像 Buffer 列表
 * @param {Message} e - 消息对象
 * @param {string[]} userList - 需要获取头像的用户 ID 列表
 * @returns {Promise<Buffer[]>} - 返回头像的 Buffer 数组
 */
export declare function getAvatar(e: Message, userList: string[]): Promise<Buffer[]>;
/**
 * 获取消息中的图片（包括直接发送的图片和引用消息中的图片）
 * @param {Message} e - 消息对象
 * @returns {Promise<Buffer[]>} - 返回图片的 Buffer 数组
 */
export declare function getImage(e: Message): Promise<Buffer[]>;
