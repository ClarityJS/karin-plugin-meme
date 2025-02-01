import { logger } from 'node-karin';
import Request from './request.js';
const Common = {
    async getAvatar(e, userList) {
        const avatarPromises = userList.map(async (userId) => {
            try {
                const avatarUrl = await e.bot.getAvatarUrl(userId, 0);
                if (avatarUrl) {
                    const response = await Request.get(avatarUrl, {}, {}, 'arraybuffer');
                    if (response.success) {
                        return Buffer.from(response.data);
                    }
                }
            }
            catch (error) {
                logger.debug(`获取用户 ${userId} 头像失败:`, error);
            }
            return null;
        });
        const avatarsList = await Promise.all(avatarPromises);
        return avatarsList.filter((buffer) => buffer !== null);
    }
};
export default Common;
