/**
 * 判断是否安装了ffmpeg
 * @returns 如果已安装则返回true，否则返回false
 */
export declare function checkFFmpeg(): Promise<boolean>;
/**
 * 检测图片是否是GIF格式
 * @param filePath 图片文件路径或者图片Buffer
 * @returns 如果是GIF图片返回true，否则返回false
*/
export declare function isGifImage(input: Buffer | string): Promise<boolean>;
