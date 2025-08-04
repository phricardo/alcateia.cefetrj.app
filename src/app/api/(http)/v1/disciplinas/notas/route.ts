import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/app/api/utils/links.util";

function montarUrlNotas(queryParams: Record<string, string>): string {
  const { key, ...params } = queryParams;
  const searchParams = new URLSearchParams(params).toString();
  return `/aluno/ajax/aluno/nota/notaturma.action;jsessionid=${key}?${searchParams}`;
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
          htmlNotas: "",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ htmlNotas: html }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro desconhecido",
        htmlNotas: "",
      },
      { status: 400 }
    );
  }
}
