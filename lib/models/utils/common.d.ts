declare const Common: {
    /**
     * 获取图片 Base64 字符串
     * @param {string | Buffer} image - 图片的 URL、Buffer 或 Base64 字符串
     * @param {boolean} withPrefix - 是否添加 base64:// 前缀，默认 false
     * @returns {Promise<string>} - 返回图片的 Base64 字符串，带或不带前缀
     * @throws {Error} - 如果图片地址为空或处理失败，则抛出异常
     */
    getImageBase64(image: string | Buffer, withPrefix?: boolean): Promise<string>;
};
export default Common;
