import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | AlumPRO` : 'AlumPRO - Gestão Industrial para Esquadrias';
  }, [title]);
}
