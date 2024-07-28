import axios from "axios";
import tough from "tough-cookie";
import { pdfToText } from "pdf-ts";
import { wrapper } from "axios-cookiejar-support";
import { NextRequest, NextResponse } from "next/server";

const cookieJar = new tough.CookieJar();
const client = wrapper(axios.create({ jar: cookieJar, withCredentials: true }));

type ContextParams = {
  studentId: string;
};

export async function GET(
  request: NextRequest,
  context: { params: ContextParams }
) {
  try {
    const { studentId } = context.params;

    const token = request.cookies.get("CEFETID_SSO");
    if (!token) throw new Error("CEFETID_SSO Cookie not found");

    const indexResponse = await client.get(
      `https://alunos.cefet-rj.br/aluno/aluno/relatorio/com/comprovanteMatricula.action?matricula=${studentId}`,
      {
        headers: {
          Cookie: `JSESSIONIDSSO=${token.value}`,
        },
        responseType: "arraybuffer",
      }
    );

    const pdfBuffer = indexResponse.data;

    if (!pdfBuffer || pdfBuffer.length === 0)
      throw new Error("Failed to retrieve PDF buffer.");

    const text = await pdfToText(pdfBuffer);

    const urlMatch = text.match(/Consultar em: (https?:\/\/[^\s]+)/);
    const consultationURL = urlMatch ? urlMatch[1] : null;

    const authCodeMatch = text.match(/Autenticação: ([A-F0-9.]+)/);
    const authCode = authCodeMatch ? authCodeMatch[1] : null;
    if (!authCode) throw new Error("Not found auth code");

    return NextResponse.json(
      {
        student: {
          code: authCode,
          url: `${consultationURL}?cod=${authCode
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/\./g, "")}`,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Tente novamente mais tarde.",
      },
      { status: 400 }
    );
  }
}
