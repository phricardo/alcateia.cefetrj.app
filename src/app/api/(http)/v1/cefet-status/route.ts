import { NextResponse } from "next/server";

export async function GET() {
  const timeout = 5000;

  const fetchWithTimeout = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      fetch(url, { signal: controller.signal })
        .then((res) => {
          clearTimeout(id);
          resolve(res.ok || res.status === 302);
        })
        .catch(() => {
          clearTimeout(id);
          resolve(false);
        });
    });
  };

  const [mainOK, alunosOK] = await Promise.all([
    fetchWithTimeout("https://www.cefet-rj.br/"),
    fetchWithTimeout("https://alunos.cefet-rj.br/aluno/login.action?error="),
  ]);

  if (mainOK && alunosOK) {
    return NextResponse.json({ status: "online" });
  } else if (mainOK || alunosOK) {
    return NextResponse.json({ status: "parcial" });
  } else {
    return NextResponse.json({ status: "offline" });
  }
}
