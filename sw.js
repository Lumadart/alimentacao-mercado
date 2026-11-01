// Service worker mínimo — só existe pra o navegador aceitar instalar o app na tela inicial.
// Não guarda nada em cache (o app sempre precisa de internet pra falar com a planilha).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
