import { Message } from 'node-karin';
/** 文本表情处理 */
export declare function handleTexts(e: Message, min_texts: number, max_texts: number, default_texts: string[] | null, allUsers: string[], userText: string, formData: FormData): Promise<{
    success: boolean;
    message: string;
    texts?: undefined;
} | {
    success: boolean;
    texts: string[];
    message?: undefined;
}>;
