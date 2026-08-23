import { useNavigate, useParams } from 'react-router-dom';
import { BackButton, Card, PetPhoto, Pill, SectionLabel, Stats } from '../../components/ui';
import Icon from '../../components/Icon';
import { useApp } from '../../state/AppState';
import { ageInYears, daysUntil, formatDate, formatDayMonth, formatWeight, plural } from '../../lib/format';

/** 04 · Perfil e registo médico */
export default function Pet() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { getPet } = useApp();
  const pet = getPet(petId);

  if (!pet) {
    navigate('/inicio', { replace: true });
    return null;
  }

  const weights = [...pet.weights].sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt));
  const latest = weights[weights.length - 1];
  const previous = weights[weights.length - 2];
  const delta = previous ? latest.grams - previous.grams : 0;

  const expiringCount = pet.vaccines.filter((v) => daysUntil(v.nextDueOn) <= 30).length;
  const upToDate = pet.vaccines.length - expiringCount;
  const activeMed = pet.medications[0];

  return (
    <div className="screen" style={{ paddingTop: 6 }}>
      <div className="screen-head">
        <BackButton to="/inicio" />
        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Registo médico</span>
      </div>

      <div className="row" style={{ gap: 14, marginBottom: 20 }}>
        <PetPhoto src={pet.photo} alt={pet.name} height={76} round />
        <div>
          <h1 className="name" style={{ fontSize: 28, margin: '0 0 2px' }}>
            {pet.name}
          </h1>
          <p className="t-secondary" style={{ margin: 0 }}>
            {pet.breed} · {pet.sex} · {plural(ageInYears(pet.birthDate), 'ano', 'anos')}
          </p>
          {pet.microchip && (
            <Pill tone="moss" icon="Check" style={{ marginTop: 7 }}>
              Microchip registado
            </Pill>
          )}
        </div>
      </div>

      <Stats
        items={[
          {
            label: 'Peso',
            value: formatWeight(latest.grams),
            unit: 'kg',
            note: delta ? `${delta > 0 ? '+' : '−'}${formatWeight(Math.abs(delta))} kg` : 'estável',
            noteTone: delta > 0 ? 'var(--moss)' : 'var(--text-2)',
          },
          {
            label: 'Vacinas',
            value: `${upToDate}`,
            unit: `/${pet.vaccines.length}`,
            note: expiringCount ? `${expiringCount} a expirar` : 'todas em dia',
            noteTone: expiringCount ? 'var(--terracotta-dark)' : 'var(--moss)',
          },
          {
            label: 'Idade',
            value: `${ageInYears(pet.birthDate)}`,
            unit: 'anos',
            note: formatDate(pet.birthDate),
          },
        ]}
      />

      <SectionLabel style={{ margin: '18px 0 10px' }}>Vacinas</SectionLabel>
      <Card padding="flush" style={{ padding: '6px 16px', borderRadius: 20, marginBottom: 18 }}>
        {pet.vaccines.map((v, i) => {
          const days = daysUntil(v.nextDueOn);
          const due = days <= 30;
          return (
            <div
              key={v.id}
              className="spread"
              style={{ padding: '12px 0', borderBottom: i < pet.vaccines.length - 1 ? '0.5px solid var(--rule)' : 'none' }}
            >
              <div>
                <p className="t-list" style={{ margin: '0 0 2px' }}>
                  {v.name}
                </p>
                <p className="t-meta" style={{ margin: 0 }}>
                  Dada {formatDate(v.givenOn)}
                </p>
              </div>
              <Pill tone={due ? 'terracotta' : 'moss'}>{due ? `Renovar ${formatDayMonth(v.nextDueOn)}` : 'Em dia'}</Pill>
            </div>
          );
        })}
      </Card>

      <SectionLabel style={{ margin: '0 0 10px' }}>Medicação ativa</SectionLabel>
      {activeMed ? (
        <Card className="row" style={{ gap: 12, padding: '14px 16px', borderRadius: 20, marginBottom: 18 }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              background: 'rgba(197,195,224,0.5)',
              display: 'grid',
              placeItems: 'center',
              flex: 'none',
            }}
          >
            <Icon name="Pill" size={18} color="#4a4870" />
          </span>
          <div className="grow">
            <p className="t-list" style={{ margin: '0 0 2px' }}>
              {activeMed.name} {activeMed.dose}
            </p>
            <p className="t-meta" style={{ margin: 0 }}>
              1 comprimido · {activeMed.times.join(' e ')}
            </p>
          </div>
          <span className="t-meta">até {formatDayMonth(activeMed.endsOn)}</span>
        </Card>
      ) : (
        <Card className="t-secondary" style={{ padding: '14px 16px', borderRadius: 20, marginBottom: 18 }}>
          Sem medicação ativa.
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Card radius="md" style={{ padding: '14px 16px' }}>
          <p className="t-micro" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
            Alergias
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>
            {pet.allergies.length ? pet.allergies.join(', ') : 'Nenhuma registada'}
          </p>
        </Card>
        <Card radius="md" style={{ padding: '14px 16px' }}>
          <p className="t-micro" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
            Veterinário
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>
            {pet.vet.name}, {pet.vet.city}
          </p>
        </Card>
      </div>

      <Card className="spread" radius="md" style={{ padding: '15px 16px', marginTop: 10 }}>
        <span className="row" style={{ gap: 11 }}>
          <Icon name="FileText" size={18} color="var(--moss)" />
          <span className="t-list">Relatórios médicos</span>
        </span>
        <span className="t-secondary">{plural(pet.reports.length, 'ficheiro', 'ficheiros')}</span>
      </Card>
    </div>
  );
}
