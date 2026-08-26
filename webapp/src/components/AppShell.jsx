import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import StatusBar, { useShowStatusBar } from './StatusBar';
import TabBar from './TabBar';
import Sidebar from './Sidebar';
import useMediaQuery, { DESKTOP } from '../lib/useMediaQuery';

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const showStatusBar = useShowStatusBar();
  const isDesktop = useMediaQuery(DESKTOP);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  // Ecrãs de entrada e de saída: sem navegação, nem lateral nem inferior.
  // A conversa é excluída de propósito — em desktop precisa da barra lateral
  // para se poder sair dela sem usar o botão de voltar.
  const bare = ['/', '/registo', '/confirmado'].includes(pathname);

  if (isDesktop && !bare) {
    return (
      <div className="shell desktop">
        <div className="shell-ambient" aria-hidden="true" />
        <Sidebar />
        <main className="desk-main" ref={scrollRef}>
          <div key={pathname} className="desk-content screen-anim">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`shell${isDesktop ? ' desktop-bare' : ''}`}>
      <div className="shell-ambient" aria-hidden="true" />
      {isDesktop && <WelcomePanel />}
      <div className="shell-column">
        <div className="shell-blob lavender" />
        <div className="shell-blob sage" />
        <div className="shell-blob sand" />
        <div className="shell-grain" />

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

/** Painel de boas-vindas: em desktop os ecrãs de entrada ocupam o ecrã todo,
    com a marca de um lado e o formulário do outro. */
function WelcomePanel() {
  return (
    <aside className="welcome-panel">
      <div className="welcome-inner">
        <img src="/images/logo/logo.svg" alt="" width="56" height="56" />
        <p className="welcome-title">
          O lugar para <em>almas gémeas</em> patudas
        </p>
        <p className="welcome-line">
          Cuidadores verificados, o registo médico do teu patudo e quem cuida dele quando não podes —
          tudo num só lugar.
        </p>
        <div className="welcome-photos" aria-hidden="true">
          <img src="/images/ImagesPets/pet1.jpeg" alt="" />
          <img src="/images/ImagesPets/pet2.jpeg" alt="" />
          <img src="/images/ImagesPets/pet3.jpeg" alt="" />
        </div>
        <a className="welcome-back" href="/">
          ← Voltar ao site
        </a>
      </div>
    </aside>
  );
}
