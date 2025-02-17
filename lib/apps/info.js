import karin, { base64, segment } from 'node-karin';
import { Utils } from '../models/index.js';
export const info = karin.command(/^#?(?:(清语)?表情|(?:clarity-)?meme)\s*详情\s*(.+?)$/i, async (e) => {
    e.bot;
    const match = (e.msg).trim().match(info.reg);
    if (!match)
        return false;
    const memeKey = Utils.Tools.getKey(match[2]);
    if (!memeKey)
        return false;
    const params = Utils.Tools.getParams(memeKey);
    if (!params)
        return false;
    const { min_texts, max_texts, min_images, max_images } = params;
    const keywords = Utils.Tools.getKeywords(memeKey) ?? [];
    let previewImageBase64 = false;
    try {
        const previewUrl = Utils.Tools.getPreviewUrl(memeKey);
        previewImageBase64 = await base64(previewUrl);
    }
    catch {
    }
    const alias = keywords.map(text => `[${text}]`).join('') || '[无]';
    let replyMessage = [
        segment.text(`名称: ${memeKey}\n`),
        segment.text(`别名: ${alias}\n`),
        segment.text(`最大图片数量: ${max_images}\n`),
        segment.text(`最小图片数量: ${min_images}\n`),
        segment.text(`最大文本数量: ${max_texts}\n`),
        segment.text(`最小文本数量: ${min_texts}\n`)
    ];
    if (previewImageBase64) {
        replyMessage.push(segment.text('预览图片:\n'));
        replyMessage.push(segment.image(`base64://${previewImageBase64}`));
    }
    else {
        replyMessage.push(segment.text('预览图片:\n'));
        replyMessage.push(segment.text('预览图片加载失败'));
    }
    await e.reply(replyMessage, { reply: true });
    return true;
}, {
    name: '清语表情:详情',
    priority: -Infinity,
    event: 'message'
});
