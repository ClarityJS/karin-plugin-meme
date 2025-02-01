import { Message } from 'node-karin';
import { BaseType } from '../../types/index.js';
type ArgsType = BaseType['utils']['meme']['params_type']['args_type'];
declare const Meme: {
    make(e: Message, memekey: string, userText: string, min_texts: number, max_texts: number, min_images: number, max_images: number, default_texts: string[], args_type: ArgsType): Promise<import("node-karin").SendMsgResults | undefined>;
};
export { Meme };
