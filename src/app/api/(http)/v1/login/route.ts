import axios from "axios";
import cheerio from "cheerio";
import tough from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { NextRequest, NextResponse } from "next/server";
import {
  BASE_URL,
  capitalizeName,
  extractCPF,
  extractPnotifyText,
  extractStudentInfo,
} from "@/app/api/utils/links.util";

const MAX_RETRIES = 2;
const cookieJar = new tough.CookieJar();
const client = wrapper(axios.create({ jar: cookieJar, withCredentials: true }));

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const response = await client.post(
        `${BASE_URL}/aluno/j_security_check`,
        `j_username=${encodeURIComponent(
          username
        )}&j_password=${encodeURIComponent(password)}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const pnotifyText = extractPnotifyText(response.data);
      if (pnotifyText) throw new Error(pnotifyText);

      const cookies = cookieJar.getCookiesSync(BASE_URL);
      const jsessionidCookieAfterLogin = cookies.find(
        (cookie) => cookie.key === "JSESSIONIDSSO"
      );

      if (jsessionidCookieAfterLogin) {
        const indexResponse = await client.get(
          `${BASE_URL}/aluno/index.action`,
          {
            headers: {
              Cookie: `JSESSIONIDSSO=${jsessionidCookieAfterLogin.value}`,
            },
          }
        );

        const $ = cheerio.load(indexResponse.data);
        const name = $("span#menu > button").text().trim();
        const studentId = $("#matricula").val() as string;

        const [profileResponse, docsResponse] = await Promise.all([
          client.get(`${BASE_URL}/aluno/aluno/perfil/perfil.action`, {
            headers: {
              Cookie: `JSESSIONIDSSO=${jsessionidCookieAfterLogin.value}`,
            },
          }),
          client.get(
            `${BASE_URL}/aluno/aluno/relatorio/relatorios.action?matricula=${studentId}`,
            {
              headers: {
                Cookie: `JSESSIONIDSSO=${jsessionidCookieAfterLogin.value}`,
              },
            }
          ),
        ]);

        const documentId = extractCPF(profileResponse.data);
        const studentData = extractStudentInfo(docsResponse.data);

        return NextResponse.json(
          {
            status: { ok: true },
            student: {
              name: capitalizeName(name),
              studentId,
              document: {
                type: "NATURAL_PERSON",
                id: documentId,
              },
              ...studentData,
            },
            cookies: { SSO: jsessionidCookieAfterLogin },
          },
          { status: 200 }
        );
      }

      if (attempt === MAX_RETRIES)
        throw new Error("Tente novamente mais tarde.");
    }
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
