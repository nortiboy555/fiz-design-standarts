import { put } from "@vercel/blob";

export async function uploadBuffer(
  buffer: Buffer | ArrayBuffer,
  filename: string,
  contentType: string = "image/png"
): Promise<{ url: string; pathname: string }> {
  const blob = await put(`images/${filename}`, buffer, {
    access: "public",
    contentType,
    addRandomSuffix: true,
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
  };
}
