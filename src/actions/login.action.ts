"use server";

import { cookies } from "next/headers";
import { LOGIN_POST } from "@/functions/api";
import { IAuthenticatedUser } from "@/@types/authUser.type";

export default async function LoginAction(
  state: {},
  formData: FormData
): Promise<{
  ok: boolean;
  error: string | null;
  data: IAuthenticatedUser | null;
}> {
  const username = formData.get("username") as string | null;
  const password = formData.get("password") as string | null;

  try {
    if (!username || !password) throw new Error("Data Required");
    const { url, options } = LOGIN_POST({ username, password });
    const response = await fetch(url, options);

    if (!response.ok) throw new Error("Login failed");

    const loginJson = await response.json();
    const studentId = loginJson.student.studentId;
    const JSESSIONIDSSO = loginJson.cookies.JSESSIONIDSSO.value;

    cookies().set("INTCEFETRJ_STD", studentId, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "none",
    });

    cookies().set("INTCEFETRJ__SSO", JSESSIONIDSSO, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "none",
    });

    return {
      ok: true,
      error: null,
      data: loginJson.student,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      error: "Error occurred.",
      data: null,
    };
  }
}
