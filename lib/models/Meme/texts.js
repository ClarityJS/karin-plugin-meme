/** 文本表情处理 */
export function handleTexts(e, userText, formData) {
    if (userText) {
        formData.append('texts', userText);
    }
}
