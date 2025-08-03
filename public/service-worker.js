self.addEventListener("push", function (event) {
  const data = event.data?.text() ?? "{}";
  let title = "Notificação";
  let body = "";

  try {
    const jsonData = JSON.parse(data);
    title = jsonData.title ?? "Notificação";
    body = jsonData.body ?? "";
  } catch (error) {
    console.error("Erro ao analisar o JSON:", error);
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "https://upload.wikimedia.org/wikipedia/commons/4/41/Logotipo_cefet-rj.jpg",
      actions: [
        {
          action: "open_app",
          title: "Abrir o App",
        },
      ],
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
