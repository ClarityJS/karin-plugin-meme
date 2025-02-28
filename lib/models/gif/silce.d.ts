/**
 * 解析 GIF 并提取每一帧为 PNG Buffer 数组
 * @param image GIF 图像的 Buffer
 * @returns 每一帧对应的 PNG Buffer 数组
 */
export declare function slice(image: Buffer): Promise<Buffer[]>;
