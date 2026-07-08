export function parseCvPaths(cvPath: string | null | undefined): string[] {
  if (!cvPath) return [];
  const trimmed = cvPath.trim();
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map(String).filter(Boolean);
      }
    } catch {
      // Fall back to treating the value as a single storage path.
    }
  }
  return [trimmed];
}

export function serializeCvPaths(paths: string[]): string | null {
  if (paths.length === 0) return null;
  if (paths.length === 1) return paths[0];
  return JSON.stringify(paths);
}
