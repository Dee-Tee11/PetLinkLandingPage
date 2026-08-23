import { Button, Card, Empty, SectionLabel } from '../../components/ui';
import Icon from '../../components/Icon';
import { useApp } from '../../state/AppState';
import { formatDayMonth, formatEuro, formatTime, plural } from '../../lib/format';

/** 18 · Ganhos e transferências (cuidador) */
export default function CgEarnings() {
  const { earnings, bookings } = useApp();

  // Serviços já fechados entram no saldo do protótipo.
  const settled = bookings.filter((b) => b.settledAt);
  const balance = earnings.balanceCents + settled.reduce((sum, b) => sum + b.priceCents, 0);
  const lastSettled = [...settled].sort((a, b) => new Date(b.settledAt) - new Date(a.settledAt))[0];

  return (
    <div className="screen" style={{ paddingTop: 6 }}>
      <h1 className="t-screen-title" style={{ marginBottom: 18 }}>
        Ganhos
      </h1>

      <Card variant="dark" radius="xl" style={{ padding: 20, marginBottom: 16 }}>
        <p className="t-kicker" style={{ letterSpacing: '0.16em', color: 'inherit', opacity: 0.6, marginBottom: 8 }}>
          Saldo disponível
        </p>
        <p className="display" style={{ fontSize: 36, letterSpacing: '-0.02em', margin: '0 0 4px' }}>
          {formatEuro(balance)}
        </p>
        <p style={{ fontSize: 12.5, opacity: 0.7, margin: '0 0 16px' }}>
          Transferência automática às {earnings.payoutDay} para o {earnings.ibanMasked}
        </p>
        <Button variant="cream" style={{ minHeight: 44, padding: '0 20px', fontSize: 13.5 }}>
          Transferir agora
        </Button>
      </Card>

      {lastSettled ? (
        <Card variant="moss" className="row" style={{ gap: 11, padding: '14px 16px', borderRadius: 20, marginBottom: 18 }}>
          <Icon name="Check" size={18} color="var(--moss-dark)" style={{ flex: 'none' }} />
          <p style={{ fontSize: 12.5, color: 'var(--moss-deep)', lineHeight: 1.5, margin: 0 }}>
            {lastSettled.serviceLabel} concluído — {formatEuro(lastSettled.priceCents)} somados às{' '}
            {formatTime(lastSettled.settledAt)}
          </p>
        </Card>
      ) : (
        <Card variant="moss" className="row" style={{ gap: 11, padding: '14px 16px', borderRadius: 20, marginBottom: 18 }}>
          <Icon name="Check" size={18} color="var(--moss-dark)" style={{ flex: 'none' }} />
          <p style={{ fontSize: 12.5, color: 'var(--moss-deep)', lineHeight: 1.5, margin: 0 }}>
            {earnings.lastRelease.label} — {formatEuro(earnings.lastRelease.amountCents)} somados às{' '}
            {formatTime(earnings.lastRelease.at)}
          </p>
        </Card>
      )}

      {earnings.months.map((month) => (
        <div key={month.label}>
          <SectionLabel style={{ marginBottom: 11 }}>{month.label}</SectionLabel>
          {month.items.length === 0 ? (
            <Card style={{ marginBottom: 18 }}>
              <Empty icon="CreditCard" title="Ainda sem movimentos">
                Os serviços concluídos aparecem aqui com o respetivo valor.
              </Empty>
            </Card>
          ) : (
            <Card style={{ padding: '6px 16px', borderRadius: 20, marginBottom: 18, background: 'rgba(255,255,240,0.85)' }}>
              {month.items.map((it, i) => (
                <div
                  key={it.id}
                  className="spread"
                  style={{ padding: '13px 0', borderBottom: i < month.items.length - 1 ? '0.5px solid var(--rule)' : 'none' }}
                >
                  <div>
                    <p className="t-list" style={{ margin: '0 0 2px' }}>
                      {it.label}
                    </p>
                    <p className="t-meta" style={{ margin: 0 }}>
                      {formatDayMonth(it.date)}
                    </p>
                  </div>
                  <span className="display" style={{ fontSize: 15 }}>
                    {formatEuro(it.amountCents)}
                  </span>
                </div>
              ))}
            </Card>
          )}
        </div>
      ))}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Card radius="md" style={{ padding: '14px 16px', background: 'rgba(255,255,240,0.85)' }}>
          <p className="t-micro" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
            Taxa Pet Lynk
          </p>
          <p style={{ fontSize: 13, margin: 0 }}>{earnings.feeRateLabel}</p>
        </Card>
        <Card radius="md" style={{ padding: '14px 16px', background: 'rgba(255,255,240,0.85)' }}>
          <p className="t-micro" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
            Recibos
          </p>
          <p style={{ fontSize: 13, margin: 0 }}>{plural(earnings.receiptsIssued, 'emitido', 'emitidos')}</p>
        </Card>
      </div>
    </div>
  );
}
