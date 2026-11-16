const CACHE='kpm-motion-v1-20261116';
const FILES=['./','./index.html','./style.css','./app.js','./scene.js','./kpm-motion-logo.webp','./kpm-swoosh.mp3','./icon-192.png','./icon-512.png','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kpm-motion-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
 if(req.mode==='navigate'){
  e.respondWith(fetch(req).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy)).catch(()=>{});return response;}).catch(()=>caches.match('./index.html')));return;
 }
 e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{if(res.ok){const clone=res.clone();caches.open(CACHE).then(c=>c.put(req,clone)).catch(()=>{});}return res;})));
});
