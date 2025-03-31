import * as node_karin from 'node-karin';

/**
 * 更新正则
 */
declare const updateRegExp: () => Promise<void>;
/**
 * 表情包命令
 */
declare const meme: node_karin.Command<"message">;
/**
 * 预设命令
 */
declare const preset: node_karin.Command<"message">;

export { meme, preset, updateRegExp };
