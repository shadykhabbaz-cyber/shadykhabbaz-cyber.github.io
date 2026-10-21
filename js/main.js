(()=>{const EN=document.documentElement.lang==='en',$=s=>document.querySelector(s);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
// header: przezroczysty nad hero, pełny po przewinięciu
const h=$('#hdr');if(h&&!h.classList.contains('solid')){const f=()=>h.classList.toggle('scrolled',scrollY>40);addEventListener('scroll',f,{passive:true});f();}
// pułapka fokusu
const trap=(box,e)=>{if(e.key!=='Tab')return;const f=[...box.querySelectorAll('a[href],button:not([disabled])')].filter(x=>x.offsetParent!==null);if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}};
// pełnoekranowe menu mobilne
const mb=$('.menu-btn'),m=$('#menu');if(mb&&m){const x=m.querySelector('.menu-x');
 const open=()=>{m.hidden=false;mb.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';(m.querySelector('[aria-current]')||m.querySelector('nav a')).focus();};
 const close=()=>{m.hidden=true;mb.setAttribute('aria-expanded','false');document.body.style.overflow='';mb.focus();};
 mb.addEventListener('click',()=>m.hidden?open():close());x.addEventListener('click',close);
 m.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}else trap(m,e);});
 m.addEventListener('click',e=>{if(e.target.closest('a[href^="#"]'))close();});}
// filtry portfolio (elementy są w statycznym HTML; JS tylko filtruje)
const F=$('.filters'),G=$('#gal');
if(F&&G){F.classList.remove('nojs');const st={style:'',artist:''},items=[...G.children],cnt=$('#count');
 const apply=()=>{let k=0;items.forEach(li=>{const ok=(!st.style||li.dataset.style===st.style)&&(!st.artist||li.dataset.artist===st.artist);li.hidden=!ok;if(ok)k++;});
  if(cnt)cnt.textContent=k+' '+(EN?(k===1?'work':'works'):(k===1?'praca':(k%10>=2&&k%10<=4&&(k%100<12||k%100>14))?'prace':'prac'));F.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',String(st[c.dataset.k]===c.dataset.v)));};
 F.addEventListener('click',e=>{const c=e.target.closest('.chip');if(!c)return;st[c.dataset.k]=c.dataset.v;(!RM&&document.startViewTransition)?document.startViewTransition(apply):apply();});
 const q=location.hash.match(/artist=(\w+)/);if(q){const v=q[1][0].toUpperCase()+q[1].slice(1);if(F.querySelector(`.chip[data-k="artist"][data-v="${v}"]`)){st.artist=v;apply();}}}
// lightbox: role=dialog, pułapka fokusu, Esc, strzałki, swipe, powrót fokusu
const links=[...document.querySelectorAll('a.lb')];if(!links.length)return;
const d=document.createElement('div');d.className='lbx';d.hidden=true;d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label',EN?'Photo preview':'Podgląd zdjęcia');
d.innerHTML=`<figure><img alt=""><figcaption></figcaption></figure><button type="button" class="pv" aria-label="${EN?'Previous photo':'Poprzednie zdjęcie'}">←</button><button type="button" class="nx" aria-label="${EN?'Next photo':'Następne zdjęcie'}">→</button><button type="button" class="x" aria-label="${EN?'Close preview':'Zamknij podgląd'}">✕</button>`;
document.body.appendChild(d);const im=d.querySelector('img'),cap=d.querySelector('figcaption');let set=[],i=0,last=null;
const show=k=>{i=(k+set.length)%set.length;const a=set[i],alt=a.querySelector('img').alt;im.src=a.href;im.alt=alt;cap.innerHTML='';if(a.dataset.cap){const b=document.createElement('b');b.textContent=a.dataset.cap;cap.appendChild(b);}cap.appendChild(document.createTextNode(alt+' ('+(i+1)+'/'+set.length+')'));};
const close=()=>{d.hidden=true;im.removeAttribute('src');document.body.style.overflow='';if(last)last.focus();};
links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();last=a;const g=a.closest('.masonry,.bento,.gallery,ul')||document;set=[...g.querySelectorAll('a.lb')].filter(x=>!x.closest('[hidden]'));show(set.indexOf(a));d.hidden=false;document.body.style.overflow='hidden';d.querySelector('.x').focus();}));
d.querySelector('.pv').onclick=()=>show(i-1);d.querySelector('.nx').onclick=()=>show(i+1);d.querySelector('.x').onclick=close;
d.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}else if(e.key==='ArrowLeft')show(i-1);else if(e.key==='ArrowRight')show(i+1);else trap(d,e);});
let sx=null,sy=0;d.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
d.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;sx=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))show(dx<0?i+1:i-1);},{passive:true});
d.addEventListener('click',e=>{if(e.target===d||e.target.tagName==='FIGURE')close();});
})();
