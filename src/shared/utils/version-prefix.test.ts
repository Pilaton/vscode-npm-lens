import { describe, expect, it } from 'vitest';
import { parseVersionSpec, preservePrefix } from './version-prefix';

describe('parseVersionSpec', () => {
  it('parses caret versions', () => {
    const result = parseVersionSpec('^1.2.3');
    expect(result).toEqual({
      prefix: '^',
      version: '1.2.3',
      isPinned: false,
      isSupported: true,
    });
  });

  it('parses tilde versions', () => {
    const result = parseVersionSpec('~1.2.3');
    expect(result).toEqual({
      prefix: '~',
      version: '1.2.3',
      isPinned: false,
      isSupported: true,
    });
  });

  it('parses exact versions', () => {
    const result = parseVersionSpec('1.2.3');
    expect(result).toEqual({
      prefix: '',
      version: '1.2.3',
      isPinned: true,
      isSupported: true,
    });
  });

  it('parses prerelease versions', () => {
    const result = parseVersionSpec('1.2.3-beta.1');
    expect(result).toEqual({
      prefix: '',
      version: '1.2.3-beta.1',
      isPinned: true,
      isSupported: true,
    });
  });

  it('parses caret with prerelease', () => {
    const result = parseVersionSpec('^1.2.3-alpha');
    expect(result).toEqual({
      prefix: '^',
      version: '1.2.3-alpha',
      isPinned: false,
      isSupported: true,
    });
  });

  it('marks wildcards as unsupported', () => {
    const result = parseVersionSpec('1.x');
    expect(result.isSupported).toBe(false);
  });

  it('marks complex ranges as unsupported', () => {
    const result = parseVersionSpec('>=1.0.0 <2.0.0');
    expect(result.isSupported).toBe(false);
  });

  it('marks tags as unsupported', () => {
    const result = parseVersionSpec('latest');
    expect(result.isSupported).toBe(false);
  });

  it('trims whitespace', () => {
    const result = parseVersionSpec('  ^1.2.3  ');
    expect(result.prefix).toBe('^');
    expect(result.version).toBe('1.2.3');
  });
});

describe('preservePrefix', () => {
  it('preserves caret prefix', () => {
    expect(preservePrefix('^1.0.0', '2.0.0')).toBe('^2.0.0');
  });

  it('preserves tilde prefix', () => {
    expect(preservePrefix('~1.0.0', '1.1.0')).toBe('~1.1.0');
  });

  it('preserves exact (no prefix)', () => {
    expect(preservePrefix('1.0.0', '2.0.0')).toBe('2.0.0');
  });

  it('handles prerelease in original', () => {
    expect(preservePrefix('^1.0.0-beta', '1.0.0')).toBe('^1.0.0');
  });
});
