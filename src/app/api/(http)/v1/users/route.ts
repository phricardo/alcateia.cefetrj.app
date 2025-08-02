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

function splitAndTrim(input: string): string[] {
  return input.split("-").map((part) => part.trim());
}

function parseEnrollment(enrollment?: string) {
  if (!enrollment || enrollment.length < 3) return null;

  const raw = enrollment.slice(0, 3);
  const year = parseInt(`20${raw.slice(0, 2)}`, 10);
  const semesterDigit = raw[2];

  const semesterLabel =
    semesterDigit === "1"
      ? "1º Semestre"
      : semesterDigit === "2"
      ? "2º Semestre"
      : "Semestre Desconhecido";

  return {
    enrollmentYearSemester: `${year}.${semesterDigit}`,
    enrollmentLabel: `${semesterLabel}/${year}`,
  };
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

    // 2. Perfil e Relatórios (obrigatórios)
    const [profileResponse, docsResponse] = await Promise.all([
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
    ]);

    const documentId = extractCPF(profileResponse.data);
    const rest = extractStudentInfo(docsResponse.data);

    // 3. Comprovante de matrícula (opcional)
    let pdfText = "";
    try {
      const pdfResponse = await axios.get(
        `${BASE_URL}/aluno/aluno/relatorio/com/comprovanteMatricula.action?matricula=${studentId}`,
        {
          headers: {
            Cookie: `JSESSIONIDSSO=${token.value}`,
          },
          responseType: "arraybuffer",
        }
      );
      const pdfBuffer = pdfResponse.data;
      pdfText = await pdfToText(pdfBuffer);
    } catch (err) {
      console.warn("Falha ao buscar ou processar o comprovante de matrícula.");
    }

    // 4. Extrações com fallback
    const campus = extractCampusFromSchedule(pdfText);
    const currentDisciplines = extractDisciplineNames(pdfText);
    const [courseCode, courseName] = splitAndTrim(rest.course ?? "");

    const urlMatch = pdfText.match(/Consultar em: (https?:\/\/[^\s]+)/);
    const consultationURL = urlMatch ? urlMatch[1] : null;

    const authCodeMatch = pdfText.match(/Autenticação: ([A-F0-9.]+)/);
    const authCode = authCodeMatch ? authCodeMatch[1] : null;

    const enrollmentInfo = parseEnrollment(rest.enrollment);

    // 5. Monta o usuário final
    const user = {
      name: capitalizeName(name),
      studentId,
      campus,
      document: {
        type: "NATURAL_PERSON",
        id: documentId,
      },
      ...rest,
      ...enrollmentInfo,
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
