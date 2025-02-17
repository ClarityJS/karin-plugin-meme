import { Message } from 'node-karin'
/** 文本表情处理 */
export function handleTexts (e: Message, userText:string, formData: FormData) {
  if (userText) {
    formData.append('texts', userText)
  }
}
