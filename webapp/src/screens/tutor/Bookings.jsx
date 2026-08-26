import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Chip, Dot, Empty, Pill } from '../../components/ui';
import { useApp } from '../../state/AppState';
import { formatDayMonth, formatDuration, formatEuro, formatTime, formatWhen } from '../../lib/format';

const FILTERS = [
  { key: 'a_decorrer', label: 'A decorrer', statuses: ['a_decorrer'] },
  { key: 'proximos', label: 'Próximos', statuses: ['aceite', 'pendente'] },
  { key: 'historico', label: 'Histórico', statuses: ['concluido', 'cancelado', 'recusado', 'expirado'] },
];

const STATUS_PILL = {
  aceite: { tone: 'moss', label: 'Confirmado' },
  pendente: { tone: 'terracotta', label: 'A aguardar' },
  concluido: { tone: 'neutral', label: 'Concluído' },
  recusado: { tone: 'neutral', label: 'Recusado' },
  cancelado: { tone: 'neutral', label: 'Cancelado' },
  expirado: { tone: 'neutral', label: 'Expirado' },
};

/** 12 · Agendamentos */
export default function Bookings() {
  const navigate = useNavigate();
  const { bookings, getCaregiver, getPet, updateDraft } = useApp();
  const [filter, setFilter] = useState('a_decorrer');

  const active = FILTERS.find((f) => f.key === filter);
  const list = bookings
    .filter((b) => active.statuses.includes(b.status))
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));

  function bookAgain(booking) {
    updateDraft({ caregiverId: booking.caregiverId, service: booking.service, petId: booking.petId });
    navigate(`/cuidador/${booking.caregiverId}`);
  }

  return (
    <div className="screen" style={{ paddingTop: 6 }}>
      <h1 className="t-screen-title" style={{ marginBottom: 16 }}>
        Agendamentos
      </h1>

      <div className="row" style={{ gap: 8, marginBottom: 18 }}>
        {FILTERS.map((f) => (
          <Chip key={f.key} active={f.key === filter} onClick={() => setFilter(f.key)}>
            {f.label}
          </Chip>
        ))}
      </div>

      {list.length === 0 ? (
        <Card>
          <Empty icon="Calendar" title="Nada por aqui">
            {filter === 'a_decorrer'
              ? 'Não há nenhum serviço a decorrer neste momento.'
              : filter === 'proximos'
                ? 'Ainda não tens serviços marcados.'
                : 'O histórico aparece aqui depois do primeiro serviço.'}
          </Empty>
        </Card>
      ) : (
        <div className="stack desk-cards" style={{ gap: 12 }}>
          {list.map((b) => {
            const caregiver = getCaregiver(b.caregiverId);
            const pet = getPet(b.petId);
            const live = b.status === 'a_decorrer';
            const elapsed = b.startedAt ? Math.round((Date.now() - new Date(b.startedAt)) / 60000) : 0;
            const pill = STATUS_PILL[b.status];

            return (
              <Card
                key={b.id}
                as="button"
                type="button"
                variant={live ? 'dark' : undefined}
                className="pressable"
                onClick={() => navigate(`/acompanhar/${b.id}`)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '16px 18px',
                  background: live ? undefined : 'rgba(255,255,240,0.85)',
                }}
              >
                {live ? (
                  <div className="row" style={{ gap: 8, marginBottom: 9 }}>
                    <Dot />
                    <span className="t-kicker" style={{ margin: 0, color: 'inherit', opacity: 0.75 }}>
                      A decorrer · {formatDuration(elapsed)}
                    </span>
                  </div>
                ) : (
                  <div className="spread" style={{ marginBottom: 8 }}>
                    <span className="t-kicker" style={{ margin: 0 }}>
                      {formatWhen(b.scheduledAt)}
                    </span>
                    <Pill tone={pill.tone}>{pill.label}</Pill>
                  </div>
                )}

                <p className="display" style={{ fontSize: 18, margin: '0 0 4px' }}>
                  {b.serviceLabel} · {pet.name}
                </p>
                <p style={{ fontSize: 12.5, opacity: live ? 0.7 : 1, color: live ? 'inherit' : 'var(--text-2)', margin: 0 }}>
                  {caregiver.name}, {b.location} · {formatEuro(b.priceCents, { decimals: b.priceCents % 100 ? 2 : 0 })}
                </p>

                {b.status === 'concluido' && (
                  <div className="spread" style={{ marginTop: 10, paddingTop: 11, borderTop: '0.5px solid var(--rule)' }}>
                    <span className="t-secondary" style={{ fontSize: 12 }}>
                      {b.review ? `Avaliaste ${b.review.rating.toFixed(1).replace('.', ',')} ★` : 'Ainda não avaliaste'}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        bookAgain(b);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          bookAgain(b);
                        }
                      }}
                      style={{ fontSize: 12.5, color: 'var(--moss)', fontWeight: 500 }}
                    >
                      Agendar outra vez
                    </span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
