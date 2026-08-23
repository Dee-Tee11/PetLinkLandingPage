import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import StatusBar, { useShowStatusBar } from './StatusBar';
import TabBar from './TabBar';

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const showStatusBar = useShowStatusBar();
  const scrollRef = useRef(null);

  // Cada ecrã começa no topo (o handoff só pede posição preservada por separador,
  // e o browser já trata disso ao usar voltar).
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="shell">
      <div className="shell-blob lavender" />
      <div className="shell-blob sage" />
      <div className="shell-blob sand" />
      <div className="shell-grain" />

      <div className="shell-column">
        {showStatusBar && <StatusBar />}
        <main className="shell-scroll" ref={scrollRef}>
          <div key={pathname} className="screen-anim">
            {children}
          </div>
        </main>
        <TabBar />
      </div>
    </div>
  );
}
