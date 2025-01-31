import karin from 'node-karin';
import { Utils } from '../models/index.js';
export const test = karin.command(/^#清语表情测试$/, async (e) => {
    const info = Utils.Tools.getInfo('wechat_pay');
    await e.reply(JSON.stringify(info));
});
