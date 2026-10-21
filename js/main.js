(()=>{const b=document.querySelector('.menu-btn'),n=document.getElementById('nav');
if(b)b.addEventListener('click',()=>{const o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!o));n.classList.toggle('open',!o);});
// portfolio filter (bez JS: wszystkie sekcje widoczne, linki = kotwice)
const f=document.querySelectorAll('.filters a');f.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const k=a.dataset.f;
document.querySelectorAll('.cat').forEach(s=>s.hidden=k!=='all'&&s.id!==k);f.forEach(x=>x.setAttribute('aria-current',String(x===a)));}));
// lightbox (bez JS: linki otwierają pełny obraz)
const links=[...document.querySelectorAll('a.lb')];if(!links.length||!window.HTMLDialogElement)return;
const EN=document.documentElement.lang==='en',T=(p,e)=>EN?e:p;const d=document.createElement('dialog');d.className='lbx';d.setAttribute('aria-modal','true');d.setAttribute('role','dialog');d.setAttribute('aria-label',T('Podgląd zdjęcia','Image preview'));
d.innerHTML='<figure><img alt=""><figcaption></figcaption></figure><button type="button" class="pv" aria-label="'+T('Poprzednie zdjęcie','Previous image')+'">‹</button><button type="button" class="nx" aria-label="'+T('Następne zdjęcie','Next image')+'">›</button><button type="button" class="x" aria-label="'+T('Zamknij podgląd','Close preview')+'">✕</button>';
document.body.appendChild(d);const im=d.querySelector('img'),cap=d.querySelector('figcaption');let set=[],i=0,last=null;
const show=k=>{i=(k+set.length)%set.length;const a=set[i],alt=a.querySelector('img').alt;im.src=a.href;im.alt=alt;cap.textContent=alt+(a.dataset.cap?' — '+a.dataset.cap:'')+' ('+(i+1)+'/'+set.length+')';};
links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();last=a;set=[...a.closest('.gallery').querySelectorAll('a.lb')];show(set.indexOf(a));d.showModal();d.querySelector('.x').focus();}));
d.querySelector('.pv').onclick=()=>show(i-1);d.querySelector('.nx').onclick=()=>show(i+1);d.querySelector('.x').onclick=()=>d.close();
d.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(i-1);else if(e.key==='ArrowRight')show(i+1);else if(e.key==='Tab'){const bt=[...d.querySelectorAll('button')],fi=bt[0],la=bt[bt.length-1];if(e.shiftKey&&document.activeElement===fi){e.preventDefault();la.focus();}else if(!e.shiftKey&&document.activeElement===la){e.preventDefault();fi.focus();}}});
d.addEventListener('click',e=>{if(e.target===d)d.close();});d.addEventListener('close',()=>{im.removeAttribute('src');if(last)last.focus();});
})();
