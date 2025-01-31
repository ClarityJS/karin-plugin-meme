import FormData from 'form-data';
import { BaseType } from '../../types/index.js';
type RequestType = BaseType['utils']['requset'];
declare class Request {
    private axiosInstance;
    constructor();
    private request;
    get<T>(url: string, params?: Record<string, unknown>, headers?: Record<string, string>, responseType?: 'json' | 'arraybuffer'): Promise<RequestType['response']>;
    post<T>(url: string, data: Record<string, unknown> | FormData, headers?: Record<string, string>, responseType?: 'json' | 'arraybuffer'): Promise<RequestType['response']>;
    private handleError;
}
declare const _default: Request;
export default _default;
