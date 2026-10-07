/* 아가페 성경공부 — 홈 화면 앱 설치용 서비스 워커.
   화면(html)과 버전 정보는 늘 서버에서 새로 받고(캐시 무시), 인터넷이 끊기면 마지막으로 받아 둔 것을 보여 준다.
   녹음(audio, audio2 …, 절별대조 agape-vv-ot/nt)은 저장하지 않는다. */
const C = 'agape-v2';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png']).catch(() => {}))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if(r.method !== 'GET' || u.origin !== location.origin || /\/audio\d*\//.test(u.pathname) || /\/agape-vv-/.test(u.pathname) || u.pathname.endsWith('admin.html')) return;
  const fresh = r.mode === 'navigate' || /\.(html|json)$/.test(u.pathname) || u.pathname.endsWith('/');
  e.respondWith(fetch(fresh ? r.url : r, fresh ? {cache: 'no-store', credentials: 'same-origin'} : undefined).then(res => { if(res.ok){ const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r, {ignoreSearch: true}).then(m => m || caches.match('index.html'))));
});
