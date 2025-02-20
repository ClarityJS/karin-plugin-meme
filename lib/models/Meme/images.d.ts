import { Message } from 'node-karin';
/** 文本表情处理 */
export declare function handleImages(e: Message, userText: string, formData: FormData, min_images: number, max_images: number, allUsers: string[]): Promise<{
    success: boolean;
    userText: string;
    message: string;
} | {
    success: boolean;
    userText?: undefined;
    message?: undefined;
}>;
