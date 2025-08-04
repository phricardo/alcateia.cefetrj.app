import axios from "axios";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import { BASE_URL, extractUser } from "@/app/api/utils/links.util";

function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim();
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
        situacao: string;
        codigoTurma: string;
        linkNotas: string;
      }[]
    > = {};

    $corpo("a.accordionTurma").each((_, el) => {
      const semestre = cleanText($corpo(el).text());
      const divTable = $corpo(el).parent().next("div");

      const disciplinas: {
        nome: string;
        codigoDisciplina: string;
        situacao: string;
        codigoTurma: string;
        linkNotas: string;
      }[] = [];

      divTable.find("table.table-turmas tbody tr").each((_, tr) => {
        const tds = $corpo(tr).find("td");

        const fullNome = $corpo(tds[0]).text().trim();

        // Extrair código dentro dos parênteses
        const codigoDisciplinaMatch = fullNome.match(/\(([^)]+)\)/);
        const codigoDisciplina = codigoDisciplinaMatch
          ? codigoDisciplinaMatch[1].trim()
          : "";

        // Remover o código e os parênteses do nome
        const nome = fullNome.replace(/\([^)]+\)/, "").trim();

        const situacao = $corpo(tds[1]).text().trim().toUpperCase();
        const codigoTurma = $corpo(tds[2]).text().trim();

        const linkNotasTag = $corpo(tds[3]).find("a");
        const rawHref = linkNotasTag.attr("href") || "";

        const match = rawHref.match(/loadDialog\('([^']+)'/);
        const linkNotas = match ? match[1] : rawHref;

        disciplinas.push({
          nome,
          codigoDisciplina,
          situacao,
          codigoTurma,
          linkNotas,
        });
      });

      resultado[semestre] = disciplinas;
    });

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
