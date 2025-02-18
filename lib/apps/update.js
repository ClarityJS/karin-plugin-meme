import karin, { common, getPluginInfo, logger, restart, updateGitPlugin, updatePkg } from 'node-karin';
import { Version } from '../common/index.js';
export const update = karin.command(/^#?(?:(清语)?表情|(?:clarity-)?meme)测试$/i, async (e) => {
    let status = 'failed';
    let data = '';
    const pluginType = getPluginInfo(Version.Plugin_Name)?.type;
    if (pluginType === 'npm') {
        if (e.msg.includes('预览版')) {
            const resolve = await updatePkg(Version.Plugin_Name, 'beta');
            data = resolve.data;
            status = resolve.status;
        }
        else {
            const resolve = await updatePkg(Version.Plugin_Name, 'latest');
            data = resolve.data;
            status = resolve.status;
        }
    }
    else if (pluginType === 'git') {
        let cmd = 'git pull';
        if (e.msg.includes('强制')) {
            cmd = 'git reset --hard HEAD && git pull --rebase';
        }
        const resolve = await updateGitPlugin(Version.Plugin_Path, cmd);
        status = resolve.status;
        data = resolve.data;
    }
    logger.info(data);
    await e.bot.sendForwardMsg(e.contact, common.makeForward(JSON.stringify(data).slice(1, -1), e.bot.account.selfId, e.bot.account.name), { news: [{ text: `更新${Version.Plugin_Name}` }], prompt: `更新${Version.Plugin_Name}`, summary: Version.Plugin_Name, source: '更新插件' });
    if (status === 'ok') {
        try {
            await e.reply(`\n更新完成，开始重启 本次运行时间：${common.uptime()}`, { at: true });
            await restart(e.selfId, e.contact, e.messageId);
            return true;
        }
        catch (error) {
            await e.reply(`${Version.Plugin_Name}重启失败，请手动重启以应用更新！`);
        }
    }
    return true;
}, {
    name: '清语表情:测试',
    priority: -Infinity,
    event: 'message'
});
