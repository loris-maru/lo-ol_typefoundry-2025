function slugify(
  input: unknown,
  {
    replacement = "-",
    lower = true,
    maxLength,
    fallback = "n-a",
  }: {
    replacement?: string;
    lower?: boolean;
    maxLength?: number;
    fallback?: string;
  } = {},
) {
  let str = String(input ?? "");

  // 1) Normalize & strip accents (é -> e, ü -> u, etc.)
  str = str.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

  // 2) Common word-ish tweaks
  str = str.replace(/&/g, " and ");

  // 3) Replace any run of non-alphanumerics with the replacement
  str = str.replace(/[^a-zA-Z0-9]+/g, replacement);

  // 4) Collapse repeats of the replacement
  const repEsc = replacement.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  str = str.replace(new RegExp(`${repEsc}{2,}`, "g"), replacement);

  // 5) Trim replacement from ends
  str = str.replace(new RegExp(`^${repEsc}|${repEsc}$`, "g"), "");

  // 6) Lowercase
  if (lower) str = str.toLowerCase();

  // 7) Optional max length
  if (typeof maxLength === "number" && maxLength > 0) {
    str = str.slice(0, maxLength).replace(new RegExp(`${repEsc}$`), "");
  }

  return str || fallback;
}

export default slugify;
