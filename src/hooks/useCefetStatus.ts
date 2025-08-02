import { useEffect, useState } from "react";

type Status = "online" | "parcial" | "offline" | "checking";

export function useCefetStatus() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/v1/cefet-status");
        const data = await res.json();
        setStatus(data.status);
      } catch (err) {
        console.error("Erro ao verificar status:", err);
        setStatus("offline");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return status;
}
