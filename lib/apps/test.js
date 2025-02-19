import karin from 'node-karin';
import { Utils } from '../models/index.js';
export const test = karin.command(/^#?(?:(清语)?表情|(?:clarity-)?meme)测试$/i, async (e) => {
    const all = await Utils.Tools.getKey('骑');
    console.log(all);
    return true;
}, {
    name: '清语表情:测试',
    priority: -Infinity,
    event: 'message'
});
