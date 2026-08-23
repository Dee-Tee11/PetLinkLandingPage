import { useNavigate } from 'react-router-dom';
import { Button, Card, Empty, SectionLabel } from '../../components/ui';
import Icon from '../../components/Icon';
import { useApp } from '../../state/AppState';
import { formatDate, plural } from '../../lib/format';

/** 13 · Vacinas e medicação */
export default function Reminders() {
  const navigate = useNavigate();
  const { reminders, pets, toggleDose } = useApp();
  const urgent = reminders.expiring[0];
  const petNames = pets.map((p) => p.name);

  return (
    <div className="screen" style={{ paddingTop: 6 }}>
      <h1 className="t-screen-title" style={{ marginBottom: 4 }}>
        Lembretes
      </h1>
      <p className="t-secondary" style={{ margin: '0 0 20px' }}>
        Vacinas e medicação {petNames.length > 1 ? `do ${petNames[0]} e da ${petNames[1]}` : `do ${petNames[0]}`}
      </p>

      {/* Destaque terracota */}
      {urgent && (
        <Card variant="terracotta" style={{ padding: '16px 18px', marginBottom: 18 }}>
          <div className="row" style={{ gap: 8, marginBottom: 9 }}>
            <Icon name="Clock" size={16} color="var(--terracotta-dark)" />
            <span className="t-kicker" style={{ margin: 0, color: 'var(--terracotta-deep)' }}>
              A expirar em {plural(urgent.days, 'dia', 'dias')}
            </span>
          </div>
          <p className="display" style={{ fontSize: 19, margin: '0 0 4px' }}>
            {urgent.name} · {urgent.petName}
          </p>
          <p style={{ fontSize: 12.5, color: 'var(--terracotta-deep)', margin: '0 0 13px' }}>
            Renovar até {formatDate(urgent.nextDueOn)} · {urgent.clinic}
          </p>
          <Button
            onClick={() => navigate('/pesquisa')}
            style={{ minHeight: 44, padding: '0 20px', fontSize: 13.5 }}
          >
            Marcar check-up
          </Button>
        </Card>
      )}

      {/* Doses de hoje */}
      <SectionLabel>Hoje</SectionLabel>
      {reminders.doses.length === 0 ? (
        <Card style={{ marginBottom: 18 }}>
          <Empty icon="Pill" title="Sem doses hoje">Nenhum dos teus patudos tem medicação marcada para hoje.</Empty>
        </Card>
      ) : (
        <Card style={{ padding: '6px 16px', borderRadius: 20, marginBottom: 18, background: 'rgba(255,255,240,0.85)' }}>
          {reminders.doses.map((d, i) => (
            <button
              key={d.key}
              type="button"
              role="checkbox"
              aria-checked={d.given}
              onClick={() => toggleDose(d.key)}
              className="row"
              style={{
                gap: 12,
                width: '100%',
                textAlign: 'left',
                padding: '13px 0',
                borderBottom: i < reminders.doses.length - 1 ? '0.5px solid var(--rule)' : 'none',
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  flex: 'none',
                  display: 'grid',
                  placeItems: 'center',
                  background: d.given ? 'var(--moss)' : 'transparent',
                  border: d.given ? 'none' : '1.5px solid rgba(100,110,80,0.35)',
                }}
              >
                {d.given && <Icon name="Check" size={13} color="#fdffe6" />}
              </span>
              <span className="grow">
                <span className="t-list" style={{ display: 'block', marginBottom: 2 }}>
                  {d.name} {d.dose} · {d.petName}
                </span>
                <span className="t-meta">
                  {d.time} · {d.given ? 'dado' : 'a seguir'}
                </span>
              </span>
            </button>
          ))}
        </Card>
      )}

      {/* Próximas semanas */}
      <SectionLabel>Próximas semanas</SectionLabel>
      {reminders.upcoming.length === 0 ? (
        <Card className="t-secondary" style={{ padding: '16px', borderRadius: 20 }}>
          Nada marcado para as próximas semanas.
        </Card>
      ) : (
        <Card style={{ padding: '6px 16px', borderRadius: 20, background: 'rgba(255,255,240,0.85)' }}>
          {reminders.upcoming.map((u, i) => (
            <div
              key={u.id}
              className="spread"
              style={{ padding: '13px 0', borderBottom: i < reminders.upcoming.length - 1 ? '0.5px solid var(--rule)' : 'none' }}
            >
              <div>
                <p className="t-list" style={{ margin: '0 0 2px' }}>
                  {u.name} · {u.petName}
                </p>
                <p className="t-meta" style={{ margin: 0 }}>
                  {formatDate(u.nextDueOn)}
                </p>
              </div>
              <Icon name="ChevronRight" size={17} color="var(--text-2)" />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
