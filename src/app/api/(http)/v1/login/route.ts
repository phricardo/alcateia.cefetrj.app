import axios from "axios";
import tough from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { NextRequest, NextResponse } from "next/server";
import {
  BASE_URL,
  capitalizeName,
  extractPnotifyText,
  extractUser,
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
      const SSO = cookies.find((cookie) => cookie.key === "JSESSIONIDSSO");

      if (SSO) {
        const indexResponse = await client.get(
          `${BASE_URL}/aluno/index.action`,
          {
            headers: {
              Cookie: `JSESSIONIDSSO=${SSO.value}`,
            },
          }
        );

        const { name, studentId } = extractUser(indexResponse.data);

        return NextResponse.json(
          {
            status: { ok: true },
            student: {
              name: capitalizeName(name),
              studentId,
            },
            cookies: { SSO },
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
