import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { slides, sources } from '../slides.mjs';

const require = createRequire(import.meta.url);
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const textOnly = s => s.replaceAll(/<[^>]*>/g, ' ').replaceAll(/\s+/g, ' ').trim();
const page = (s, i, body=s.html) => `<div class="deck-canvas ${s.kind||''}">${body}<div class="page-number">${String(i+1).padStart(2,'0')} / 10</div></div>`;
const revealSteps = html => html.replace(/<[^>]+data-step="(\d+)"[^>]*>/g, (tag, index) => {
  tag=tag.replace(/ data-step="\d+"/,` data-fragment-index="${index}"`);
  return /class="/.test(tag) ? tag.replace(/class="([^"]*)"/,'class="$1 fragment"') : tag.replace(/>$/,' class="fragment">');
});
const r = JSON.parse(await fs.readFile(path.join(dir,'results.json'),'utf8'));
const config = JSON.parse(await fs.readFile(path.join(dir,'demo-config.json'),'utf8'));
for (const who of ['llm','jev']) {
  const row=r[who]||{};
  const vals={
    decision:row.decision,
    latency:Number.isFinite(row.median_latency_ms) ? `${row.median_latency_ms.toLocaleString('en-US')} ms` : null,
    tokens:Number.isFinite(row.mean_input_tokens)&&Number.isFinite(row.mean_output_tokens) ? `${row.mean_input_tokens.toLocaleString('en-US')} / ${row.mean_output_tokens.toLocaleString('en-US')}` : null,
    errors:Number.isInteger(row.errors)&&Number.isInteger(row.parsing_failures)&&Number.isInteger(row.requests) ? `${row.errors} / ${row.parsing_failures} (${row.requests}회)` : null,
  };
  for(const [key,value] of Object.entries(vals)) if(value!==null && value!==undefined) slides[9].html=slides[9].html.replace(new RegExp(`(<td data-metric="${who}\\.${key}">)[^<]*(</td>)`), `$1${esc(value)}$2`);
}
if(r.status==='measured') {
  const valid=['llm','jev'].every(k=>Number.isFinite(r[k]?.median_latency_ms)&&Number.isInteger(r[k]?.requests)&&r[k]?.requests>0);
  if(!valid) throw new Error('measured status requires real nonzero request counts and measured latency for both routers');
  slides[9].html=slides[9].html.replace(/(<p class="result-status" data-results-status>)[^<]*(<\/p>)/, `$1${esc(r.conditions)}$2`);
}
if(config.cliCommand) slides[8].notes += `\n실제 CLI 실행 명령: ${config.cliCommand}`;

const assets=path.join(dir,'assets');
await fs.mkdir(path.join(assets,'fonts'),{recursive:true});
let fontCss='';
for(const [pkg,styles] of [['@fontsource/noto-sans-kr',['400.css','700.css']],['@fontsource/jetbrains-mono',['latin-400.css','latin-700.css']]]) {
  const root=path.dirname(require.resolve(`${pkg}/package.json`));
  for(const style of styles) {
    let css=await fs.readFile(path.join(root,style),'utf8');
    for(const m of css.matchAll(/\.\/files\/([^')]+\.woff2)/g)) await fs.copyFile(path.join(root,'files',m[1]),path.join(assets,'fonts',m[1]));
    css=css.replaceAll(/,\s*url\([^)]*\.woff['"]?\)\s*format\(['"]woff['"]\)/g,'');
    css=css.replaceAll('./files/','./fonts/');
    fontCss+=css+'\n';
  }
  try {await fs.copyFile(path.join(root,'LICENSE'),path.join(assets,'fonts',`${pkg.split('/')[1]}-LICENSE`));}catch{}
}
await fs.writeFile(path.join(assets,'fonts.css'),fontCss);

const revealRoot=path.resolve(path.dirname(require.resolve('reveal.js')),'..');
const vendor=path.join(dir,'reveal','vendor');
await fs.mkdir(vendor,{recursive:true});
for(const name of ['reveal.js','reveal.css','reset.css']) await fs.copyFile(path.join(revealRoot,'dist',name),path.join(vendor,name));
await fs.mkdir(path.join(vendor,'notes'),{recursive:true});
await fs.copyFile(require.resolve('reveal.js/plugin/notes'),path.join(vendor,'notes','notes.js'));
await fs.copyFile(path.join(revealRoot,'LICENSE'),path.join(vendor,'LICENSE'));
const notes = s => esc(s.notes)+ '\n\n출처:\n'+s.refs.map(k=>sources[k].join('\n')).join('\n\n');
const reveal = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Jev · reveal.js</title><link rel="stylesheet" href="vendor/reset.css"><link rel="stylesheet" href="vendor/reveal.css"><link rel="stylesheet" href="assets/fonts.css"><link rel="stylesheet" href="assets/deck.css"><style>html,body,.reveal-viewport{background:#111311}.reveal .slides{text-align:left}.reveal .slides>section{padding:0}.reveal .slides>section.present{display:block}.reveal .controls{color:#e9af72}.reveal .progress{color:#e9af72}.reveal .slides section .fragment{transition:opacity .35s ease}.reveal .slides section .fragment.visible{opacity:1}.reveal .slides section .fragment:not(.visible){opacity:0} .reveal aside.notes{display:none}</style></head><body><div class="reveal"><div class="slides">${slides.map((s,i)=>`<section>${page(s,i,revealSteps(s.html))}<aside class="notes">${notes(s)}</aside></section>`).join('\n')}</div></div><script src="vendor/reveal.js"></script><script src="vendor/notes/notes.js"></script><script>Reveal.initialize({width:1280,height:720,margin:0.035,minScale:0.1,maxScale:2,center:false,hash:true,transition:'fade',backgroundTransition:'none',controls:true,controlsTutorial:false,progress:true,keyboard:true,slideNumber:false,plugins:[RevealNotes],pdfSeparateFragments:false});</script></body></html>`;
await fs.writeFile(path.join(dir,'reveal','index.html'),reveal);
await fs.cp(assets,path.join(dir,'reveal','assets'),{recursive:true});

await fs.mkdir(path.join(dir,'slidev','public'),{recursive:true});
await fs.cp(assets,path.join(dir,'slidev','public','assets'),{recursive:true});
let slidev=`---\ntheme: none\ntitle: Jev와 의사결정 모델\ninfo: 15분 발표와 Agent Router CLI 비교 데모\nauthor: Jev · Agent Router\ncanvasWidth: 1280\naspectRatio: 16/9\nrouterMode: hash\nfonts:\n  provider: none\n  sans: Noto Sans KR\n  mono: JetBrains Mono\ncolorSchema: dark\ntransition: fade\ndrawings:\n  enabled: false\nrecord: false\nprint: true\nwakeLock: false\ndownload: false\nexportFilename: jev-slidev\nhtmlAttrs:\n  lang: ko\ndefaults:\n  layout: none\n---\n\n`;
slidev+=slides.map((s,i)=>`${i?'---\nlayout: none\n---\n\n':''}${page(s,i,s.html.replaceAll(/data-step="\d+"/g,'v-click')).replaceAll('\n','&#10;')}\n\n<!--\n${s.notes}\n\n출처:\n${s.refs.map(k=>sources[k].join('\n')).join('\n\n')}\n-->\n`).join('\n');
await fs.writeFile(path.join(dir,'slidev','slides.md'),slidev);
await fs.writeFile(path.join(dir,'slidev','style.css'),`@import './public/assets/fonts.css';\n@import './public/assets/deck.css';\nhtml,body,#app{background:#111311;color:#f2f0e8}\n.slidev-layout{padding:0!important}.slidev-page .deck-canvas{position:absolute;inset:0}.slidev-vclick-hidden{opacity:0!important}.slidev-vclick-target{transition:opacity .35s ease}.slidev-code{background:none!important}\n`);
await fs.writeFile(path.join(dir,'content.md'),`# Jev와 의사결정 모델\n\n표지 포함 10장 · 15분 · 자료 확인 2026-09-30\n\n이 자료의 Agent Router는 합의된 설계이며 실제 repo/측정 로그는 제공되지 않았습니다. 최종 데모 명령과 결과는 확인 후 업데이트합니다.\n\n${slides.map((s,i)=>`## ${i+1}. ${s.title} (${s.time})\n\n${textOnly(s.html)}\n\n### 발표자 노트\n\n${s.notes}\n\n### 출처\n\n${s.refs.length?s.refs.map(k=>`- [${sources[k][0]}](${sources[k][1]})`).join('\n'):'- 사용자와 합의한 발표·데모 설계'}\n`).join('\n')}`);
await fs.writeFile(path.join(dir,'source-register.json'),JSON.stringify({checkedAt:'2026-09-30',sources,slides:slides.map((s,i)=>({number:i+1,title:s.title,seconds:s.seconds,refs:s.refs}))},null,2));

const printHtml=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>Jev · Print</title><link rel="stylesheet" href="../assets/fonts.css"><link rel="stylesheet" href="../assets/deck.css"><style>@page{size:1280px 720px;margin:0}html,body{padding:0;margin:0;background:#111311}.deck-canvas{break-after:page;page-break-after:always}.deck-canvas:last-child{break-after:auto}[data-step]{opacity:1!important}</style></head><body>${slides.map((s,i)=>page(s,i)).join('\n')}</body></html>`;
await fs.mkdir(path.join(dir,'print'),{recursive:true});
await fs.writeFile(path.join(dir,'print','index.html'),printHtml);

// A fully self-contained reveal deck for double-clicking or opening from chat.
let standalone=reveal.replace(/<link rel="stylesheet" href="vendor\/reset.css">/,`<style>${await fs.readFile(path.join(vendor,'reset.css'),'utf8')}</style>`).replace(/<link rel="stylesheet" href="vendor\/reveal.css">/,`<style>${await fs.readFile(path.join(vendor,'reveal.css'),'utf8')}</style>`);
const embedFonts=async css=>{for(const m of css.matchAll(/url\(['"]?\.\/fonts\/([^)'"\s]+)['"]?\)/g)){const bytes=await fs.readFile(path.join(assets,'fonts',m[1]));css=css.replaceAll(m[0],`url('data:font/woff2;base64,${bytes.toString('base64')}')`);}return css;};
standalone=standalone.replace('<link rel="stylesheet" href="assets/fonts.css">',`<style>${await embedFonts(fontCss)}</style>`).replace('<link rel="stylesheet" href="assets/deck.css">',`<style>${await fs.readFile(path.join(assets,'deck.css'),'utf8')}</style>`);
standalone=standalone.replace('<script src="vendor/reveal.js"></script>',()=>`<script>${''}</script>`); // replace below to avoid replacement-string metacharacters
const revealJs=await fs.readFile(path.join(vendor,'reveal.js'),'utf8');
standalone=standalone.replace('<script></script>',()=>`<script>${revealJs.replaceAll('</script','<\\/script')}</script>`).replace('<script src="vendor/notes/notes.js"></script>','').replace('plugins:[RevealNotes]','plugins:[]');
standalone=standalone.replace('</body>','<script>window.addEventListener("keydown",e=>{if(e.key.toLowerCase()==="n"){const s=Reveal.getCurrentSlide();let p=document.getElementById("local-notes");if(p){p.remove();return;}p=document.createElement("div");p.id="local-notes";p.style.cssText="position:fixed;z-index:1000;inset:12% 10%;padding:32px;background:#20251f;color:#f2f0e8;overflow:auto;white-space:pre-wrap;font:20px/1.8 sans-serif;border:1px solid #e9af72";p.textContent=s.querySelector("aside.notes").textContent;p.onclick=()=>p.remove();document.body.append(p);}});</script></body>');
await fs.writeFile(path.join(dir,'reveal-standalone.html'),standalone);
console.log(`Generated ${slides.length} slides; ${slides.reduce((n,s)=>n+s.seconds,0)} seconds; reveal.js + Slidev + print + standalone.`);
