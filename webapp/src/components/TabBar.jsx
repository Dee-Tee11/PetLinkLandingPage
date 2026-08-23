import { useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useApp } from '../state/AppState';

const MOSS = '#7a9e6e';
const IDLE = 'rgba(60,62,50,0.42)';

/* Grupos de rotas que acendem cada separador (mapa do handoff). */
const TUTOR_TABS = [
  { to: '/inicio', icon: 'House', label: 'Início', matches: ['/inicio', '/animal', '/acompanhar', '/conta'] },
  { to: '/agendamentos', icon: 'AlignLeft', label: 'Agendamentos', matches: ['/agendamentos'] },
  { to: '/pesquisa', icon: 'Search', label: 'Pesquisa', matches: ['/pesquisa', '/cuidador', '/agendar'] },
  { to: '/lembretes', icon: 'Heart', label: 'Lembretes', matches: ['/lembretes'] },
];

const caregiverTabs = (pendingId) => [
  { to: '/cuidar', icon: 'House', label: 'Início', matches: ['/cuidar', '/cuidar/servico'] },
  {
    to: pendingId ? `/cuidar/pedido/${pendingId}` : '/cuidar',
    icon: 'Bell',
    label: 'Pedidos',
    matches: ['/cuidar/pedido'],
    dot: Boolean(pendingId), // ponto terracota só enquanto houver pedido por responder
  },
  { to: '/cuidar/ganhos', icon: 'CreditCard', label: 'Ganhos', matches: ['/cuidar/ganhos'] },
  { to: '/cuidar/perfil', icon: 'User', label: 'Perfil', matches: ['/cuidar/perfil'] },
];

/** Ecrãs sem barra de separadores (handoff): onboarding, criar conta, confirmado, conversa. */
const HIDDEN_ON = ['/', '/registo', '/confirmado', '/conversa'];

export function tabBarHidden(pathname) {
  return HIDDEN_ON.some((p) => (p === '/' ? pathname === '/' : pathname.startsWith(p)));
}

export default function TabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { bookings } = useApp();

  if (tabBarHidden(pathname)) return null;

  const caregiver = pathname.startsWith('/cuidar');
  const pendingId = bookings.find((b) => b.status === 'pendente')?.id;
  const tabs = caregiver ? caregiverTabs(pendingId) : TUTOR_TABS;

  const isActive = (tab) =>
    tab.matches.some((m) => (m === '/cuidar' ? pathname === '/cuidar' || pathname === '/cuidar/servico' : pathname.startsWith(m)));

  return (
    <nav className={`tabbar${caregiver ? ' caregiver' : ''}`} aria-label={caregiver ? 'Navegação do cuidador' : 'Navegação'}>
      {tabs.map((tab) => {
        const active = isActive(tab);
        return (
          <button
            key={tab.label}
            type="button"
            className="tabbar-item"
            aria-label={tab.label}
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(tab.to)}
          >
            <Icon name={tab.icon} size={23} color={active ? MOSS : IDLE} />
            {tab.dot && <span className="tabbar-dot" />}
          </button>
        );
      })}
    </nav>
  );
}
