import { useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { Avatar } from './ui';
import { useApp } from '../state/AppState';

const TUTOR_NAV = [
  { to: '/inicio', icon: 'House', label: 'Início', matches: ['/inicio', '/animal', '/acompanhar'] },
  { to: '/agendamentos', icon: 'AlignLeft', label: 'Agendamentos', matches: ['/agendamentos'] },
  { to: '/pesquisa', icon: 'Search', label: 'Pesquisa', matches: ['/pesquisa', '/cuidador', '/agendar'] },
  { to: '/lembretes', icon: 'Heart', label: 'Lembretes', matches: ['/lembretes'] },
  { to: '/conversa/b-001', icon: 'MessageCircle', label: 'Conversas', matches: ['/conversa'] },
];

const caregiverNav = (pendingId) => [
  { to: '/cuidar', icon: 'House', label: 'Agenda', matches: ['/cuidar'], exact: true },
  {
    to: pendingId ? `/cuidar/pedido/${pendingId}` : '/cuidar',
    icon: 'Bell',
    label: 'Pedidos',
    matches: ['/cuidar/pedido'],
    dot: Boolean(pendingId),
  },
  { to: '/cuidar/servico', icon: 'Clock', label: 'Serviço', matches: ['/cuidar/servico'] },
  { to: '/cuidar/ganhos', icon: 'CreditCard', label: 'Ganhos', matches: ['/cuidar/ganhos'] },
  { to: '/cuidar/perfil', icon: 'User', label: 'Perfil', matches: ['/cuidar/perfil'] },
];

/** Navegação lateral — substitui a barra de separadores em desktop. */
export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { bookings, getUser, session, preferences } = useApp();

  const caregiver = pathname.startsWith('/cuidar');
  const pendingId = bookings.find((b) => b.status === 'pendente')?.id;
  const items = caregiver ? caregiverNav(pendingId) : TUTOR_NAV;
  const me = getUser(session.userId);

  const isActive = (item) =>
    item.exact ? pathname === item.to : item.matches.some((m) => pathname.startsWith(m));

  return (
    <aside className={`sidebar${caregiver ? ' caregiver' : ''}`}>
      <a className="sidebar-brand" href="/">
        <img src="/images/logo/logo.svg" alt="" width="34" height="34" />
        <span>Pet Lynk</span>
      </a>

      {caregiver && <p className="sidebar-mode">Modo cuidadora</p>}

      <nav className="sidebar-nav" aria-label={caregiver ? 'Navegação do cuidador' : 'Navegação'}>
        {items.map((item) => {
          const active = isActive(item);
          return (
            <button
              key={item.label}
              type="button"
              className={`sidebar-item${active ? ' active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => navigate(item.to)}
            >
              <Icon name={item.icon} size={19} color={active ? 'var(--moss-dark)' : 'var(--text-2)'} />
              <span>{item.label}</span>
              {item.dot && <span className="sidebar-dot" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-foot">
        {preferences.caregiverMode && (
          <button
            type="button"
            className="sidebar-switch"
            onClick={() => navigate(caregiver ? '/inicio' : '/cuidar')}
          >
            <Icon name="ArrowRight" size={15} color="var(--moss-dark)" />
            {caregiver ? 'Voltar a tutor' : 'Modo cuidador'}
          </button>
        )}
        <button type="button" className="sidebar-user" onClick={() => navigate('/conta')}>
          <Avatar initial={me.initial} tone="sage" size={36} />
          <span className="grow">
            <span className="sidebar-user-name">{me.name}</span>
            <span className="sidebar-user-city">{me.city}</span>
          </span>
          <Icon name="ChevronRight" size={16} color="var(--text-2)" />
        </button>
      </div>
    </aside>
  );
}
