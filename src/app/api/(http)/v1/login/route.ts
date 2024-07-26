import axios from "axios";
import cheerio from "cheerio";
import tough from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { NextRequest, NextResponse } from "next/server";
import {
  BASE_URL,
  capitalizeName,
  extractCPF,
  extractStudentInfo,
} from "@/app/api/utils/links.util";

const MAX_RETRIES = 2;
const cookieJar = new tough.CookieJar();
const client = wrapper(axios.create({ jar: cookieJar, withCredentials: true }));

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      await client.post(
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

      const cookies = cookieJar.getCookiesSync(BASE_URL);
      const jsessionidCookieAfterLogin = cookies.find(
        (cookie) => cookie.key === "JSESSIONIDSSO"
      );

      if (jsessionidCookieAfterLogin) {
        const response = await client.get(`${BASE_URL}/aluno/index.action`, {
          headers: {
            Cookie: `JSESSIONIDSSO=${jsessionidCookieAfterLogin.value}`,
          },
        });

        const $ = cheerio.load(response.data);
        const name = $("span#menu > button").text().trim();
        const studentId = $("#matricula").val() as string;

        const profileResponse = await client.get(
          `${BASE_URL}/aluno/aluno/perfil/perfil.action`,
          {
            headers: {
              Cookie: `JSESSIONIDSSO=${jsessionidCookieAfterLogin.value}`,
            },
          }
        );

        const docsResponse = await client.get(
          `${BASE_URL}/aluno/aluno/relatorio/relatorios.action?matricula=${studentId}`,
          {
            headers: {
              Cookie: `JSESSIONIDSSO=${jsessionidCookieAfterLogin.value}`,
            },
          }
        );

        const cpf = extractCPF(profileResponse.data);
        const studentData = extractStudentInfo(docsResponse.data);

        return NextResponse.json(
          {
            status: { ok: true },
            student: {
              name: capitalizeName(name),
              studentId,
              cpf,
              ...studentData,
            },
            cookies: { JSESSIONIDSSO: jsessionidCookieAfterLogin },
          },
          { status: 200 }
        );
      }

      if (attempt === MAX_RETRIES) {
        return NextResponse.json(
          {
            error: "Authentication failed.",
          },
          { status: 401 }
        );
      }
    }
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Authentication failed.",
      },
      { status: 400 }
    );
  }
}
