'use strict';
(() => {
const $ = (s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const esc = s=>String(s ?? '').trim();
const fmt=n=>'R'+Math.round(n).toLocaleString('en-US');
const whatsappNumber='27834621900'; // Encoded only in links; never printed in the website UI.
const linkToWhatsApp=msg=>'https://wa.me/'+whatsappNumber+'?text='+encodeURIComponent(msg);
const toast=$('#toast');let toastTimer;
function notify(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2900);}
function openWhatsApp(msg){const win=window.open(linkToWhatsApp(msg),'_blank','noopener,noreferrer');if(!win){notify('Please allow pop-ups or use the WhatsApp contact button.');}}
$('#year').textContent=new Date().getFullYear();

// Cinematic opening — spoken audio intentionally starts only after interaction.
const intro=$('#intro');let introClosed=false;
function speakBrand(){
  if(!('speechSynthesis' in window)){notify('Voice unavailable on this browser. The website still works.');return;}
  try{
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance('K P M Motion. Keep people moving.');
    utterance.lang='en-US';utterance.rate=.82;utterance.pitch=1.08;utterance.volume=.93;
    const voices=window.speechSynthesis.getVoices();
    const female=/samantha|ava|allison|aria|jenny|zira|victoria|serena|karen|moira|fiona|susan|female|natasha|olivia|emma|jane|catherine/i;
    utterance.voice=voices.find(v=>/^en/i.test(v.lang)&&female.test(v.name))||voices.find(v=>/^en(-US|-ZA|-GB)?$/i.test(v.lang))||null;
    // The exact voice is dependent on what the visitor's phone/browser provides.
    window.speechSynthesis.speak(utterance);
  }catch(e){console.warn('Voice playback unavailable:',e);}
}
function finishIntro(withSound){
  if(introClosed)return;introClosed=true;
  if(withSound){
    const audio=$('#introAudio');audio.currentTime=0;audio.volume=.7;
    audio.play().catch(()=>notify('Sound requires browser permission.'));
    // Speech begins in the same user interaction to meet browser audio restrictions.
    speakBrand();
  }
  intro.classList.add('hidden');intro.setAttribute('aria-hidden','true');document.body.classList.remove('locked');
  setTimeout(()=>intro.style.display='none',800);
}
$('#enterSound').addEventListener('click',()=>finishIntro(true));
$('#enterSilent').addEventListener('click',()=>finishIntro(false));
$('#replayIntro').addEventListener('click',()=>{introClosed=false;intro.style.display='grid';intro.removeAttribute('aria-hidden');intro.classList.remove('hidden');document.body.classList.add('locked');intro.querySelector('#enterSound').focus();window.scrollTo({top:0,behavior:'smooth'});});
document.body.classList.add('locked');
// Avoid a voice crashing the entire page on browsers that restrict SpeechSynthesis.

// Navigation
const menu=$('#mobileMenu'),menubtn=$('#menuButton');
function closeMenu(){menu.hidden=true;menubtn.setAttribute('aria-expanded','false');menubtn.setAttribute('aria-label','Open navigation');}
menubtn.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menubtn.setAttribute('aria-expanded',String(open));menubtn.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
$$('a',menu).forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();closeChat();}});

// Motion lab
const modeText={orbit:'Smooth orbital movement. Refined and confident.',pulse:'A powerful, rhythmic energy designed to get noticed.',velocity:'Fast directional motion for bold, high-energy brands.'};
$$('.mode-btn').forEach(btn=>btn.addEventListener('click',()=>{
 $$('.mode-btn').forEach(b=>b.classList.toggle('active',b===btn));
 const mode=btn.dataset.mode;$('#labVisual').dataset.mode=mode;$('#reactorModeName').textContent=mode.toUpperCase();$('#modeDescription').textContent=modeText[mode];
}));

// Quote builder
const plans={
 launch:{name:'Launch',base:2500,pages:5,extra:350},
 accelerate:{name:'Accelerate',base:4500,pages:7,extra:450},
 velocity:{name:'Velocity',base:7500,pages:9,extra:650},
 store:{name:'Online Store',base:6500,pages:5,extra:550}
};
const extras={gallery:{label:'Expanded gallery / visual portfolio',price:450},motion:{label:'Advanced animations',price:850},booking:{label:'Booking request experience',price:900},design:{label:'Custom design direction',price:1600}};
const planSelect=$('#planSelect'),pageRange=$('#pageRange'),checkExtras=$$('.extra-item input');
function calculateQuote(){
 const plan=plans[planSelect.value];const pages=Number(pageRange.value);
 const pageCost=Math.max(0,pages-plan.pages)*plan.extra;
 const selected=checkExtras.filter(x=>x.checked).map(x=>extras[x.value]);
 const total=plan.base+pageCost+selected.reduce((sum,x)=>sum+x.price,0);
 $('#pageCount').textContent=pages+' '+(pages===1?'page':'pages');
 $('#pageInfo').textContent=pages>plan.pages?`${plan.pages} pages included, plus ${pages-plan.pages} extra at ${fmt(plan.extra)} each.`:`${plan.pages} pages included. The base package price stays the same for fewer pages.`;
 $('#quoteAmount').textContent=fmt(total);
 return {plan,pages,pageCost,selected,total};
}
planSelect.addEventListener('change',()=>{pageRange.value=plans[planSelect.value].pages;calculateQuote();});
pageRange.addEventListener('input',calculateQuote);checkExtras.forEach(x=>x.addEventListener('change',calculateQuote));
$$('[data-plan]').forEach(b=>b.addEventListener('click',()=>{planSelect.value=b.dataset.plan;pageRange.value=plans[b.dataset.plan].pages;calculateQuote();$('#quote').scrollIntoView({behavior:'smooth'});}));
$('#sendQuote').addEventListener('click',()=>{
 const q=calculateQuote(),brief=$('#briefInput').value.trim();
 const message=`Hello KPM MOTION! I'd like to request a website quotation.\n\nPackage: ${q.plan.name}\nPages: ${q.pages}\nExtra pages: ${fmt(q.pageCost)}\nSelected extras: ${q.selected.length?q.selected.map(x=>x.label+' ('+fmt(x.price)+')').join(', '):'None'}\nEstimated starting total: ${fmt(q.total)}\n${brief?'\nProject details: '+brief+'\n':''}\nPlease confirm the scope, delivery timeline and final price. I understand this is only an estimate.`;
 openWhatsApp(message);
});

// Concept showcase, all original demos (not clients).
const concepts={
 velocity:{headline:'BEYOND<br><em>EXPECTED.</em>',brand:'VELOCITY',action:"LET'S CREATE SOMETHING ↗",caption:'01 / VELOCITY STUDIO'},
 commerce:{headline:'LESS, BUT<br><em>BETTER.</em>',brand:'MONO MARKET',action:'SHOP THE COLLECTION ↗',caption:'02 / MONO MARKET'},
 dashboard:{headline:'CONTROL THE<br><em>FUTURE.</em>',brand:'ORBIT OS',action:'EXPLORE DASHBOARD ↗',caption:'03 / ORBIT OS'}
};
$$('.concept-btn').forEach(btn=>btn.addEventListener('click',()=>{
 $$('.concept-btn').forEach(b=>b.classList.toggle('active',b===btn));
 const c=concepts[btn.dataset.concept],screen=$('#mockScreen');
 screen.dataset.concept=btn.dataset.concept;
 $('.mock-nav b',screen).innerHTML=c.brand+'<span>.</span>';
 $('.mock-heading',screen).innerHTML=c.headline;
 $('.mock-cta',screen).textContent=c.action;
 $('#mockCaption b').textContent=c.caption;
}));

// Live design playground
let studioAccent='blue',studioStyle='glass';
const palette={blue:{name:'ELECTRIC BLUE',hex:'#55aaff'},red:{name:'VIVID RED',hex:'#fa4166'},purple:{name:'VIOLET',hex:'#ac7bff'},mint:{name:'MINT',hex:'#5beec5'}};
$$('.swatch').forEach(b=>b.addEventListener('click',()=>{studioAccent=b.dataset.accent;$$('.swatch').forEach(x=>x.classList.toggle('active',x===b));$('#studioPreview').style.setProperty('--studioAccent',palette[studioAccent].hex);$('#accentName').textContent=palette[studioAccent].name;}));
$$('.style-toggle').forEach(b=>b.addEventListener('click',()=>{studioStyle=b.dataset.style;$$('.style-toggle').forEach(x=>x.classList.toggle('active',x===b));$('#studioPreview').dataset.style=studioStyle;}));
$('#saveStyle').addEventListener('click',()=>openWhatsApp(`Hello KPM MOTION! I'd like a website design inspired by your live studio.\nAccent colour: ${palette[studioAccent].name}\nCard treatment: ${studioStyle}.\nCan we discuss a quote?`));

// Comparison slider
const compareRange=$('#compareRange');function updateCompare(){const p=Number(compareRange.value);$('#compareAfter').style.clipPath=`inset(0 ${100-p}% 0 0)`;$('#compareHandle').style.left=p+'%';}compareRange.addEventListener('input',updateCompare);updateCompare();

// Accessible basic animation without hiding elements in unsupported browsers.
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.07});
 $$('.service-card,.price-card,.section-heading,.quote-panel,.lab-shell,.mock-browser,.steps>div,.studio-preview,.faq-list').forEach(e=>{e.classList.add('reveal');observer.observe(e);});
}
if(matchMedia('(pointer:fine)').matches){
 const glow=$('.cursor-glow');window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';glow.style.opacity='.9';},{passive:true});
}

// KPM MOTION guide: sophisticated local intent handling, with optional REAL AI endpoint.
const aiEndpoint=esc(window.KPM_CONFIG?.aiEndpoint);
const turnstileSiteKey=esc(window.KPM_CONFIG?.turnstileSiteKey);
let turnstileToken='',turnstileWidgetId=null,turnstileLoading=false;
function loadTurnstile(){
 if(!aiEndpoint||!turnstileSiteKey||turnstileLoading)return;turnstileLoading=true;
 $('#turnstileShell').hidden=false;
 const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
 script.onload=()=>{if(!window.turnstile)return;turnstileWidgetId=window.turnstile.render('#turnstileWidget',{sitekey:turnstileSiteKey,theme:'dark',size:'flexible',callback:token=>turnstileToken=token,'expired-callback':()=>turnstileToken='','error-callback':()=>turnstileToken=''});};
 script.onerror=()=>notify('Verification unavailable. Local website guide remains active.');document.head.appendChild(script);
}
function resetTurnstile(){turnstileToken='';if(window.turnstile&&turnstileWidgetId!==null){try{window.turnstile.reset(turnstileWidgetId);}catch{}}}
const panel=$('#assistantPanel'),toggle=$('#assistantToggle'),chat=$('#chatMessages'),suggestions=$('#chatSuggestions'),chatInput=$('#chatInput'),chatForm=$('#chatForm');
let chatBusy=false,lastTopic='general';const history=[];
function openChat(){panel.hidden=false;toggle.setAttribute('aria-expanded','true');chatInput.focus();chat.scrollTop=chat.scrollHeight;loadTurnstile();}
function closeChat(){panel.hidden=true;toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>panel.hidden?openChat():closeChat());$('#assistantClose').addEventListener('click',closeChat);
const quickActions={
 quote:[['Calculate price','#quote'],['View packages','#packages']],
 pricing:[['Compare packages','#packages'],['Estimate my price','#quote']],
 services:[['Explore services','#services'],['View concept demos','#showcase']],
 style:[['Try design studio','#studio'],['Explore 3D lab','#experience']],
 contact:[['WhatsApp us',linkToWhatsApp('Hello KPM MOTION! I want to discuss a website.')],['Email us','mailto:kingkpm121@gmail.com']],
 process:[['How we work','#process'],['Get started','#quote']],
 about:[['Our services','#services'],['See pricing','#packages']]
};
function appendBubble(msg,who){const d=document.createElement('div');d.className='chat-bubble '+who;d.textContent=msg;chat.appendChild(d);chat.scrollTop=chat.scrollHeight;return d;}
function appendActions(keys){const actions=quickActions[keys];if(!actions)return;const wrap=document.createElement('div');wrap.className='chat-actions';actions.forEach(([label,url])=>{const a=document.createElement('a');a.textContent=label;a.href=url;if(url.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer';}a.addEventListener('click',()=>{if(url.startsWith('#'))closeChat();});wrap.appendChild(a);});chat.appendChild(wrap);chat.scrollTop=chat.scrollHeight;}
function normalize(s){return s.toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9\s']/g,' ').replace(/\s+/g,' ').trim();}
function localReply(raw){
 const s=normalize(raw),has=(...terms)=>terms.some(t=>s.includes(t));
 const count=Number(s.match(/\b(\d{1,2})\s*(?:page|pages)\b/)?.[1]||0);
 if(has('human','real person','call you','speak to someone','contact','whatsapp','email','phone','number')){lastTopic='contact';return {topic:'contact',reply:"You can reach KPM MOTION directly by WhatsApp or email at kingkpm121@gmail.com. Use the links below to share what you're building. We won't show your project details publicly."};}
 if(has('purpose','mission','stands for','what is kpm','what does kpm','who are you','who is kpm','about kpm','the company')){lastTopic='about';return {topic:'about',reply:'KPM means Keep People Moving. KPM MOTION is a digital design brand focused on helping businesses and creators move forward through responsive websites, interactive experiences and practical digital tools. We aim for work that looks distinctive and is useful.'};}
 if(has('3d','animation','animated','motion','interactive','scroll','effects','holographic')){lastTopic='style';return {topic:'style',reply:'Yes—KPM MOTION can design animated interfaces, 3D-style product displays and interactive experiences. For real-time 3D, we discuss device performance and quote the extra development separately. The Motion Lab above is a small demonstration.'};}
 if(has('online store','ecommerce','e commerce','shop','store','sell products','payment gateway','checkout')){lastTopic='pricing';return {topic:'pricing',reply:'An online store currently starts at approximately R6,500 for a basic scoped setup. Product count, payment provider, delivery rules and administration features affect the final price. Use our quote calculator as a starting point.'};}
 if(has('budget','cost','price','pricing','charge','quote','quotation','package','afford','rand','r2500','r2 500')||count){
  lastTopic='pricing';
  if(count){const extra=Math.max(0,count-5)*350;return {topic:'pricing',reply:`For ${count} pages, the Launch package starts at ${fmt(2500+extra)} (R2,500 covers the first five pages; extra pages are R350 each). Animations, hosting and custom features are separate. Want me to help you tailor a quote?`};}
  if(has('premium','velocity'))return {topic:'pricing',reply:'Velocity is our premium direction, starting at R7,500 for up to nine pages with cinematic effects and interactive presentation. Advanced 3D or custom backend work is quoted separately.'};
  if(has('business','accelerate','mid'))return {topic:'pricing',reply:'Accelerate starts at R4,500 for up to seven pages, with a more customised visual design, scroll animations and a service or gallery showcase.'};
  return {topic:'pricing',reply:'Our five-page Launch website starts at R2,500. Accelerate starts at R4,500 for seven pages; Velocity starts at R7,500 for nine pages. Online stores start around R6,500. Domain, hosting and specialist features are quoted separately.'};
 }
 if(has('how long','timeline','time','deliver','deadline','when will','days','weeks','process','steps')){lastTopic='process';return {topic:'process',reply:'We start with a short discovery conversation, agree on scope and price, then move through design, development, testing and approval. Delivery time depends on the project and how quickly the required content is provided; we agree on milestones before starting.'};}
 if(has('deposit','pay','payment','bank','invoice','instalment','installment')){lastTopic='process';return {topic:'process',reply:'We confirm payment terms in your written quotation before starting work. You can ask about deposits or milestones directly in your enquiry. Bank details are provided through a verified invoice, not through this chat.'};}
 if(has('domain','hosting','publish','online','github','seo','google','maintenance','update')){lastTopic='services';return {topic:'services',reply:'Responsive setup and basic SEO are included in website packages. Domain registration, paid hosting and ongoing maintenance are separate. We can discuss publishing options that match your budget.'};}
 if(has('design','style','colour','color','black','blue','red','aesthetic','logo','inspiration','theme')){lastTopic='style';return {topic:'style',reply:'Absolutely. KPM designs around your brand—not a single fixed template. Try the live Design Studio to test colours and card styles, then send your choices to us by WhatsApp.'};}
 if(has('features','services','offer','build','website','app','dashboard','software','do you')){lastTopic='services';return {topic:'services',reply:'We focus on modern websites, online stores, premium motion and 3D design, plus custom digital tools and interactive prototypes. Tell me whether you want a simple business website, something animated, or a store, and I can point you to a starting package.'};}
 if(has('start','begin','book','hire','order','request','get started','interested','help me','want one')){lastTopic='quote';return {topic:'quote',reply:'Easy. Tell us your business type, the number of pages you need, and any special features. Use the quote builder to get a starting estimate, then send the prepared brief via WhatsApp. We will confirm the final scope personally.'};}
 if(has('thanks','thank you','okay','great','cool','nice'))return {topic:lastTopic,reply:'You’re welcome! ✦ If you tell me a little more about your website idea, I can suggest a package or take you straight to the quote builder.'};
 if(has('hi','hello','hey','morning','afternoon'))return {topic:'about',reply:'Welcome to KPM MOTION! ✦ What are you planning: a five-page business website, an online store, or an interactive premium experience?'};
 if(has('more','tell me more','explain')&&lastTopic==='pricing')return {topic:'pricing',reply:'The key difference is design and complexity: Launch focuses on five professional pages; Accelerate adds a more customised look and animations; Velocity adds cinematic visual presentation. You can start at R2,500 and add features when needed.'};
 return {topic:'services',reply:'I can help with KPM MOTION services, website prices, the five-page R2,500 package, timelines, 3D features and how to get a quote. Could you tell me a little more about your website idea? For a custom answer from the team, use WhatsApp or email.'};
}
function setBusy(b){chatBusy=b;chatForm.querySelector('button').disabled=b;chatInput.disabled=b;}
async function sendMessage(value){
 const message=esc(value);if(!message||chatBusy)return;
 appendBubble(message,'user');history.push({role:'user',content:message});setBusy(true);
 const pending=appendBubble('Thinking…','bot');
 let result;
 if(aiEndpoint&&turnstileToken){
  try{
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
   let resp;
   try{resp=await fetch(aiEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history.slice(-10),turnstileToken}),signal:controller.signal});}finally{clearTimeout(timer);}
   if(!resp.ok)throw new Error('Backend returned '+resp.status);
   const data=await resp.json();if(typeof data.reply!=='string'||!data.reply.trim())throw new Error('Empty response');
   result={reply:data.reply.slice(0,2000),topic:'services'};
  }catch(e){console.warn('Live AI unavailable; using KPM guide.',e);result=localReply(message);}
 }else{result=localReply(message);if(aiEndpoint&&!turnstileToken)notify('Complete verification for live AI; answering with the local guide.');}
 if(aiEndpoint)resetTurnstile();
 pending.textContent=result.reply;history.push({role:'assistant',content:result.reply});lastTopic=result.topic;
 appendActions(result.topic);chat.scrollTop=chat.scrollHeight;setBusy(false);chatInput.focus();
}
chatForm.addEventListener('submit',e=>{e.preventDefault();const v=chatInput.value;chatInput.value='';sendMessage(v);});
$$('[data-question]',suggestions).forEach(b=>b.addEventListener('click',()=>sendMessage(b.dataset.question)));
if(aiEndpoint&&turnstileSiteKey)$('#assistantStatus').textContent='Live AI is available after verification. Please do not share passwords or sensitive personal data.';
else if(aiEndpoint)$('#assistantStatus').textContent='Live AI needs a Turnstile site key to protect usage. The local website guide is active.';

// Installable on https and localhost, when supported.
if('serviceWorker' in navigator&&location.protocol==='https:'||('serviceWorker' in navigator&&location.hostname==='localhost')){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('Offline support:',err)));
}
})();
