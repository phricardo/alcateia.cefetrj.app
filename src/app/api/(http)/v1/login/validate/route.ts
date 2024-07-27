import axios from "axios";
import cheerio from "cheerio";
import tough from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/app/api/utils/links.util";

const cookieJar = new tough.CookieJar();
const client = wrapper(axios.create({ jar: cookieJar, withCredentials: true }));

export async function POST(request: NextRequest) {
  try {
    const SSO = request.cookies.get("CEFETID_SSO");

    const response = await client.get(`${BASE_URL}/aluno/index.action`, {
      headers: {
        Cookie: `JSESSIONIDSSO=${SSO?.value}`,
      },
    });

    const $ = cheerio.load(response.data);
    const studentId = $("#matricula").val() as string;
    const isAuthenticatedUser = studentId ? true : false;

    let statusCode = 200;
    if (!isAuthenticatedUser) statusCode = 401;

    return NextResponse.json({ isAuthenticatedUser }, { status: statusCode });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Authentication failed.",
      },
      { status: 400 }
    );
  }
}
