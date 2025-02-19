import { base64, segment } from 'node-karin';
import { Utils } from '../../models/index.js';
import { handleImages } from './images.js';
import { handleTexts } from './texts.js';
export async function make(e, memekey, userText, min_texts, max_texts, min_images, max_images, default_texts, args_type) {
    const formData = new FormData();
    const atsInMessage = e.elements
        .filter((m) => m.type === 'at')
        .map((at) => at.targetId);
    const manualAts = [...userText.matchAll(/@\s*(\d+)/g)].map((match) => match[1]);
    const allUsers = [...new Set([...atsInMessage, ...manualAts])];
    userText = userText.replace(/@\s*\d+/g, '').trim();
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
        return e.reply(segment.image(`base64://${basedata}`));
    }
    else if (!response.success) {
        return e.reply(response.message);
    }
}
