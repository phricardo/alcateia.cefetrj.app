import { useEffect } from "react";

export function useBrowserNotification({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const icon = "/icons/favicon-192x192.png";

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, {
            body,
            icon,
          });
        }
      });
    } else if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon,
      });
    }
  }, [title, body]);
}
