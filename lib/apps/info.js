import {d}from'../chunk-H7SQZYP6.js';import {e}from'../chunk-RPTR4L7Q.js';import I,{segment,base64,logger}from'node-karin';var b=I.command(/^#?(?:(?:柠糖)?表情)详情\s*(.+)$/i,async p=>{try{if(!e.meme.enable)return !1;let[,a]=p.msg.match(b.reg),f=await d.get_meme_info_by_keyword(a)??await d.get_meme_info(a);if(!f)throw new Error(`\u6CA1\u6709\u627E\u5230\u8BE5\u8868\u60C5${a}\u4FE1\u606F`);let{key:y,keyWords:s,min_images:g,max_images:c,min_texts:l,max_texts:x,default_texts:o,options:i,tags:m}=f,$=await d.get_preset_all_about_keywords_by_key(y),T=typeof s=="string"?JSON.parse(s):Array.isArray(s)?s:[],_=typeof o=="string"?JSON.parse(o):Array.isArray(o)?o:[],A=typeof m=="string"?JSON.parse(m).map(e=>`[${e}]`):Array.isArray(m)?m:[],h=typeof i=="string"?JSON.parse(i):Array.isArray(i)?i:[],u=h.length>0?h.map(e=>`[${e.name}: ${e.description}]`).join(""):null,w=Array.isArray($)?$.map(e=>`[${e}]`).join(" "):null,r=[segment.text(`\u540D\u79F0: ${y}
`),segment.text(`\u522B\u540D: ${T.map(e=>`[${e}]`).join(" ")}
`),segment.text(`\u56FE\u7247\u6570\u91CF: ${g===c?g:`${g} ~ ${c??"[\u672A\u77E5]"}`}
`),segment.text(`\u6587\u672C\u6570\u91CF: ${l===x?l:`${l} ~ ${x??"[\u672A\u77E5]"}`}
`),segment.text(`\u9ED8\u8BA4\u6587\u672C: ${_.length>0?_.join(""):"[\u65E0]"}
`),segment.text(`\u6807\u7B7E: ${A.length>0?A.join(""):"[\u65E0]"}`)];w&&r.push(segment.text(`
\u53EF\u9009\u9884\u8BBE:
${w}`)),u&&r.push(segment.text(`
\u53EF\u9009\u9009\u9879:
${u}`));try{let e=await d.get_meme_preview(y);e&&(r.push(segment.text(`
\u9884\u89C8\u56FE\u7247:
`)),r.push(segment.image(`base64://${await base64(e)}`)));}catch{r.push(segment.text(`
\u9884\u89C8\u56FE\u7247:
`)),r.push(segment.text("\u9884\u89C8\u56FE\u83B7\u53D6\u5931\u8D25"));}await p.reply(r,{reply:!0});}catch(a){logger.error(a),await p.reply(a.message,{reply:true});}},{name:"\u67E0\u7CD6\u8868\u60C5:\u8868\u60C5\u8BE6\u60C5",priority:-1/0,event:"message",permission:"all"});export{b as info};