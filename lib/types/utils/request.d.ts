import { AxiosRequestConfig } from 'node-karin/axios';
export interface RequestType<T> {
    config: AxiosRequestConfig & {
        url: string;
    };
    response: {
        success: boolean;
        data: T;
        message?: string;
    };
}
