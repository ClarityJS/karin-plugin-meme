import type { RequestType } from '../../types/index.js';
declare class Request {
    private axiosInstance;
    constructor();
    private request;
    get<T>(url: string, params?: Record<string, unknown>, headers?: Record<string, string>, responseType?: 'json' | 'arraybuffer'): Promise<RequestType<T>['response']>;
    head<T>(url: string, params?: Record<string, unknown>, headers?: Record<string, string>): Promise<RequestType<T>['response']>;
    post<T>(url: string, data: Record<string, unknown> | FormData, headers?: Record<string, string>, responseType?: 'json' | 'arraybuffer'): Promise<RequestType<T>['response']>;
    /**
     * 处理错误信息，不直接输出日志，而是返回错误信息
     */
    private handleError;
}
declare const _default: Request;
export default _default;
