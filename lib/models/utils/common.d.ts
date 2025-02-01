import { Message } from 'node-karin';
declare const Common: {
    getAvatar(e: Message, userList: string[]): Promise<Buffer[]>;
};
export default Common;
