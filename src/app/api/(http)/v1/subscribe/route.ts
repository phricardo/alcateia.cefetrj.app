import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("🔔 Nova inscrição recebida:");
    console.log(JSON.stringify(body, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao receber inscrição:", error);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
