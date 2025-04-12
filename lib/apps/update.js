import karin, { common, config, getPluginInfo, logger, restart, restartDirect, updateGitPlugin, updatePkg } from 'node-karin';
import { updateRegExp } from '../apps/meme.js';
import { Config, Version } from '../common/index.js';
import { Utils } from '../models/index.js';
async function updateNpmPackage(version, pluginName) {
    const resolve = await updatePkg(pluginName, version);
    return {
        data: resolve.data,
        status: resolve.status
    };
}
async function updateGitRepository(force, pluginPath) {
    const cmd = force
        ? 'git reset --hard HEAD && git pull --rebase'
        : 'git pull';
    const resolve = await updateGitPlugin(pluginPath, cmd);
    return {
        data: resolve.data,
        status: resolve.status
    };
}
export const update = karin.command(/^#?(?:清语表情|clarity-meme)(?:插件)?(?:(强制|预览版))?更新$/i, async (e) => {
    let status = 'failed';
    let data = '';
    const pluginType = getPluginInfo(Version.Plugin_Name)?.type;
    if (pluginType === 'npm') {
        const version = e.msg.includes('预览版') ? 'beta' : 'latest';
        const result = await updateNpmPackage(version, Version.Plugin_Name);
        data = result.data;
        status = result.status;
    }
    else if (pluginType === 'git') {
        const force = e.msg.includes('强制');
        const result = await updateGitRepository(force, Version.Plugin_Path);
        status = result.status;
        data = result.data;
    }
    logger.debug(data);
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
    name: '清语表情:更新',
    priority: -Infinity,
    event: 'message',
    permission: 'master'
});
export const autoUpdatePlugin = Config.other.autoUpdatePlugin && karin.task('自动更新插件', Config.other.autoUpdatePluginCron, async () => {
    let data = '';
    let status = 'failed';
    const botList = karin.getAllBotList();
    const botId = botList[Math.floor(Math.random() * botList.length)].index;
    const bot = karin.getBot(botId);
    const master = config.master()[0];
    const contact = karin.contactFriend(master);
    const pluginType = getPluginInfo(Version.Plugin_Name)?.type;
    if (pluginType === 'npm') {
        const version = 'latest';
        const result = await updateNpmPackage(version, Version.Plugin_Name);
        data = result.data;
        status = result.status;
    }
    else if (pluginType === 'git') {
        const force = false;
        const result = await updateGitRepository(force, Version.Plugin_Path);
        status = result.status;
        data = result.data;
    }
    logger.debug(data);
    await bot.sendForwardMsg(contact, common.makeForward(JSON.stringify(data).slice(1, -1), bot.account.selfId, bot.account.name), { news: [{ text: `更新${Version.Plugin_Name}` }], prompt: `更新${Version.Plugin_Name}`, summary: Version.Plugin_Name, source: '更新插件' });
    if (status === 'ok') {
        try {
            await restartDirect();
            return true;
        }
        catch (error) {
            logger.error(`${Version.Plugin_Name}重启失败，请手动重启以应用更新！`);
        }
    }
    return true;
}, {
    name: Version.Plugin_AliasName,
    log: true
});
export const updateRes = karin.command(/^#?(清语表情|meme(-plugin)?)(强制)?更新(表情包)?(资源|数据)?$/i, async (e) => {
    try {
        if (e.msg.includes('强制')) {
            await Utils.Tools.generateMemeData(true);
        }
        else {
            await Utils.Tools.generateMemeData();
        }
        await updateRegExp();
        await e.reply('表情包数据更新完成');
        logger.mark(logger.chalk.rgb(255, 165, 0)('✅ 表情包数据更新完成 🎉'));
        return true;
    }
    catch (error) {
        await e.reply(`表情包数据更新失败: ${error instanceof Error ? error.message : '未知错误'}`);
        logger.error(`表情包数据更新出错: ${error instanceof Error ? error.message : '未知错误'}`);
        return false;
    }
}, {
    name: '清语表情:更新表情包资源',
    priority: -Infinity,
    event: 'message',
    permission: 'master'
});
export const autoUpdateRes = Config.other.autoUpdateRes && karin.task('自动更新表情包数据', Config.other.autoUpdateResCron, async () => {
    await Utils.Tools.generateMemeData();
    await updateRegExp();
    logger.mark(logger.chalk.rgb(255, 165, 0)('✅ 表情包数据更新完成 🎉'));
    return true;
}, {
    name: Version.Plugin_AliasName,
    log: true
});
