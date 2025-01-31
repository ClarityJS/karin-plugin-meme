import karin from 'node-karin';
import { Config, Render, Version } from '../common/index.js';
import { AdminTypeConfig } from '../models/admin/index.js';
function checkNumberValue(value, limit) {
    const [min, max] = limit.split('-').map(Number);
    return Math.min(Math.max(value, min), max);
}
const createUnifiedRegExp = () => {
    const groupNames = Object.values(AdminTypeConfig)
        .map(group => group.title)
        .join('|');
    const itemNames = Object.values(AdminTypeConfig)
        .flatMap(group => Object.values(group.cfg).map(item => item.title))
        .join('|');
    return new RegExp(`^#清语表情设置\\s*(${groupNames})?\\s*(${itemNames})?\\s*(.*)`);
};
async function renderAndReply(e) {
    const schema = AdminTypeConfig;
    const cfg = Config.All();
    const img = await Render.render('admin/index', {
        title: Version.Plugin_AliasName,
        schema,
        cfg
    });
    await e.reply(img);
}
export const admin = karin.command(createUnifiedRegExp(), async (e) => {
    const regRet = createUnifiedRegExp().exec(e.msg);
    if (!regRet)
        return false;
    const groupTitle = regRet[1];
    const keyTitle = regRet[2];
    const value = regRet[3].trim();
    const groupEntry = Object.entries(AdminTypeConfig).find(([, group]) => group.title === groupTitle);
    const cfgEntry = groupEntry
        ? Object.entries(groupEntry[1].cfg).find(([_, item]) => item.title === keyTitle)
        : null;
    if (!groupEntry || !cfgEntry) {
        await renderAndReply(e);
        return true;
    }
    const [groupName] = groupEntry;
    const [cfgKey, cfgItem] = cfgEntry;
    switch (cfgItem.type) {
        case 'boolean': {
            const isOn = value === '开启';
            Config.Modify(groupName, cfgKey, isOn);
            break;
        }
        case 'number': {
            const number = checkNumberValue(Number(value), cfgItem.limit ?? '0-0');
            Config.Modify(groupName, cfgKey, number);
            break;
        }
        case 'string': {
            Config.Modify(groupName, cfgKey, value);
            break;
        }
        case 'array': {
            const list = value.split(',').map(v => v.trim());
            Config.Modify(groupName, cfgKey, list);
            break;
        }
    }
    await renderAndReply(e);
    return true;
}, {
    name: '清语表情:设置',
    priority: -Infinity,
    event: 'message',
    permission: 'all'
});
