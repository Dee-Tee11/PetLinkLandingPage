import { useEffect, useState } from 'react';

/**
 * Deteção por largura de janela, não por User-Agent.
 * O UA mente (o iPad diz-se Mac, o Chrome Android tem "modo desktop") e não
 * reage a redimensionamentos. A largura reage — e é o que decide se cabe
 * um layout de desktop ou não.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** A partir daqui há espaço para navegação lateral e várias colunas. */
export const DESKTOP = '(min-width: 1024px)';
