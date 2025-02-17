import { Utils } from '../../models/index.js';
/** 文本表情处理 */
export async function handleImages(e, userText, formData, min_images, allUsers) {
    let userAvatars = [];
    if (allUsers.length > 0) {
        const avatarBuffers = await Utils.Common.getAvatar(e, allUsers);
        avatarBuffers.filter(Boolean).forEach((buffer) => {
            userAvatars.push(buffer);
        });
    }
    if (userAvatars.length < min_images) {
        const triggerAvatar = await Utils.Common.getAvatar(e, [e.userId]);
        if (triggerAvatar[0]) {
            userAvatars.unshift(triggerAvatar[0]);
        }
    }
    userAvatars.forEach((buffer, index) => {
        formData.append('images', buffer, `image${index}.png`);
    });
    return {
        success: true
    };
}
