/**
 * 解析 GIF 并提取每一帧为 PNG Buffer 数组，同时返回帧延迟
 * @param image GIF 图像的 Buffer
 * @returns {frames: Buffer[], delays: number[]} 帧数据和每帧的延迟（centiseconds）
 */
export declare function slice(image: Buffer): Promise<{
    frames: Buffer[];
    delays: number[];
}>;
