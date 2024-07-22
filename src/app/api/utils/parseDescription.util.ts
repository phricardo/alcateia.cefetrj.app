export function parseDescription(description: string | string[]): string {
  const desc = Array.isArray(description) ? description[0] : description;

  if (typeof desc === "string") {
    const text = desc.replace(/<[^>]+>/g, "").trim();
    return text.length > 300 ? text.substring(0, 300) + "..." : text;
  }

  return "";
}

export function parseImageUrl(description: string | string[]): string | null {
  const desc = Array.isArray(description) ? description[0] : description;
  const match =
    typeof desc === "string" ? desc.match(/<img[^>]+src="([^">]+)"/) : null;
  return match?.[1] ?? null;
}
