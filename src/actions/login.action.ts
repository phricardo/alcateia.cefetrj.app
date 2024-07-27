"use server";

import { cookies } from "next/headers";
import { LOGIN_POST } from "@/functions/api";
import { IAuthenticatedUser } from "@/@types/authUser.type";
import { IActionResponse } from "@/@types/actionResponse.type";
import handleActionError from "@/functions/handleActionError";

export default async function LoginAction(
  state: {},
  formData: FormData
): Promise<IActionResponse<IAuthenticatedUser>> {
  const username = formData.get("username") as string | null;
  const password = formData.get("password") as string | null;

  try {
    if (!username || !password) throw new Error("Usuário ou Senha inválidos.");

    const { url, options } = LOGIN_POST({ username, password });
    const response = await fetch(url, options);

    const json = await response.json();
    if (!response.ok) throw new Error(json.error);

    cookies().set("CEFETID_STD", json.student.studentId, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });

    cookies().set("CEFETID_SSO", json.cookies.SSO.value, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });

    return {
      ok: true,
      error: null,
      data: json.student,
    };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
