import axios from "axios";
import tough from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { NextRequest, NextResponse } from "next/server";
import {
  BASE_URL,
  capitalizeName,
  extractCPF,
  extractStudentInfo,
  extractUser,
} from "@/app/api/utils/links.util";

const cookieJar = new tough.CookieJar();
const client = wrapper(axios.create({ jar: cookieJar, withCredentials: true }));

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("CEFETID_SSO");
    if (!token) throw new Error("CEFETID_SSO Cookie not found");

    const indexResponse = await client.get(`${BASE_URL}/aluno/index.action`, {
      headers: {
        Cookie: `JSESSIONIDSSO=${token.value}`,
      },
    });

    const { name, studentId } = extractUser(indexResponse.data);

    const [profileResponse, docsResponse] = await Promise.all([
      client.get(`${BASE_URL}/aluno/aluno/perfil/perfil.action`, {
        headers: {
          Cookie: `JSESSIONIDSSO=${token.value}`,
        },
      }),
      client.get(
        `${BASE_URL}/aluno/aluno/relatorio/relatorios.action?matricula=${studentId}`,
        {
          headers: {
            Cookie: `JSESSIONIDSSO=${token.value}`,
          },
        }
      ),
    ]);

    const documentId = extractCPF(profileResponse.data);
    const rest = extractStudentInfo(docsResponse.data);

    const user = {
      name: capitalizeName(name),
      studentId,
      document: {
        type: "NATURAL_PERSON",
        documentId,
      },
      ...rest,
    };

    return NextResponse.json({ user }, { status: 200 });
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
