import { useEffect, useState } from 'react';
import type NpmPackageService from '../../../services/npm-provider';
import DeprecatedBadge from '../info-extended/deprecated-badge';

interface DeprecatedStatusProps {
  name: string;
  npmProvider: NpmPackageService;
}

export default function DeprecatedStatus({ name, npmProvider }: DeprecatedStatusProps) {
  const [deprecatedMessage, setDeprecatedMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const data = await npmProvider.getPackageData(name);
      if (isMounted && data?.deprecated) {
        setDeprecatedMessage(data.deprecated);
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [name, npmProvider]);

  return <DeprecatedBadge message={deprecatedMessage} />;
}
