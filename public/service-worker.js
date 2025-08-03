self.addEventListener("install", (event) => {
  console.log("[SW] Instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Ativado");
});

// self.addEventListener("fetch", (event) => {
//   console.log("[SW] Interceptando:", event.request.url);
// });
