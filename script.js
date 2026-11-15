/* Shared theme preference; system preference is the default. */
(() => {
 const root=document.documentElement, media=matchMedia('(prefers-color-scheme: dark)'), local=location.protocol==='file:';
 const valid=v=>v==='dark'||v==='light'?v:null;
 const stored=()=>{try{return valid(localStorage.getItem('theme'))}catch{return null}};
 const fileChoice=()=>local?valid(new URL(location.href).searchParams.get('theme')):null;
 let explicit=fileChoice()||stored();
 function apply(){
  const theme=explicit||(media.matches?'dark':'light');root.dataset.theme=theme;
  const button=document.querySelector('.theme-toggle');
  if(button){button.setAttribute('aria-pressed',String(theme==='dark'));button.title=theme==='dark'?'Switch to light mode':'Switch to dark mode'}
  if(local&&explicit)document.querySelectorAll('a[href]').forEach(link=>{const raw=link.getAttribute('href');if(!raw||/^(#|https?:|mailto:|\/\/)/i.test(raw))return;const url=new URL(raw,location.href);if(url.protocol!=='file:'||!/\.html?$/i.test(url.pathname))return;url.searchParams.set('theme',explicit);link.href=url.href});
 }
 apply();
 document.addEventListener('DOMContentLoaded',()=>{apply();document.querySelector('.theme-toggle')?.addEventListener('click',()=>{explicit=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('theme',explicit)}catch{}if(local){try{const url=new URL(location.href);url.searchParams.set('theme',explicit);history.replaceState(null,'',url)}catch{}}apply()})});
 media.addEventListener?.('change',()=>{if(!explicit)apply()});
 window.addEventListener('storage',event=>{if(event.key==='theme'){explicit=stored();apply()}});
 window.addEventListener('pageshow',()=>{explicit=fileChoice()||stored()||explicit;apply()});
})();
