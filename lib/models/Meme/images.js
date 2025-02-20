import { Utils } from '../../models/index.js';
/** 文本表情处理 */
export async function handleImages(e, userText, formData, min_images, max_images, allUsers) {
    let messageImages = [];
    let userAvatars = [];
    if (allUsers.length > 0) {
        const avatarBuffers = await Utils.Common.getAvatar(e, allUsers);
        avatarBuffers.filter(Boolean).forEach((buffer) => {
            userAvatars.push(buffer);
        });
    }
    const fetchedImages = await Utils.Common.getImage(e);
    messageImages.push(...fetchedImages);
    if (userAvatars.length + messageImages.length < min_images) {
        const triggerAvatar = await Utils.Common.getAvatar(e, [e.userId]);
        if (triggerAvatar[0]) {
            userAvatars.unshift(triggerAvatar[0]);
        }
    }
    const finalImages = [...userAvatars, ...messageImages].slice(0, max_images);
    finalImages.forEach((buffer, index) => {
        const blob = new Blob([buffer], { type: 'image/png' });
        formData.append('images', blob, `image${index}.png`);
    });
    if (finalImages.length < min_images) {
        return {
            success: false,
            userText,
            message: `至少需要${min_images}张图片`
        };
    }
    return {
        success: true
    };
}
