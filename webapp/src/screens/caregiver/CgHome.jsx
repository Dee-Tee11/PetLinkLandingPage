import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Empty, PetPhoto, Pill, SectionLabel } from '../../components/ui';
import Icon from '../../components/Icon';
import { useApp } from '../../state/AppState';
import { formatCountdown, formatDayMonth, formatDuration, formatEuro, formatTime } from '../../lib/format';

/** 15 · Agenda e pedidos (cuidador) */
export default function CgHome() {
  const navigate = useNavigate();
  const { bookings, getPet, getUser, caregiverSchedule, caregiverStats } = useApp();

  // A contagem decrescente dos pedidos atualiza a cada minuto (handoff).
  const [, tick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 60000);
    return () => window.clearInterval(id);
  }, []);

  const pending = bookings.filter((b) => b.status === 'pendente');

  return (
    <div className="screen" style={{ paddingTop: 6 }}>
      <div className="spread" style={{ marginBottom: 20 }}>
        <div>
          <p className="t-section-label" style={{ color: 'var(--moss)', margin: '0 0 4px' }}>
            Modo cuidadora
          </p>
          <h1 className="t-screen-title" style={{ fontSize: 26 }}>
            Olá, Rita
          </h1>
        </div>
        <Pill tone="moss" large>
          <span className="dot" style={{ background: 'var(--moss)' }} />
          Disponível
        </Pill>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'Esta semana', value: formatEuro(caregiverStats.weekCents, { decimals: 0 }) },
          { label: 'Serviços', value: caregiverStats.services },
          { label: 'Avaliação', value: caregiverStats.rating.toFixed(1).replace('.', ',') },
        ].map((s) => (
          <Card key={s.label} radius="md" style={{ padding: '13px 11px', background: 'rgba(255,255,240,0.85)' }}>
            <p className="t-micro" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>
              {s.label}
            </p>
            <p className="display" style={{ fontSize: 19, margin: 0 }}>
              {s.value}
            </p>
          </Card>
        ))}
      </div>

      <SectionLabel>Pedidos a aguardar</SectionLabel>
      {pending.length === 0 ? (
        <Card style={{ marginBottom: 20 }}>
          <Empty icon="Bell" title="Sem pedidos por responder">
            Quando um tutor te pedir um serviço, aparece aqui com o tempo que tens para responder.
          </Empty>
        </Card>
      ) : (
        <div className="stack" style={{ gap: 11, marginBottom: 20 }}>
          {pending.map((b, i) => {
            const pet = getPet(b.petId);
            const tutor = getUser(b.tutorId);
            const remaining = b.respondBy ? new Date(b.respondBy) - Date.now() : null;
            // Abaixo de 1h a contagem fica terracota (handoff).
            const urgent = remaining !== null && remaining < 3600000;
            const first = i === 0;

            return (
              <Card
                key={b.id}
                as="button"
                type="button"
                className="pressable"
                onClick={() => navigate(`/cuidar/pedido/${b.id}`)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '16px 18px',
                  background: first ? 'rgba(255,255,240,0.9)' : 'rgba(255,255,240,0.85)',
                  border: first ? '1.5px solid rgba(198,113,57,0.4)' : '0.5px solid var(--border-card)',
                }}
              >
                <div className="spread" style={{ marginBottom: 10 }}>
                  <span
                    className="t-kicker"
                    style={{ margin: 0, color: urgent || first ? 'var(--terracotta-deep)' : 'var(--text-2)' }}
                  >
                    {remaining !== null ? `Responde em ${formatCountdown(remaining)}` : 'A aguardar resposta'}
                  </span>
                  <span className="display" style={{ fontSize: 17 }}>
                    {formatEuro(b.priceCents, { decimals: b.priceCents % 100 ? 2 : 0 })}
                  </span>
                </div>
                <div className="row" style={{ gap: 12 }}>
                  <PetPhoto src={pet.photo} alt={pet.name} height={44} round />
                  <div className="grow">
                    <p style={{ fontSize: 14.5, fontWeight: 500, margin: '0 0 2px' }}>
                      {b.serviceLabel} · {pet.name}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-2)', margin: 0 }}>
                      {tutor.name}, {b.location} · {formatDayMonth(b.scheduledAt)} às {formatTime(b.scheduledAt)}
                    </p>
                  </div>
                  <Icon name="ChevronRight" size={18} color="var(--text-2)" />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <SectionLabel>Agenda de hoje</SectionLabel>
      {caregiverSchedule.length === 0 ? (
        <Card className="t-secondary" style={{ padding: 16, borderRadius: 20 }}>
          Hoje não tens nada marcado.
        </Card>
      ) : (
        <Card style={{ padding: '6px 16px', borderRadius: 20, background: 'rgba(255,255,240,0.85)' }}>
          {caregiverSchedule.map((s, i) => (
            <div
              key={s.id}
              className="row"
              style={{ gap: 14, padding: '13px 0', borderBottom: i < caregiverSchedule.length - 1 ? '0.5px solid var(--rule)' : 'none' }}
            >
              <span className="display" style={{ fontSize: 14, width: 44, flex: 'none' }}>
                {s.time}
              </span>
              <div className="grow">
                <p className="t-list" style={{ margin: '0 0 2px' }}>
                  {s.label}
                </p>
                <p className="t-meta" style={{ margin: 0 }}>
                  {formatDuration(60)} · {s.place}
                </p>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
