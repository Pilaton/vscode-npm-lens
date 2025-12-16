/**
 * Utilities for parsing and handling semver version specifiers.
 * Only supports ^, ~, and exact versions.
 */

export type VersionPrefix = '^' | '~' | '';

export interface ParsedVersionSpec {
  /** The range prefix (^, ~, or empty for exact) */
  prefix: VersionPrefix;
  /** The version number without prefix */
  version: string;
  /** True if this is an exact version (no prefix) */
  isPinned: boolean;
  /** True if the format is supported (^, ~, or exact). False for wildcards, complex ranges, etc. */
  isSupported: boolean;
}

/**
 * Parse a version specifier to extract prefix and determine its type.
 * Only supports ^, ~, and exact versions.
 */
export function parseVersionSpec(spec: string): ParsedVersionSpec {
  const trimmed = spec.trim();

  if (trimmed.startsWith('^')) {
    return {
      prefix: '^',
      version: trimmed.slice(1),
      isPinned: false,
      isSupported: true,
    };
  }

  if (trimmed.startsWith('~')) {
    return {
      prefix: '~',
      version: trimmed.slice(1),
      isPinned: false,
      isSupported: true,
    };
  }

  // Check if it's a valid exact version (digits.digits.digits with optional prerelease)
  const isExact = /^\d+\.\d+\.\d+(-[\w.]+)?$/.test(trimmed);

  return {
    prefix: '',
    version: trimmed,
    isPinned: isExact,
    isSupported: isExact, // Only exact semver versions without prefix are supported
  };
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
  const { prefix } = parseVersionSpec(originalSpec);
  return `${prefix}${newVersion}`;
}
