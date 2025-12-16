import { useEffect, useState } from 'react';
import { fetchDownloadStats, formatDownloads } from '../../../services/downloads-api';

interface DownloadStatsProps {
  packageName: string;
}

export default function DownloadStats({ packageName }: DownloadStatsProps) {
  const [downloads, setDownloads] = useState<number[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchDownloadStats(packageName).then((data) => {
      if (isMounted) {
        setDownloads(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [packageName]);

  if (isLoading) {
    return <span style={{ opacity: 0.5 }}>...</span>;
  }

  if (!downloads || downloads.length === 0) {
    return <span>—</span>;
  }

  // Calculate weekly average (last 7 days)
  const lastWeek = downloads.slice(-7);
  const weeklyTotal = lastWeek.reduce((sum, d) => sum + d, 0);

  return <span>{formatDownloads(weeklyTotal)}/week</span>;
}
