"use server";

import { cookies } from "next/headers";
import { IActionResponse } from "@/@types/actionResponse.type";
import isCookiePresent from "@/functions/isCookiePresent";
import handleActionError from "@/functions/handleActionError";

export default async function LogoutAction(
  state: {},
  formData: FormData
): Promise<IActionResponse> {
  try {
    cookies().delete("CEFETID_SSO");

    const cookiesRemoved = await isCookiePresent("CEFETID_SSO");
    if (!cookiesRemoved) throw new Error("Unable to log out");

    return {
      ok: cookiesRemoved,
      error: null,
      data: null,
    };
  } catch (error: unknown) {
    return handleActionError(error);
  }
}
