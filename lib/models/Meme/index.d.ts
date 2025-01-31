import { Message } from 'node-karin';
declare const Meme: {
    make(e: Message, memekey: string, userText: string): Promise<import("node-karin").SendMsgResults>;
};
export { Meme };
