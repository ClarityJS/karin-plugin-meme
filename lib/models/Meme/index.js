import FormData from 'form-data';
import { base64, segment } from 'node-karin';
import { Utils } from '../../models/index.js';
import { handleTexts } from './texts.js';
const Meme = {
    async make(e, memekey, userText) {
        const formData = new FormData();
        const texts = handleTexts(e, userText, formData);
        const data = await Utils.Tools.request(memekey, formData, 'POST', 'arraybuffer');
        const basedata = await base64(data.data);
        return e.reply(segment.image(`base64://${basedata}`));
    }
};
export { Meme };
