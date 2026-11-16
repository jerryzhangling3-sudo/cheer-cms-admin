/* Shared, reversible UI translation; business values and event handlers stay intact. */
(() => {
  'use strict';
  if (window.CMS_I18N) return;
  const data = window.CHEER_CMS_I18N_DATA || {pairs:[],manual:[],contexts:{}};
  const key = 'cheer-cms-language';
  let language = localStorage.getItem(key) || localStorage.getItem('cfd-lang') || 'zh';
  language = language === 'en' ? 'en' : 'zh';
  const norm = value => value.replace(/\s+/g, ' ').trim();
  const maps = {zh:new Map(),en:new Map()};
  const file = decodeURIComponent(location.pathname.split('/').pop());
  const pairs = [...data.pairs, ...(file.startsWith('ct-') ? data.contexts[file] || [] : []), ...data.manual];
  pairs.forEach(([zh,en]) => { if(zh && en) { maps.en.set(norm(zh),en); maps.zh.set(norm(en),zh); }});
  const folded = new Map([...maps.zh].map(([a,b])=>[a.toLowerCase(),b]));
  const fragments = {};
  ['zh','en'].forEach(lang => fragments[lang] = [...maps[lang]].filter(([a]) => lang === 'en' && /[\u3400-\u9fff]/.test(a) && a.length >= 2).sort((a,b)=>b[0].length-a[0].length));
  const templates = {zh:[],en:[]};
  const escapeRx = text => text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  ['zh','en'].forEach(lang => maps[lang].forEach((to,from)=>{
    const nums=from.match(/\d+(?:\.\d+)?/g), other=to.match(/\d+(?:\.\d+)?/g);
    if(!nums || JSON.stringify(nums)!==JSON.stringify(other)) return;
    const parts=from.split(/\d+(?:\.\d+)?/g);
    templates[lang].push([new RegExp('^'+parts.map(escapeRx).join('(\\d+(?:\\.\\d+)?)')+'$'),to.split(/\d+(?:\.\d+)?/g)]);
  }));
  function t(value) {
    const source = norm(String(value));
    if(maps[language].has(source)) return maps[language].get(source);
    if(language === 'zh' && folded.has(source.toLowerCase())) return folded.get(source.toLowerCase());
    for(const [regex,parts] of templates[language]) {
      const match=source.match(regex);
      if(match) return parts.map((part,index)=>part+(match[index+1]||'')).join('');
    }
    if(source.endsWith('...') || source.endsWith('…')) {
      const prefix=source.replace(/(?:\.\.\.|…)$/,'');
      for(const [from,to] of maps[language]) if(prefix.length>8 && from.startsWith(prefix)) return to.length>105 ? to.slice(0,102)+'…' : to;
    }
    let result = source;
    if(language === 'en' && /[\u3400-\u9fff]/.test(result)) {
      for(const [from,to] of fragments.en) if(result.includes(from)) result = result.split(from).join(to);
    }
    return result;
  }
  const records = new WeakMap();
  const skip = 'script,style,svg,code,pre,kbd,textarea,[contenteditable], [data-cms-i18n-skip],.adp-name,.article-name,#mcRows td:nth-child(3),#mcRows td:nth-child(4),#mcRows td:nth-child(5),#articlePublicInner,#articlePublicTitle,#articlePublicContent,#articlePreviewTitle,#articlePreviewContent,#mcPreviewTitle,#mcPreviewSummary,#mcPreviewContent';
  function translate(node, attr) {
    const value = attr ? node.getAttribute(attr) : node.nodeValue;
    if(!value || !value.trim()) return;
    let record = records.get(node);
    if(!record) {record = {};records.set(node,record);}
    const id = attr || 'text';
    if(!record[id] || record[id].last !== value) record[id] = {source:value};
    const state = record[id];
    const translated = t(state.source);
    const next = translated === norm(state.source) ? state.source : state.source.match(/^\s*/)[0] + translated + state.source.match(/\s*$/)[0];
    state.last = next;
    if(value !== next) {if(attr) node.setAttribute(attr,next); else node.nodeValue=next;}
  }
  let observer;
  function apply(root = document.body) {
    if(!root) return;
    observer?.disconnect();
    // Labels in old prototypes sometimes also define the option's implicit value.
    const elements = root.nodeType === 1 ? [root,...root.querySelectorAll('*')] : [];
    for(const el of elements) {
      if(el.closest(skip.replace('textarea,',''))) continue;
      if(el.tagName === 'OPTION' && !el.hasAttribute('value')) el.setAttribute('value',el.textContent);
      for(const attr of ['placeholder','title','aria-label']) if(el.hasAttribute(attr)) translate(el,attr);
    }
    const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node = walker.nextNode())) if(node.parentElement && !node.parentElement.closest(skip)) translate(node);
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    observer?.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label']});
  }
  function setLanguage(lang, broadcast = true) {
    language = lang === 'en' ? 'en' : 'zh';
    localStorage.setItem(key,language); localStorage.setItem('cfd-lang',language);
    document.querySelectorAll('[data-cms-validation]').forEach(field=>{field.setCustomValidity('');delete field.dataset.cmsValidation;});
    apply();
    window.dispatchEvent(new CustomEvent('cms-languagechange',{detail:{language}}));
    if(broadcast) document.querySelectorAll('iframe').forEach(frame => {try {frame.contentWindow.CMS_I18N?.setLanguage(language,false);} catch(_) {}});
  }
  window.CMS_I18N = {t,apply,setLanguage,getLanguage:()=>language,sourceOf:node=>records.get(node)?.text?.source || node?.nodeValue};
  for(const name of ['alert','confirm']) {const native=window[name].bind(window);window[name]=message=>native(t(message));}
  window.addEventListener('storage',event=>{if(event.key === key && event.newValue !== language) setLanguage(event.newValue,false);});
  document.addEventListener('invalid',event=>{
    const field=event.target;
    if(!field.validity || field.validity.customError) return;
    const zh=language==='zh';
    if(field.validity.valueMissing) field.setCustomValidity(zh?'请填写此字段。':'Please fill out this field.');
    else if(field.validity.typeMismatch) field.setCustomValidity(zh?'请输入有效的格式。':'Please enter a valid value.');
    else if(field.validity.rangeUnderflow) field.setCustomValidity(zh?`最小值为 ${field.min}。`:`The minimum value is ${field.min}.`);
    else if(field.validity.rangeOverflow) field.setCustomValidity(zh?`最大值为 ${field.max}。`:`The maximum value is ${field.max}.`);
    if(field.validity.customError) field.dataset.cmsValidation='true';
  },true);
  document.addEventListener('input',event=>{if(event.target.dataset.cmsValidation){event.target.setCustomValidity('');delete event.target.dataset.cmsValidation;}},true);
  function ready() {
    localStorage.setItem(key,language);localStorage.setItem('cfd-lang',language);
    let pending=false;
    observer = new MutationObserver(()=>{if(!pending) {pending=true;queueMicrotask(()=>{pending=false;apply();});}});
    apply();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',ready); else ready();
})();
