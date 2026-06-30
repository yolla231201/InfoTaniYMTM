import { NextResponse } from "next/server";

export async function GET() {
  try {
    const wpUrl = process.env.WORDPRESS_URL;
    const wpUser = process.env.WORDPRESS_USERNAME;
    const wpPass = process.env.WORDPRESS_APP_PASSWORD;

    if (!wpUrl || !wpUser || !wpPass) {
      return NextResponse.json({ success: false, error: "Konfigurasi WordPress belum lengkap di server." }, { status: 500 });
    }

    const authHeader = "Basic " + Buffer.from(`${wpUser}:${wpPass}`).toString("base64");

    const res = await fetch(`${wpUrl}/wp-json/wp/v2/categories?per_page=100&orderby=name&order=asc`, {
      headers: { Authorization: authHeader },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: `Gagal mengambil kategori (status ${res.status}).` }, { status: 500 });
    }

    const data = await res.json();
    const categories = data.map((c: { id: number; name: string; count: number }) => ({
      id: c.id,
      name: c.name,
      count: c.count,
    }));

    return NextResponse.json({ success: true, categories });
  } catch (err) {
    console.error("[wordpress/categories error]", err);
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}