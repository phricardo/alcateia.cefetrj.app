import cheerio from "cheerio";

export const BASE_URL = "https://alunos.cefet-rj.br";

export function getStudentLinks(registrationId: string): {
  profile: string;
  docs: string;
  schedule: string;
  assessments: string;
} {
  return {
    profile: `${BASE_URL}/aluno/aluno/perfil/perfil.action`,
    docs: `${BASE_URL}/aluno/relatorio/relatorios.action?matricula=${registrationId}`,
    schedule: `${BASE_URL}/aluno/aluno/quadrohorario/menu.action?matricula=${registrationId}`,
    assessments: `${BASE_URL}/aluno/aluno/nota/nota.action?matricula=${registrationId}`,
  };
}

interface StudentInfo {
  enrollment: string;
  course: string;
  currentPeriod: string;
  enrollmentPeriod: string;
}

export const extractStudentInfo = (html: string): StudentInfo => {
  const $ = cheerio.load(html);

  const enrollment = $("table.table-topo tbody tr")
    .eq(0)
    .find("td")
    .eq(0)
    .text()
    .split(":")[1]
    .trim();
  const enrollmentPeriod = $("table.table-topo tbody tr")
    .eq(0)
    .find("td")
    .eq(1)
    .text()
    .split(":")[1]
    .trim();
  const course = $("table.table-topo tbody tr")
    .eq(1)
    .find("td")
    .eq(0)
    .text()
    .split(":")[1]
    .trim();
  const currentPeriod = $("table.table-topo tbody tr")
    .eq(1)
    .find("td")
    .eq(1)
    .text()
    .split(":")[1]
    .trim();

  return {
    enrollment,
    course,
    currentPeriod,
    enrollmentPeriod,
  };
};

export const extractUser = (
  html: string
): { name: string; studentId: string } => {
  const $ = cheerio.load(html);
  const name = $("span#menu > button").text().trim();
  const studentId = $("#matricula").val() as string;
  return { name, studentId };
};

export const extractCPF = (html: string): string | null => {
  const $ = cheerio.load(html);

  let cpf: string | null = null;

  $('table[cellpadding="5"][cellspacing="5"][width="100%"] tbody tr').each(
    (_, element) => {
      const documentType = $(element).find("td").eq(0).text().trim();
      if (documentType.includes("Cadastro de Pessoas Físicas")) {
        cpf = $(element).find("td").eq(1).text().trim();
      }
    }
  );

  return cpf;
};

export function capitalizeName(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function extractPnotifyText(html: string): string | null {
  const $ = cheerio.load(html);
  const scriptContent = $("script").text();

  const pnotifyMatch = scriptContent.match(
    /pnotify_text\s*:\s*['"]([^'"]+)['"]/
  );

  return pnotifyMatch ? pnotifyMatch[1] : null;
}

export function determineCampusFromURL(url: string): {
  campus: string | null;
  isEveryone: boolean;
} {
  if (url.includes("campus-maracana")) {
    return { campus: "MARACANA", isEveryone: false };
  } else if (url.includes("campus-angra-dos-reis")) {
    return { campus: "ANGRA_DOS_REIS", isEveryone: false };
  } else if (url.includes("campus-itaguai")) {
    return { campus: "ITAGUAI", isEveryone: false };
  } else if (url.includes("campus-maria-da-graca")) {
    return { campus: "MARIA_DA_GRACA", isEveryone: false };
  } else if (url.includes("campus-nova-friburgo")) {
    return { campus: "NOVA_FRIBURGO", isEveryone: false };
  } else if (url.includes("campus-nova-iguacu")) {
    return { campus: "NOVA_IGUACU", isEveryone: false };
  } else if (url.includes("campus-petropolis")) {
    return { campus: "PETROPOLIS", isEveryone: false };
  } else if (url.includes("campus-valenca")) {
    return { campus: "VALENCA", isEveryone: false };
  } else if (url.includes("noticias?format=feed&type=rss")) {
    return { campus: null, isEveryone: true };
  } else {
    throw new Error("Unknown campus in RSS URL");
  }
}
