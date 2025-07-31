import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { pdfToText } from "pdf-ts";

import {
  BASE_URL,
  capitalizeName,
  extractCPF,
  extractStudentInfo,
  extractUser,
  extractCampusFromSchedule,
  extractDisciplineNames,
} from "@/app/api/utils/links.util";

export function splitAndTrim(input: string): string[] {
  return input.split("-").map((part) => part.trim());
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("CEFETID_SSO");
    if (!token) throw new Error("CEFETID_SSO Cookie not found");

    // 1. Index para pegar nome e matrícula
    const indexResponse = await axios.get(`${BASE_URL}/aluno/index.action`, {
      headers: {
        Cookie: `JSESSIONIDSSO=${token.value}`,
      },
    });

    const { name, studentId } = extractUser(indexResponse.data);

    // 2. Perfil, Relatórios e comprovante
    const [profileResponse, docsResponse, pdfResponse] = await Promise.all([
      axios.get(`${BASE_URL}/aluno/aluno/perfil/perfil.action`, {
        headers: {
          Cookie: `JSESSIONIDSSO=${token.value}`,
        },
      }),
      axios.get(
        `${BASE_URL}/aluno/aluno/relatorio/relatorios.action?matricula=${studentId}`,
        {
          headers: {
            Cookie: `JSESSIONIDSSO=${token.value}`,
          },
        }
      ),
      axios.get(
        `${BASE_URL}/aluno/aluno/relatorio/com/comprovanteMatricula.action?matricula=${studentId}`,
        {
          headers: {
            Cookie: `JSESSIONIDSSO=${token.value}`,
          },
          responseType: "arraybuffer",
        }
      ),
    ]);

    const documentId = extractCPF(profileResponse.data);
    const rest = extractStudentInfo(docsResponse.data);

    const pdfBuffer = pdfResponse.data;
    const pdfText = await pdfToText(pdfBuffer);
    const campus = extractCampusFromSchedule(pdfText);
    const currentDisciplines = extractDisciplineNames(pdfText);
    const [courseCode, courseName] = splitAndTrim(rest.course ?? "");

    const urlMatch = pdfText.match(/Consultar em: (https?:\/\/[^\s]+)/);
    const consultationURL = urlMatch ? urlMatch[1] : null;
    const authCodeMatch = pdfText.match(/Autenticação: ([A-F0-9.]+)/);
    const authCode = authCodeMatch ? authCodeMatch[1] : null;

    // 4. Monta o usuário final
    const user = {
      name: capitalizeName(name),
      studentId,
      campus,
      document: {
        type: "NATURAL_PERSON",
        id: documentId,
      },
      ...rest,
      studentCard: {
        consultationURL,
        authCode,
      },
      currentDisciplines,
      course: courseName,
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
