import { Message } from 'node-karin';
import { BaseType } from '../../types/index.js';
type PresetType = BaseType['utils']['preset'];
declare function handleArgs(e: Message, memeKey: string, userText: string, allUsers: string[], formData: FormData, isPreset: boolean, Preset?: PresetType): Promise<{
    success: false;
    message: string | undefined;
    text?: undefined;
} | {
    success: boolean;
    text: string;
    message?: undefined;
}>;
declare function handle(e: Message, key: string, allUsers: string[], args: {
    [s: string]: unknown;
} | ArrayLike<unknown>): Promise<{
    success: boolean;
    message: string;
    argsString?: undefined;
} | {
    success: boolean;
    argsString: string;
    message?: undefined;
}>;
export { handle, handleArgs };
