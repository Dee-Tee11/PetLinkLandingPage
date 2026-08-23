import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, SectionLabel, Toggle } from '../../components/ui';
import Icon from '../../components/Icon';
import { useApp } from '../../state/AppState';

const TRUST_ROWS = [
  { label: 'Verificação de identidade', value: 'Concluída', tone: 'var(--moss-dark)' },
  { label: 'Registo criminal', value: 'A validar', tone: 'var(--terracotta-deep)' },
  { label: 'Contactos verificados', value: 'Email · Telemóvel', tone: 'var(--text-2)' },
];

const PREFS = [
  { key: 'reminders', label: 'Notificações de lembretes' },
  { key: 'servicePhotos', label: 'Fotos durante o serviço' },
  { key: 'shareHealthRecord', label: 'Partilhar registo médico' },
];

/** 14 · Conta e modo cuidador */
export default function Settings() {
  const navigate = useNavigate();
  const { preferences, setPreference, setRole, getUser, session } = useApp();
  const me = getUser(session.userId);

  function toggleCaregiverMode(on) {
    setPreference('caregiverMode', on);
    setRole(on ? 'cuidador' : 'tutor');
  }

  return (
    <div className="screen" style={{ paddingTop: 6 }}>
      <h1 className="t-screen-title" style={{ marginBottom: 20 }}>
        Conta
      </h1>

      <Card className="row" style={{ gap: 14, padding: 16, marginBottom: 18, background: 'rgba(255,255,240,0.85)' }}>
        <Avatar initial={me.initial} tone="sage" size={56} />
        <div className="grow">
          <p className="display" style={{ fontSize: 19, margin: '0 0 2px' }}>
            {me.name}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-2)', margin: 0 }}>
            {me.email} · {me.city}
          </p>
        </div>
        <Icon name="ChevronRight" size={17} color="var(--text-2)" />
      </Card>

      {/* Modo cuidador — a porta de entrada para o outro lado da app */}
      <Card variant="lavender" style={{ padding: 18, marginBottom: 18 }}>
        <div className="spread" style={{ marginBottom: 8 }}>
          <p className="display" style={{ fontSize: 17, margin: 0 }}>
            Modo cuidador
          </p>
          <Toggle on={preferences.caregiverMode} onChange={toggleCaregiverMode} label="Modo cuidador" />
        </div>
        <p style={{ fontSize: 12.5, color: '#5a5870', lineHeight: 1.55, margin: 0 }}>
          {preferences.caregiverMode
            ? 'Ativo — recebes pedidos de serviço. Alterna entre tutor e cuidador sem sair da conta.'
            : 'Desligado — não recebes pedidos de serviço. Podes voltar a ligar quando quiseres.'}
        </p>
        {preferences.caregiverMode && (
          <Button
            variant="secondary"
            block
            onClick={() => navigate('/cuidar')}
            style={{ marginTop: 14 }}
          >
            Ir para o modo cuidador
          </Button>
        )}
      </Card>

      <SectionLabel style={{ margin: '0 0 10px' }}>Confiança e segurança</SectionLabel>
      <Card style={{ padding: '6px 16px', borderRadius: 20, marginBottom: 18, background: 'rgba(255,255,240,0.85)' }}>
        {TRUST_ROWS.map((r, i) => (
          <div
            key={r.label}
            className="spread"
            style={{ padding: '13px 0', borderBottom: i < TRUST_ROWS.length - 1 ? '0.5px solid var(--rule)' : 'none' }}
          >
            <span className="t-list">{r.label}</span>
            <span style={{ fontSize: 11.5, color: r.tone, fontWeight: r.tone === 'var(--text-2)' ? 400 : 500 }}>{r.value}</span>
          </div>
        ))}
      </Card>

      <SectionLabel style={{ margin: '0 0 10px' }}>Preferências</SectionLabel>
      <Card style={{ padding: '6px 16px', borderRadius: 20, background: 'rgba(255,255,240,0.85)' }}>
        {PREFS.map((p, i) => (
          <div
            key={p.key}
            className="spread"
            style={{ padding: '13px 0', borderBottom: i < PREFS.length - 1 ? '0.5px solid var(--rule)' : 'none' }}
          >
            <span className="t-list">{p.label}</span>
            <Toggle on={preferences[p.key]} onChange={(v) => setPreference(p.key, v)} label={p.label} />
          </div>
        ))}
      </Card>

      <p className="t-meta" style={{ marginTop: 12, lineHeight: 1.5 }}>
        A partilha do registo médico é decidida em cada reserva — este é apenas o valor por omissão.
      </p>
    </div>
  );
}
