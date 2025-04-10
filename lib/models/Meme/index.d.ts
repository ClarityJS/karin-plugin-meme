import { Message } from 'node-karin';
import { handle, handleArgs } from '../../models/Meme/args.js';
import { handleImages } from '../../models/Meme/images.js';
import { preset } from '../../models/Meme/preset.js';
import { handleTexts } from '../../models/Meme/texts.js';
import type { PresetType } from '../../types/index.js';
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
 * @param isPreset - 是否使用预设。
 * @param Preset - 预设对象。
 * @returns 返回base64编码的图片数据。
 */
export declare function make(e: Message, memekey: string, min_texts: number, max_texts: number, min_images: number, max_images: number, default_texts: string[] | null, args_type: any | null, userText?: string, isPreset?: boolean, { Preset }?: {
    Preset?: PresetType;
}): Promise<string>;
export { handle, handleArgs, handleImages, handleTexts, preset };
