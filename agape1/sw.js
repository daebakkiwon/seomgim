/* 아가페 1권 — 홈 화면 앱 설치용 서비스 워커.
   화면(html)은 늘 새로 받고, 인터넷이 끊기면 마지막으로 받아 둔 것을 보여 준다. 녹음은 저장하지 않는다. */
const C = 'agape1-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png']).catch(() => {}))); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if(r.method !== 'GET' || u.origin !== location.origin || u.pathname.includes('/audio/') || u.pathname.endsWith('admin.html')) return;
  e.respondWith(fetch(r).then(res => { if(res.ok){ const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
});
