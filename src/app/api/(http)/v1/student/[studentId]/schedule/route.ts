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
    if (!studentId) throw new Error("studentId not found");

    const token = request.cookies.get("CEFETID_SSO");
    if (!token) throw new Error("CEFETID_SSO Cookie not found");

    const indexResponse = await client.get(
      `https://alunos.cefet-rj.br/aluno/aluno/relatorio/comprovanteMatricula.action?matricula=${studentId}`,
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

    const scheduleRegex =
      /(\d+)\s*-\s*(\w+)-feira\s+(\d{2}:\d{2})\s+(\d{2}:\d{2})\s+(\d{4}-\d{2}-\d{2})\s+(\d{4}-\d{2}-\d{2})\s+([A-Z0-9]+)\s*-\s*([^]*?)(?=\n\d+\s*-|\n?$)/g;

    const scheduleSet = new Set<string>();
    const schedule: any[] = [];

    let match;
    while ((match = scheduleRegex.exec(text)) !== null) {
      const [
        _,
        courseNumber,
        weekday,
        startTime,
        endTime,
        startDate,
        endDate,
        courseCode,
        courseName,
      ] = match;

      const scheduleItem = JSON.stringify({
        courseNumber,
        weekday,
        startTime,
        endTime,
        startDate,
        endDate,
        courseCode,
        courseName: courseName.trim().split("Local:")[0],
        location: courseName
          .trim()
          .split("Local:")[1]
          .split("Autenticação:")[0],
      });

      const uniqueKey = `${courseName}-${courseCode}`;

      if (!scheduleSet.has(uniqueKey)) {
        scheduleSet.add(uniqueKey);
        schedule.push(JSON.parse(scheduleItem));
      }
    }

    return NextResponse.json({ schedule }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Please try again later.",
      },
      { status: 400 }
    );
  }
}
