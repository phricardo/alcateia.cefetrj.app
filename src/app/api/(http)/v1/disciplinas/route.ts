import axios from "axios";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import { BASE_URL, extractUser } from "@/app/api/utils/links.util";

function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function extrairnotasRef(link: string) {
  const parts = link.split(";");
  return parts.length > 1 ? parts[1] : link;
}

function parseNotasRef(notasRef: string) {
  const [beforeQuery, queryString] = notasRef.split("?");
  const obj: Record<string, string> = {};

  if (beforeQuery.includes("=")) {
    const [key, value] = beforeQuery.split("=");
    obj[key === "jsessionid" ? "key" : key] = value;
  }

  if (queryString) {
    const params = new URLSearchParams(queryString);
    params.forEach((value, key) => {
      obj[key] = value;
    });
  }

  return obj;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("CEFETID_SSO");
    if (!token) throw new Error("CEFETID_SSO Cookie not found");

    const indexResponse = await axios.get(`${BASE_URL}/aluno/index.action`, {
      headers: { Cookie: `JSESSIONIDSSO=${token.value}` },
    });
    const { studentId } = extractUser(indexResponse.data);

    const notasResponse = await axios.get(
      `${BASE_URL}/aluno/aluno/nota/nota.action?matricula=${studentId}`,
      { headers: { Cookie: `JSESSIONIDSSO=${token.value}` } }
    );

    const $ = cheerio.load(notasResponse.data);
    const corpoHtml = $(".page.corner .corpopage").html();

    if (!corpoHtml)
      throw new Error("Div .corpopage não encontrada dentro de .page.corner");

    const $corpo = cheerio.load(corpoHtml);

    const resultado: Record<
      string,
      {
        nome: string;
        codigoDisciplina: string;
        situacao: string;
        codigoTurma: string;
        notasQueryParams: Record<string, string>;
      }[]
    > = {};

    const semestreElements = $corpo("a.accordionTurma");

    for (const el of semestreElements.toArray()) {
      const semestre = cleanText($corpo(el).text());
      const divTable = $corpo(el).parent().next("div");

      const disciplinas: {
        nome: string;
        codigoDisciplina: string;
        situacao: string;
        codigoTurma: string;
        notasQueryParams: Record<string, string>;
      }[] = [];

      const trElements = divTable.find("table.table-turmas tbody tr");

      for (const tr of trElements.toArray()) {
        const tds = $corpo(tr).find("td");

        const fullNome = $corpo(tds[0]).text().trim();
        const codigoDisciplinaMatch = fullNome.match(/\(([^)]+)\)/);
        const codigoDisciplina = codigoDisciplinaMatch
          ? codigoDisciplinaMatch[1].trim()
          : "";
        const nome = fullNome.replace(/\([^)]+\)/, "").trim();

        const situacao = $corpo(tds[1]).text().trim().toUpperCase();
        const codigoTurma = $corpo(tds[2]).text().trim();

        const linkNotasTag = $corpo(tds[3]).find("a");
        const rawHref = linkNotasTag.attr("href") || "";
        const match = rawHref.match(/loadDialog\('([^']+)'/);
        const linkNotas = match ? match[1] : rawHref;

        const notasRef = extrairnotasRef(linkNotas);
        const notasQueryParams = parseNotasRef(notasRef);

        disciplinas.push({
          nome,
          codigoDisciplina,
          situacao,
          codigoTurma,
          notasQueryParams,
        });
      }

      resultado[semestre] = disciplinas;
    }

    return NextResponse.json(
      { disciplinasPorSemestre: resultado },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 400 }
    );
  }
}
