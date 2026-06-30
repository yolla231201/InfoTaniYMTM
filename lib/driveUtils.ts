/**
 * Mengkonversi Google Drive share link menjadi URL thumbnail yang bisa dipakai di <img src>
 * @param url - Google Drive URL (format /view atau /open)
 * @param size - Lebar thumbnail dalam pixel (default 400)
 * @returns URL thumbnail langsung, atau URL asli jika bukan link Drive
 */
export function getDriveThumbUrl(url: string, size: number = 400): string {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match
    ? `https://drive.google.com/thumbnail?id=${match[1]}&sz=w${size}`
    : url;
}

/**
 * Mengekstrak file ID dari Google Drive URL
 * @param url - Google Drive URL
 * @returns File ID atau null jika bukan link Drive
 */
export function getDriveFileId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Mengecek apakah URL adalah Google Drive link
 */
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes("drive.google.com");
}

/**
 * Mengkonversi Google Drive share link menjadi URL embed untuk video
 * Gunakan ini di dalam <iframe> bukan <video>
 * @param url - Google Drive URL
 * @returns URL embed Drive, atau URL asli jika bukan link Drive
 */
export function getDriveEmbedUrl(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match
    ? `https://drive.google.com/file/d/${match[1]}/preview`
    : url;
}

/**
 * Mengkonversi Google Drive share link menjadi URL thumbnail untuk video
 * Gunakan ini untuk thumbnail preview sebelum dibuka
 */
export function getDriveVideoThumbUrl(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match
    ? `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`
    : url;
}