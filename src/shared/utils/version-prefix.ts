/**
 * Utilities for parsing and preserving semver range prefixes.
 */

type VersionPrefix = '^' | '~' | '';

interface ParsedVersion {
  prefix: VersionPrefix;
  version: string;
}

/**
 * Extract the range prefix (^, ~, or exact) from a version specifier.
 */
function parseVersionPrefix(spec: string): ParsedVersion {
  const trimmed = spec.trim();

  if (trimmed.startsWith('^')) {
    return { prefix: '^', version: trimmed.slice(1) };
  }

  if (trimmed.startsWith('~')) {
    return { prefix: '~', version: trimmed.slice(1) };
  }

  // Exact version or complex range - treat as exact
  return { prefix: '', version: trimmed };
}

/**
 * Given an original version specifier and a new version number,
 * construct the new specifier preserving the original prefix.
 * Examples:
 * - preservePrefix("^1.0.0", "1.2.3") -> "^1.2.3"
 * - preservePrefix("~1.0.0", "1.2.3") -> "~1.2.3"
 * - preservePrefix("1.0.0",  "1.2.3") -> "1.2.3"
 */
export function preservePrefix(originalSpec: string, newVersion: string): string {
  const { prefix } = parseVersionPrefix(originalSpec);
  return `${prefix}${newVersion}`;
}
