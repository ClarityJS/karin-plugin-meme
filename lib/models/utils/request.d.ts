import FormData from 'form-data';
import { BaseType } from '../../types/index.js';
type RequestType = BaseType['utils']['requset'];
declare class Request {
    private axiosInstance;
    constructor();
    private request;
    get<T>(url: string, params?: Record<string, unknown>, headers?: Record<string, string>, responseType?: 'json' | 'arraybuffer'): Promise<RequestType['response']>;
    head<T>(url: string, params?: Record<string, unknown>, headers?: Record<string, string>): Promise<RequestType['response']>;
    post<T>(url: string, data: Record<string, unknown> | FormData, headers?: Record<string, string>, responseType?: 'json' | 'arraybuffer'): Promise<RequestType['response']>;
    /**
     * 处理错误信息，不直接输出日志，而是返回错误信息
     */
    private handleError;
}
declare const _default: Request;
export default _default;
