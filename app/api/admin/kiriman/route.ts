import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.APPS_SCRIPT_URL}?secret=${process.env.APPS_SCRIPT_SECRET}`,
      { method: "GET" }
    );

    const result = await response.json();

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });

  } catch (err) {
    console.error("[admin/kiriman error]", err);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}