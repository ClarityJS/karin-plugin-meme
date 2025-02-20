import { base64 } from 'node-karin';
import { Utils } from '../../models/index.js';
import { handleImages } from './images.js';
import { handleTexts } from './texts.js';
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
export async function make(e, memekey, min_texts, max_texts, min_images, max_images, default_texts, args_type, userText) {
    const formData = new FormData();
    let allUsers = [];
    if (userText) {
        const atsInMessage = e.elements
            .filter((m) => m.type === 'at')
            .map((at) => at.targetId);
        const manualAts = [...userText.matchAll(/@\s*(\d+)/g)].map((match) => match[1]);
        allUsers = [...new Set([...atsInMessage, ...manualAts])];
        userText = userText.replace(/@\s*\d+/g, '').trim();
    }
    else {
        userText = '';
    }
    /** 处理图片表情 */
    if (max_images !== 0) {
        await handleImages(e, userText, formData, min_images, allUsers);
    }
    /** 处理文字表情 */
    if (max_texts !== 0) {
        handleTexts(e, userText, formData);
    }
    const response = await Utils.Tools.request(memekey, formData, 'arraybuffer');
    if (response.success) {
        const basedata = await base64(response.data);
        return `base64://${basedata}`;
    }
    else {
        throw new Error(response.message);
    }
}
