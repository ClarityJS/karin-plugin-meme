import karin, { common, exec, getCommit, getHash, getPkgVersion, getPluginInfo, getRemotePkgVersion, getTime, restart, segment } from 'node-karin';
import { Version } from '../common/index.js';
export const update = karin.command(/^#?(?:清语表情|clarity-meme)(?:插件)?(?:(强制|预览版))?更新$/i, async (e) => {
    let msg = [];
    let commit = '';
    let cmd = '';
    let localVersion;
    let remoteVersion;
    try {
        await e.reply('正在执行更新中...');
        const pluginType = getPluginInfo(Version.Plugin_Name)?.type;
        if (pluginType === 'npm') {
            localVersion = await getPkgVersion(Version.Plugin_Name);
            if (e.msg.includes('预览版')) {
                remoteVersion = await getRemotePkgVersion(Version.Plugin_Name, 'beta');
                cmd = `pnpm up ${Version.Plugin_Name}@beta`;
            }
            else {
                remoteVersion = await getRemotePkgVersion(Version.Plugin_Name, 'latest');
                cmd = `pnpm up ${Version.Plugin_Name}`;
            }
        }
        else if (pluginType === 'git') {
            const branch = (await exec('git rev-parse --abbrev-ref HEAD', { cwd: Version.Plugin_Path })).stdout.trim();
            localVersion = await getHash(Version.Plugin_Path, true);
            await exec(`git fetch origin/${branch}`, { cwd: Version.Plugin_Path });
            remoteVersion = (await exec(`git rev-parse --short origin/${branch}`, { cwd: Version.Plugin_Path })).stdout.trim();
            if (localVersion === remoteVersion && !e.msg.includes('强制')) {
                const time = await getTime(Version.Plugin_Path);
                msg = [
                    segment.text(`${Version.Plugin_Name} 已经是最新版本`),
                    segment.text(`最后更新时间: ${time}`)
                ];
                await e.bot.sendForwardMsg(e.contact, common.makeForward(msg, e.bot.account.selfId, e.bot.account.name), { news: [{ text: `更新${Version.Plugin_Name}` }], prompt: `更新${Version.Plugin_Name}`, summary: Version.Plugin_Name, source: '更新插件' });
                return true;
            }
            if (e.msg.includes('强制')) {
                cmd = `git reset --hard origin/${branch} && git pull --rebase`;
            }
            else {
                cmd = 'git pull';
            }
            commit = await getCommit({ path: Version.Plugin_Path, count: 1, hash: localVersion, branch });
        }
        if (cmd) {
            const updateResult = await exec(cmd, { cwd: Version.Plugin_Path });
            if (updateResult.stderr) {
                msg = [
                    segment.text(`${Version.Plugin_Name} 更新失败: ${updateResult.stderr}`)
                ];
            }
            else {
                msg = [
                    segment.text(`${Version.Plugin_Name} 更新成功`),
                    segment.text(`更新日志: ${commit}`)
                ];
            }
        }
        await e.bot.sendForwardMsg(e.contact, common.makeForward(msg, e.bot.account.selfId, e.bot.account.name), { news: [{ text: `更新${Version.Plugin_Name}` }], prompt: `更新${Version.Plugin_Name}`, summary: Version.Plugin_Name, source: '更新插件' });
        try {
            await e.reply(`\n更新完成，开始重启 本次运行时间：${common.uptime()}`);
            await restart(e.bot.selfId, e.contact, e.messageId);
        }
        catch (error) {
            await e.reply(`${Version.Plugin_Name}重启失败，请手动重启以应用更新！`);
            return true;
        }
        return true;
    }
    catch (error) {
        await e.reply(`${Version.Plugin_Name} 更新失败: ${error instanceof Error ? error.message : '未知错误'}`);
        return true;
    }
}, {
    name: '清语表情:更新',
    priority: -Infinity,
    event: 'message',
    permission: 'master'
});
