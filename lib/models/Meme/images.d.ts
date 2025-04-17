import { Message } from 'node-karin';
/** 文本表情处理 */
export declare function handleImages(e: Message, min_images: number, max_images: number, allUsers: string[], userText: string, formData: FormData): Promise<{
    success: boolean;
    userText: string;
    message: string;
} | {
    success: boolean;
    userText?: undefined;
    message?: undefined;
}>;
