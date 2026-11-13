// Guarda só a "casca" do app (arquivos do próprio site). Dados e login NUNCA ficam em cache:
// as chamadas ao Apps Script são de outro domínio e este service worker nem chega a vê-las.
const VERSAO = 'am-v8';
const CASCA = ['./', 'index.html', 'config.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  // um arquivo ausente não pode impedir a instalação do service worker
  e.waitUntil(caches.open(VERSAO)
    .then((c) => Promise.all(CASCA.map((u) => c.add(u).catch(() => {}))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Rede primeiro (para novas versões chegarem logo); se estiver sem internet, usa o que está guardado.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then((res) => {
    if (res.ok) { const copia = res.clone(); caches.open(VERSAO).then((c) => c.put(req, copia)); }
    return res;
  }).catch(() => caches.match(req).then((r) => r || caches.match('./'))));
});
