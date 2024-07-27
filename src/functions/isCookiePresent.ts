"use server";

import { cookies } from "next/headers";

export default async function isCookiePresent(name: string): Promise<boolean> {
  const cookie = cookies().get(name);
  return !!cookie;
}
