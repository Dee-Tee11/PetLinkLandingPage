import { useNavigate } from 'react-router-dom';
import { Avatar, Card, Dot, Empty, IconButton, PetPhoto, SectionLabel } from '../../components/ui';
import Icon from '../../components/Icon';
import { useApp } from '../../state/AppState';
import { ageInYears, formatWhen, plural } from '../../lib/format';

const QUICK_SERVICES = [
  { code: 'passeio', label: 'Passeio', icon: 'MapPin' },
  { code: 'banho', label: 'Banho', icon: 'Droplet' },
  { code: 'petsitting', label: 'Petsitting', icon: 'Calendar' },
];

/** 03 · Início */
export default function Home() {
  const navigate = useNavigate();
  const { pets, nextBooking, getCaregiver, reminders, resetDraft } = useApp();
  const expiring = reminders.expiring[0];

  function startService(code) {
    resetDraft({ service: code });
    navigate('/pesquisa');
  }

  const caregiver = nextBooking ? getCaregiver(nextBooking.caregiverId) : null;
  const live = nextBooking?.status === 'a_decorrer';

  return (
    <div className="screen" style={{ paddingTop: 6 }}>
      <div className="spread" style={{ marginBottom: 22 }}>
        <div>
          <h1 className="t-screen-title">Olá, Bia</h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>As tuas almas gémeas:</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <IconButton icon="Bell" label="Lembretes" dot onClick={() => navigate('/lembretes')} />
          <button
            type="button"
            aria-label="Conta"
            onClick={() => navigate('/conta')}
            style={{ borderRadius: 999 }}
          >
            <Avatar initial="B" tone="sage" size={44} />
          </button>
        </div>
      </div>

      <div className="desk-two-col">
        <div>
      {/* Carrossel de animais */}
      {pets.length === 0 ? (
        <Card style={{ marginBottom: 22 }}>
          <Empty icon="PawPrint" title="Ainda não tens patudos">
            Adiciona o teu animal para guardares o registo médico e agendares serviços.
          </Empty>
        </Card>
      ) : (
        <div className="hscroll" style={{ paddingBottom: 6, marginBottom: 22, marginInline: 'calc(var(--gutter) * -1)', paddingInline: 'var(--gutter)' }}>
          {pets.map((pet) => (
            <Card
              key={pet.id}
              as="button"
              type="button"
              padding="tight"
              className="pressable"
              onClick={() => navigate(`/animal/${pet.id}`)}
              style={{ width: 150, textAlign: 'left' }}
            >
              <PetPhoto src={pet.photo} alt={pet.name} height={104} />
              <p className="name" style={{ fontSize: 19, margin: '10px 0 2px' }}>
                {pet.name}
              </p>
              <p className="t-meta">
                {pet.breed} · {plural(ageInYears(pet.birthDate), 'ano', 'anos')}
              </p>
            </Card>
          ))}
          <Card
            as="button"
            type="button"
            variant="dashed"
            className="pressable"
            onClick={() => navigate('/animal/p-boris')}
            style={{ width: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-2)' }}
          >
            <Icon name="Plus" size={20} color="var(--moss)" />
            <span style={{ fontSize: 11.5 }}>Adicionar</span>
          </Card>
        </div>
      )}

      {/* Próximo agendamento */}
      {nextBooking ? (
        <Card
          as="button"
          type="button"
          variant="dark"
          radius="xl"
          className="pressable"
          onClick={() => navigate(`/acompanhar/${nextBooking.id}`)}
          style={{ width: '100%', textAlign: 'left', padding: '18px 20px', marginBottom: 20 }}
        >
          <div className="spread">
            <div>
              <p className="t-kicker" style={{ letterSpacing: '0.16em', color: 'inherit', opacity: 0.6 }}>
                Próximo agendamento
              </p>
              <p className="t-card-title" style={{ marginBottom: 4 }}>
                {nextBooking.serviceLabel} com a {caregiver?.name}
              </p>
              <p style={{ fontSize: 12.5, opacity: 0.72, margin: 0 }}>
                {formatWhen(nextBooking.scheduledAt)} · {nextBooking.location}
              </p>
            </div>
            <Icon name="ChevronRight" size={20} color="#fdffe6" />
          </div>
          <div className="row" style={{ gap: 8, marginTop: 14, paddingTop: 14, borderTop: '0.5px solid rgba(253,255,230,0.18)' }}>
            <Dot />
            <span style={{ fontSize: 12, opacity: 0.8 }}>
              {live
                ? `${caregiver?.name} está com o ${nextBooking.petId === 'p-flora' ? 'a Flora' : 'o Boris'} — acompanhar em direto`
                : `A ${caregiver?.name} chega em 2h — acompanhar em direto`}
            </span>
          </div>
        </Card>
      ) : (
        <Card style={{ marginBottom: 20 }}>
          <Empty icon="Calendar" title="Sem agendamentos">Procura um cuidador verificado perto de ti.</Empty>
        </Card>
      )}

        </div>
        <div>
      {/* Serviços */}
      <SectionLabel>Serviços</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {QUICK_SERVICES.map((s) => (
          <Card
            key={s.code}
            as="button"
            type="button"
            radius="md"
            className="pressable"
            onClick={() => startService(s.code)}
            style={{ padding: '14px 8px', textAlign: 'center' }}
          >
            <Icon name={s.icon} size={20} color="var(--moss)" />
            <p style={{ fontSize: 12, margin: '8px 0 0' }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Aviso de vacina */}
      {expiring && (
        <Card
          as="button"
          type="button"
          variant="terracotta"
          radius="md"
          className="pressable"
          onClick={() => navigate('/lembretes')}
          style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '14px 16px', marginTop: 20, borderRadius: 20 }}
        >
          <Icon name="Clock" size={20} color="var(--terracotta-dark)" style={{ flex: 'none' }} />
          <p style={{ fontSize: 12.5, color: 'var(--terracotta-deep)', lineHeight: 1.5, margin: 0 }}>
            A vacina {expiring.name.toLowerCase()} do {expiring.petName} expira em{' '}
            <strong>{plural(expiring.days, 'dia', 'dias')}</strong>
          </p>
        </Card>
      )}
        </div>
      </div>
    </div>
  );
}
