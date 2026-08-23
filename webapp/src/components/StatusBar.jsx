/**
 * Maqueta da barra de estado do design (9:41, sinal, wifi, bateria).
 * Numa webapp real quem a desenha é o sistema — por isso está escondida
 * por omissão e só aparece com ?statusbar=1, para comparar com o design.
 */
export function useShowStatusBar() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('statusbar') === '1';
}

export default function StatusBar() {
  return (
    <div className="statusbar" aria-hidden="true">
      <span>9:41</span>
      <div className="row" style={{ gap: 5 }}>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="#1a1a18">
          <rect x="0" y="7" width="2.5" height="4" rx="0.8" />
          <rect x="4" y="5" width="2.5" height="6" rx="0.8" />
          <rect x="8" y="2.5" width="2.5" height="8.5" rx="0.8" />
          <rect x="12" y="0" width="2.5" height="11" rx="0.8" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="#1a1a18" strokeWidth="1.6" strokeLinecap="round">
          <path d="M1 4a9 9 0 0 1 13 0" />
          <path d="M3.5 6.6a5.6 5.6 0 0 1 8 0" />
          <circle cx="7.5" cy="9.3" r="0.9" fill="#1a1a18" stroke="none" />
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <rect x="0.6" y="0.6" width="19" height="10.8" rx="3" stroke="#1a1a18" strokeOpacity="0.4" />
          <rect x="2.2" y="2.2" width="15.8" height="7.6" rx="1.9" fill="#1a1a18" />
          <path d="M21.4 4.2v3.6a2 2 0 0 0 0-3.6z" fill="#1a1a18" fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
