import { Avatar, Button, Card, Pill, SectionLabel, Toggle } from '../../components/ui';
import { useApp } from '../../state/AppState';
import { formatDuration, formatEuro, WEEKDAYS_SHORT } from '../../lib/format';

const ORDER = [1, 2, 3, 4, 5, 6, 0]; // segunda → domingo

/** 19 · Perfil, preços e disponibilidade (cuidador) */
export default function CgProfile() {
  const { getCaregiver, updateCaregiver } = useApp();
  const me = getCaregiver('u-rita');

  function toggleDay(weekday) {
    const next = me.availability.includes(weekday)
      ? me.availability.filter((d) => d !== weekday)
      : [...me.availability, weekday];
    updateCaregiver(me.id, { availability: next });
  }

  return (
    <div className="screen" style={{ paddingTop: 6 }}>
      <h1 className="t-screen-title" style={{ marginBottom: 18 }}>
        O meu perfil
      </h1>

      <Card className="row" style={{ gap: 14, padding: 16, marginBottom: 16, background: 'rgba(255,255,240,0.85)' }}>
        <Avatar initial={me.initial} tone={me.tone} size={56} />
        <div className="grow">
          <p className="display" style={{ fontSize: 19, margin: '0 0 3px' }}>
            {me.name}
          </p>
          <Pill tone="moss" icon="ShieldCheck">
            Verificada
          </Pill>
        </div>
        <span style={{ fontSize: 12.5, color: 'var(--moss)', fontWeight: 500 }}>Editar</span>
      </Card>

      {/* Confiança ligada à visibilidade na pesquisa */}
      <Card variant="terracotta" style={{ padding: '15px 16px', borderRadius: 20, marginBottom: 18 }}>
        <p className="t-kicker" style={{ color: 'var(--terracotta-deep)', marginBottom: 6 }}>
          Falta 1 documento
        </p>
        <p style={{ fontSize: 12.5, color: 'var(--terracotta-deep)', lineHeight: 1.55, margin: '0 0 12px' }}>
          Envia o certificado de primeiros socorros para receberes o selo completo e apareceres mais acima na pesquisa.
        </p>
        <Button style={{ minHeight: 44, padding: '0 20px', fontSize: 13.5 }}>Enviar documento</Button>
      </Card>

      <SectionLabel style={{ marginBottom: 11 }}>Serviços e preços</SectionLabel>
      <Card style={{ padding: '6px 16px', borderRadius: 20, marginBottom: 18, background: 'rgba(255,255,240,0.85)' }}>
        {me.priceList.map((s, i) => (
          <div
            key={s.code}
            className="spread"
            style={{ padding: '13px 0', borderBottom: i < me.priceList.length - 1 ? '0.5px solid var(--rule)' : 'none' }}
          >
            <span className="t-list">
              {s.label} <span className="t-meta">({formatDuration(s.duration)})</span>
            </span>
            <span className="display" style={{ fontSize: 15 }}>
              {formatEuro(s.priceCents, { decimals: s.priceCents % 100 ? 2 : 0 })}
            </span>
          </div>
        ))}
      </Card>

      <SectionLabel style={{ marginBottom: 11 }}>Disponibilidade</SectionLabel>
      <Card style={{ padding: 16, borderRadius: 20, background: 'rgba(255,255,240,0.85)' }}>
        <div className="row" style={{ gap: 7, marginBottom: 14 }}>
          {ORDER.map((weekday) => {
            const on = me.availability.includes(weekday);
            return (
              <button
                key={weekday}
                type="button"
                aria-pressed={on}
                aria-label={`Dia ${weekday}`}
                onClick={() => toggleDay(weekday)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  background: on ? 'var(--moss)' : 'rgba(100,110,80,0.1)',
                  color: on ? '#fdffe6' : 'var(--text-2)',
                  borderRadius: 999,
                  padding: '9px 0',
                  fontSize: 12,
                  minHeight: 36,
                }}
              >
                {WEEKDAYS_SHORT[weekday]}
              </button>
            );
          })}
        </div>
        <div className="spread">
          <div>
            <p className="t-list" style={{ margin: '0 0 2px' }}>
              Aceitar pedidos automáticos
            </p>
            <p className="t-meta" style={{ margin: 0 }}>
              De clientes com 3+ serviços
            </p>
          </div>
          <Toggle
            on={!!me.autoAccept}
            onChange={(v) => updateCaregiver(me.id, { autoAccept: v })}
            label="Aceitar pedidos automáticos"
          />
        </div>
      </Card>
    </div>
  );
}
