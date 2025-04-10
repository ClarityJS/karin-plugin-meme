export interface serverType {
    /** 自定义服务器地址 */
    url: string;
    /** 最大重试次数 */
    retry: number;
    /** 超时时间 */
    timeout: number;
}
