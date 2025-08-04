import axios from "axios";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/app/api/utils/links.util";

function montarUrlNotas(queryParams: Record<string, string>): string {
  const { key, ...params } = queryParams;
  const searchParams = new URLSearchParams(params).toString();
  return `/aluno/ajax/aluno/nota/notaturma.action;jsessionid=${key}?${searchParams}`;
}

function extrairNotas(html: string): string[][] {
  const $ = cheerio.load(html);
  const notas: string[][] = [];

  $("table.nota tbody tr").each((_, tr) => {
    const linhaNotas: string[] = [];
    $(tr)
      .find("td div")
      .each((_, div) => {
        const nota = $(div).text().trim();
        linhaNotas.push(nota);
      });
    notas.push(linhaNotas);
  });

  return notas;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("CEFETID_SSO");
    if (!token) throw new Error("CEFETID_SSO Cookie not found");

    const url = new URL(request.url);
    const queryParamsObj: Record<string, string> = {};

    url.searchParams.forEach((value, key) => {
      queryParamsObj[key] = value;
    });

    if (!queryParamsObj.key) throw new Error("Parâmetro 'key' obrigatório");

    const urlNotas = montarUrlNotas(queryParamsObj);

    const response = await axios.get(`${BASE_URL}${urlNotas}`, {
      headers: { Cookie: `JSESSIONIDSSO=${token.value}` },
    });

    const html = response.data as string;

    if (html.includes("Usuário sem permissão de acesso")) {
      return NextResponse.json(
        {
          error: "Usuário sem permissão de acesso",
          notas: [],
        },
        { status: 404 }
      );
    }

    const notas = extrairNotas(html);

    const arraysNumericos = notas.filter((arr) =>
      arr.every(
        (item) =>
          typeof item === "string" && item.trim().match(/^(\d+([.,]\d+)?)+$/)
      )
    );

    return NextResponse.json(
      {
        nota1: Array.from(new Set(arraysNumericos[0]))[0],
        nota2: Array.from(new Set(arraysNumericos[1]))[0],
        media: {
          media: arraysNumericos[2][0],
          exame: arraysNumericos[2][1],
          mediaFinal: arraysNumericos[2][2],
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro desconhecido",
        notas: [],
      },
      { status: 400 }
    );
  }
}
