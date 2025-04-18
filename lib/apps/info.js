import {d as d$1}from'../chunk-DQCC4ROW.js';import {d}from'../chunk-KKWVIVSD.js';import E,{common,segment}from'node-karin';var P=E.command(/^#?(?:(清语)?表情|(?:clarity-)?meme)\s*详情\s*(.+?)$/i,async l=>{if(!d.meme.enable)return  false;let o=(l.msg||"").trim().match(P.reg);if(!o)return;let w=o[2],s=await d$1.Tools.getKey(w)??null,m=s?await d$1.Tools.getParams(s):null;if(!s||!m)return await l.reply("\u672A\u627E\u5230\u76F8\u5173\u8868\u60C5\u5305\u8BE6\u60C5, \u8BF7\u7A0D\u540E\u518D\u8BD5",{reply:true}),true;let{min_texts:y=null,max_texts:T=null,min_images:h=null,max_images:d$2=null}=m,r=await d$1.Tools.getDescriptions(s)??null,g=r?Object.entries(r).map(([e,v])=>`[${e}: ${v}]`).join(" "):null,c=await d$1.Tools.getKeyWords(s)??null,j=c?c.map(e=>`[${e}]`).join(" "):"[\u65E0]",u=await d$1.Tools.gatPresetAllName(s)??null,p=u?.length?u.map(e=>`[${e}]`).join(" "):"[\u65E0]",x=await d$1.Tools.getDeftext(s)??null,b=x?x.map(e=>`[${e}]`).join(" "):"[\u65E0]",$=await d$1.Tools.getTags(s)??null,I=$?$.map(e=>`[${e}]`).join(" "):"[\u65E0]",i=null;try{let e=d$1.Tools.getPreviewUrl(s);e&&(i=await common.base64(e));}catch{}let a=[segment.text(`\u540D\u79F0: ${s}
`),segment.text(`\u522B\u540D: ${j}
`),segment.text(`\u6700\u5927\u56FE\u7247\u6570\u91CF: ${d$2??"\u672A\u77E5"}
`),segment.text(`\u6700\u5C0F\u56FE\u7247\u6570\u91CF: ${h??"\u672A\u77E5"}
`),segment.text(`\u6700\u5927\u6587\u672C\u6570\u91CF: ${T??"\u672A\u77E5"}
`),segment.text(`\u6700\u5C0F\u6587\u672C\u6570\u91CF: ${y??"\u672A\u77E5"}
`),segment.text(`\u9ED8\u8BA4\u6587\u672C: ${b}
`),segment.text(`\u6807\u7B7E: ${I}`)];return g&&a.push(segment.text(`
\u53EF\u9009\u53C2\u6570:
${g}`)),p&&a.push(segment.text(`
\u53C2\u6570\u547D\u4EE4:
${p}`)),i?(a.push(segment.text(`
\u9884\u89C8\u56FE\u7247:
`)),a.push(segment.image(`base64://${i}`))):(a.push(segment.text(`
\u9884\u89C8\u56FE\u7247:
`)),a.push(segment.text("\u9884\u89C8\u56FE\u7247\u52A0\u8F7D\u5931\u8D25"))),await l.reply(a,{reply:true}),true},{name:"\u6E05\u8BED\u8868\u60C5:\u8BE6\u60C5",priority:-1/0,event:"message",permission:"all"});export{P as info};