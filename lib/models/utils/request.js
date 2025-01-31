import axiosRetry from 'axios-retry';
import FormData from 'form-data';
import { logger } from 'node-karin';
import axios from 'node-karin/axios';
import { Config, Version } from '../../common/index.js';
class Request {
    axiosInstance;
    constructor() {
        this.axiosInstance = axios.create({
            timeout: Config.server.timeout * 1000
        });
        /**
         * 配置重试机制
         */
        axiosRetry(this.axiosInstance, {
            retries: Config.server.retry,
            retryDelay: () => 0,
            shouldResetTimeout: true,
            retryCondition: (error) => {
                if (error.response) {
                    return error.response.status === 500;
                }
                return axiosRetry.isNetworkOrIdempotentRequestError(error);
            }
        });
    }
    async request(config) {
        try {
            const response = await this.axiosInstance.request(config);
            if (config.responseType === 'arraybuffer') {
                return {
                    success: true,
                    data: Buffer.from(response.data)
                };
            }
            return {
                success: true,
                data: response.data
            };
        }
        catch (error) {
            this.handleError(error);
            return {
                success: false,
                data: {},
                message: error.message
            };
        }
    }
    // GET 请求
    async get(url, params, headers, responseType = 'json') {
        return this.request({
            url,
            method: 'GET',
            params,
            headers,
            responseType
        });
    }
    // POST 请求
    async post(url, data, headers, responseType = 'json') {
        const isFormData = data instanceof FormData;
        return this.request({
            url,
            method: 'POST',
            data,
            headers: {
                ...headers,
                ...(isFormData ? data.getHeaders() : {})
            },
            responseType
        });
    }
    handleError(error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const errorMessage = status === 502
                ? '网络错误'
                : typeof error.response?.data === 'string'
                    ? error.response?.data
                    : JSON.stringify(error.response?.data) || '未知错误';
            logger.error(`[${Version.Plugin_AliasName}] 请求错误, 状态码: ${status ?? null}, 错误信息: ${errorMessage}`);
        }
        else {
            logger.error(`[${Version.Plugin_AliasName}] 请求异常: ${error}`);
        }
    }
}
export default new Request();
