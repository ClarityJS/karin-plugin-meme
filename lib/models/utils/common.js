import Request from './request.js';
const Common = {
    /**
     * 获取图片 Base64 字符串
     * @param {string | Buffer} image - 图片的 URL、Buffer 或 Base64 字符串
     * @param {boolean} withPrefix - 是否添加 base64:// 前缀，默认 false
     * @returns {Promise<string>} - 返回图片的 Base64 字符串，带或不带前缀
     * @throws {Error} - 如果图片地址为空或处理失败，则抛出异常
     */
    async getImageBase64(image, withPrefix = false) {
        if (!image) {
            throw new Error('图片地址不能为空');
        }
        // **如果是 Base64 格式，直接返回**
        if (typeof image === 'string' && image.startsWith('base64://')) {
            return withPrefix ? image : image.replace('base64://', '');
        }
        // **如果是 Buffer，转换为 Base64**
        if (Buffer.isBuffer(image)) {
            const base64Data = image.toString('base64');
            return withPrefix ? `base64://${base64Data}` : base64Data;
        }
        // **如果 image 不是 URL，直接报错**
        if (typeof image !== 'string' || !/^https?:\/\//.test(image)) {
            throw new Error(`Invalid image URL: ${image}`);
        }
        try {
            // **修正 `Request.get` 的 `responseType`，避免数据解析错误**
            const response = await Request.get(image, { responseType: 'arraybuffer' });
            if (!response.data || !(response.data instanceof ArrayBuffer)) {
                throw new Error('请求的图片数据无效');
            }
            const base64Data = Buffer.from(new Uint8Array(response.data)).toString('base64');
            return withPrefix ? `base64://${base64Data}` : base64Data;
        }
        catch (error) {
            throw new Error('获取图片 Base64 失败:');
        }
    }
};
export default Common;
