/**
 * 入口函数：解析 GIF 并提取帧
 * @param image GIF 图像的 Buffer
 * @returns {Buffer[]} 提取出的帧数据
 */
export declare function slice(image: Buffer): Promise<Buffer[]>;
