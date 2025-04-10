/**
 * 调整 GIF 速度
 * @param image GIF Buffer
 * @param speed 速度倍率，必须大于 0
 * @returns 处理后的 GIF Buffer
 */
export declare function gearshift(image: Buffer, speed: number): Promise<Buffer>;
