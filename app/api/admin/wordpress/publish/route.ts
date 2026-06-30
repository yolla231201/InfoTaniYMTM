import { NextRequest, NextResponse } from "next/server";

// Mengambil file gambar dari Google Drive lalu upload ke WordPress Media Library,
// mengembalikan media ID yang dipakai sebagai featured image.
async function uploadFeaturedImageToWP(driveUrl: string, wpUrl: string, authHeader: string): Promise<number | null> {
  // Ekstrak file ID dari link Google Drive
  const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  const fileId = match[1];

  // Download file langsung dari Drive (uc?export=download menghasilkan binary asli)
  const driveDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const imageRes = await fetch(driveDownloadUrl);
  if (!imageRes.ok) return null;

  const imageBuffer = await imageRes.arrayBuffer();
  const contentType = imageRes.headers.get("content-type") || "image/jpeg";

  // Upload ke WordPress Media Library
  const uploadRes = await fetch(`${wpUrl}/wp-json/wp/v2/media`, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="foto-utama-${fileId}.jpg"`,
    },
    body: imageBuffer,
  });

  if (!uploadRes.ok) return null;
  const uploadData = await uploadRes.json();
  return uploadData.id ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const { judul, konten, fotoUtamaUrl, categoryId } = await req.json();
    console.log("[wordpress/publish] payload diterima:", { judul, fotoUtamaUrl, categoryId, kontenLength: konten?.length });

    const wpUrl = process.env.WORDPRESS_URL;
    const wpUser = process.env.WORDPRESS_USERNAME;
    const wpPass = process.env.WORDPRESS_APP_PASSWORD;

    console.log("[wordpress/publish] env check:", { wpUrl, wpUser, wpPassSet: !!wpPass });

    if (!wpUrl || !wpUser || !wpPass) {
      return NextResponse.json({ success: false, error: "Konfigurasi WordPress belum lengkap di server (.env.local)." }, { status: 500 });
    }

    if (!judul || !konten) {
      return NextResponse.json({ success: false, error: "Judul dan isi artikel wajib diisi." }, { status: 400 });
    }

    const authHeader = "Basic " + Buffer.from(`${wpUser}:${wpPass}`).toString("base64");

    // Upload foto utama dulu jika ada
    let featuredMediaId: number | null = null;
    if (fotoUtamaUrl) {
      try {
        console.log("[wordpress/publish] mulai upload foto utama dari Drive:", fotoUtamaUrl);
        featuredMediaId = await uploadFeaturedImageToWP(fotoUtamaUrl, wpUrl, authHeader);
        console.log("[wordpress/publish] hasil upload foto, media ID:", featuredMediaId);
      } catch (imgErr) {
        console.error("[wordpress/publish] GAGAL upload foto utama:", imgErr);
        // Lanjutkan publish tanpa foto utama, jangan gagalkan semuanya
      }
    }

    // Susun payload post WordPress
    const postPayload: Record<string, unknown> = {
      title: judul,
      content: konten.replace(/\n/g, "<br/>\n"),
      status: "publish",
    };

    if (featuredMediaId) postPayload.featured_media = featuredMediaId;
    if (categoryId) postPayload.categories = [categoryId];

    console.log("[wordpress/publish] mengirim post ke:", `${wpUrl}/wp-json/wp/v2/posts`);

    const postRes = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postPayload),
    });

    const rawText = await postRes.text();
    console.log("[wordpress/publish] response status:", postRes.status);
    console.log("[wordpress/publish] response body (mentah):", rawText.slice(0, 1000));

    let postData: any;
    try {
      postData = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { success: false, error: "WordPress tidak mengembalikan JSON. Kemungkinan URL salah, REST API diblokir, atau ada redirect/plugin yang mengganggu. Cek log server untuk detail." },
        { status: 500 }
      );
    }

    if (!postRes.ok) {
      return NextResponse.json(
        { success: false, error: postData.message || `Gagal publish ke WordPress (status ${postRes.status}).` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      link: postData.link,
      postId: postData.id,
    });
  } catch (err) {
    console.error("[wordpress/publish error] EXCEPTION:", err);
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}