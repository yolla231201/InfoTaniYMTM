import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      `${process.env.APPS_SCRIPT_URL}?secret=${process.env.APPS_SCRIPT_SECRET}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );



    const result = await response.json();
    console.log("[Apps Script response]", JSON.stringify(result)); // ← tambah di sini



    // Jadi:
    if (!result.success) {
      console.error("[Apps Script error]", result.error);
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.id });

    // Jadi:
  } catch (err) {
    console.error("[catch error]", err);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}