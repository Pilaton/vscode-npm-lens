/**
 * Fetch download statistics from npm API.
 */

interface DownloadData {
  day: string;
  downloads: number;
}

interface NpmDownloadsResponse {
  downloads: DownloadData[];
  start: string;
  end: string;
  package: string;
}

/**
 * Fetch weekly download statistics for a package.
 */
export async function fetchDownloadStats(packageName: string): Promise<number[] | null> {
  try {
    const response = await fetch(
      `https://api.npmjs.org/downloads/range/last-month/${encodeURIComponent(packageName)}`
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as NpmDownloadsResponse;
    return data.downloads.map((d) => d.downloads);
  } catch (error) {
    console.error('Failed to fetch download stats:', error);
    return null;
  }
}

/**
 * Format large numbers for display (e.g., 1234567 -> "1.2M").
 */
export function formatDownloads(total: number): string {
  if (total >= 1_000_000) {
    return `${(total / 1_000_000).toFixed(1)}M`;
  }
  if (total >= 1_000) {
    return `${(total / 1_000).toFixed(1)}K`;
  }
  return total.toString();
}
