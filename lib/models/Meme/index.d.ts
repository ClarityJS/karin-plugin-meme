import { Message } from 'node-karin';
import { BaseType } from '../../types/index.js';
type ArgsType = BaseType['utils']['meme']['params_type']['args_type'];
/**
 * 生成并发送表情图片。
 *
 * @param e - 消息对象，包含消息的详细信息。
 * @param memekey - 用于请求的表情键。
 * @param userText - 用户输入的文本。
 * @param min_texts - 最小文本数量。
 * @param max_texts - 最大文本数量。
 * @param min_images - 最小图片数量。
 * @param max_images - 最大图片数量。
 * @param default_texts - 默认文本数组。
 * @param args_type - 参数类型，定义了额外的参数。
 * @returns Promise<void> - 异步操作，不返回任何内容。
 */
export declare function make(e: Message, memekey: string, min_texts: number, max_texts: number, min_images: number, max_images: number, default_texts: string[] | null, args_type: ArgsType | null, userText?: string): Promise<any>;
export {};
