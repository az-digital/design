type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function countTokens(node: unknown): { total: number; color: number } {
  if (!isObject(node)) {
    return { total: 0, color: 0 };
  }
  if ('$value' in node) {
    return { total: 1, color: node.$type === 'color' ? 1 : 0 };
  }

  let total = 0;
  let color = 0;
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$') || !isObject(value)) {
      continue;
    }
    const counts = countTokens(value);
    total += counts.total;
    color += counts.color;
  }
  return { total, color };
}

// Browsers ignore the `download` attribute for cross-origin links (e.g. raw.githubusercontent.com),
// so build a same-origin blob from the token data already bundled from this codebase.
export function downloadJson(data: unknown, filename: string): void {
  downloadText(JSON.stringify(data, null, 2), filename, 'application/json');
}

export function downloadText(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
