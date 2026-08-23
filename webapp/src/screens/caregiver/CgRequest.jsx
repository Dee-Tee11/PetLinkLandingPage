import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackButton, Button, Card, Empty, PetPhoto } from '../../components/ui';
import Icon from '../../components/Icon';
import { useApp } from '../../state/AppState';
import {
  ageInYears,
  daysUntil,
  formatCountdown,
  formatDate,
  formatDayMonth,
  formatDuration,
  formatEuro,
  formatTime,
  formatWeight,
  plural,
} from '../../lib/format';

/** 16 · Pedido a aguardar (cuidador) */
export default function CgRequest() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { getBooking, getPet, getUser, acceptRequest, declineRequest } = useApp();
  const booking = getBooking(bookingId);

  const [, tick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 60000);
    return () => window.clearInterval(id);
  }, []);

  if (!booking) {
    return (
      <div className="screen" style={{ paddingTop: 6 }}>
        <div style={{ marginBottom: 16 }}>
          <BackButton to="/cuidar" />
        </div>
        <Card>
          <Empty icon="Bell" title="Pedido já não disponível">
            Este pedido foi respondido ou expirou.
          </Empty>
        </Card>
      </div>
    );
  }

  const pet = getPet(booking.petId);
  const tutor = getUser(booking.tutorId);
  const remaining = booking.respondBy ? new Date(booking.respondBy) - Date.now() : null;
  const urgent = remaining !== null && remaining < 3600000;
  const weight = pet.weights[pet.weights.length - 1];
  const rabies = pet.vaccines.find((v) => daysUntil(v.nextDueOn) <= 30);
  const med = pet.medications[0];
  const article = pet.species === 'Gato' ? 'a' : 'o';

  function accept() {
    // Em nativo há confirmação do sistema antes de aceitar (handoff).
    if (!window.confirm(`Aceitar ${booking.serviceLabel.toLowerCase()} com ${article} ${pet.name}?`)) return;
    acceptRequest(booking.id);
    navigate('/cuidar/servico');
  }

  function decline() {
    if (!window.confirm('Recusar este pedido?')) return;
    declineRequest(booking.id);
    navigate('/cuidar');
  }

  const responded = booking.status !== 'pendente';

  return (
    <div className="screen" style={{ paddingTop: 6 }}>
      <div style={{ marginBottom: 16 }}>
        <BackButton to="/cuidar" />
      </div>

      <p className="t-section-label" style={{ color: urgent ? 'var(--terracotta-deep)' : 'var(--terracotta-deep)', margin: '0 0 8px' }}>
        Novo pedido{remaining !== null ? ` · responde em ${formatCountdown(remaining)}` : ''}
      </p>
      <h1 className="display" style={{ fontSize: 25, lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 18px' }}>
        {booking.serviceLabel} com {article} <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--moss)' }}>{pet.name}</em>
      </h1>

      {/* Detalhe */}
      <Card style={{ background: 'rgba(255,255,240,0.88)', marginBottom: 14 }}>
        <div className="row" style={{ gap: 12, paddingBottom: 13, borderBottom: '0.5px solid var(--rule)' }}>
          <PetPhoto src={pet.photo} alt={pet.name} height={52} round />
          <div className="grow">
            <p style={{ fontSize: 14.5, fontWeight: 500, margin: '0 0 2px' }}>
              {pet.name} · {pet.breed}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-2)', margin: 0 }}>
              {plural(ageInYears(pet.birthDate), 'ano', 'anos')} · {formatWeight(weight.grams)} kg · {pet.sex}
            </p>
          </div>
        </div>
        <div className="spread" style={{ padding: '11px 0 0' }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Data e hora</span>
          <span style={{ fontSize: 13 }}>
            {formatDayMonth(booking.scheduledAt)} · {formatTime(booking.scheduledAt)}
          </span>
        </div>
        <div className="spread" style={{ padding: '8px 0' }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Duração</span>
          <span style={{ fontSize: 13 }}>{formatDuration(booking.durationMinutes)}</span>
        </div>
        <div className="spread" style={{ padding: '0 0 11px' }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Recolha</span>
          <span style={{ fontSize: 13 }}>{booking.location}</span>
        </div>
        <div className="spread" style={{ paddingTop: 11, borderTop: '0.5px solid var(--rule)' }}>
          <span className="t-list">Recebes</span>
          <span className="display" style={{ fontSize: 21 }}>
            {formatEuro(booking.priceCents)}
          </span>
        </div>
      </Card>

      {/* Registo médico — visto ANTES de aceitar */}
      {booking.shareHealthRecord && (
        <Card variant="moss" style={{ padding: '15px 16px', borderRadius: 20, marginBottom: 14 }}>
          <div className="row" style={{ gap: 9, marginBottom: 10 }}>
            <Icon name="FileText" size={16} color="var(--moss-dark)" />
            <span
              style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--moss-deep)' }}
            >
              Registo médico partilhado
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--moss-deep)', lineHeight: 1.55, margin: '0 0 4px' }}>
            Alergias: {pet.allergies.length ? pet.allergies.join(', ').toLowerCase() : 'nenhuma registada'}
          </p>
          {med && (
            <p style={{ fontSize: 12.5, color: 'var(--moss-deep)', lineHeight: 1.55, margin: '0 0 4px' }}>
              Medicação: {med.name} {med.dose} às {med.times.join(' e ')}
            </p>
          )}
          <p style={{ fontSize: 12.5, color: 'var(--moss-deep)', lineHeight: 1.55, margin: 0 }}>
            {rabies
              ? `Vacinas em dia · ${rabies.name.toLowerCase()} a renovar em ${formatDate(rabies.nextDueOn)}`
              : 'Todas as vacinas em dia'}
          </p>
        </Card>
      )}

      {/* Nota do tutor */}
      {booking.tutorNote && (
        <Card style={{ padding: '15px 16px', borderRadius: 20, marginBottom: 16, background: 'rgba(255,255,240,0.85)' }}>
          <p className="t-micro" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Nota d{tutor.name.endsWith('a') ? 'a' : 'o'} {tutor.name}
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.55, margin: 0 }}>{booking.tutorNote}</p>
        </Card>
      )}

      {responded ? (
        <Card variant="moss" className="t-secondary" style={{ padding: 16, color: 'var(--moss-deep)' }}>
          Já respondeste a este pedido.
        </Card>
      ) : (
        <>
          <Button block onClick={accept} style={{ marginBottom: 8 }}>
            Aceitar pedido
          </Button>
          <div className="row" style={{ gap: 10 }}>
            <Button variant="secondary" onClick={() => navigate(`/conversa/${booking.id}`)} style={{ flex: 1 }}>
              Perguntar algo
            </Button>
            <Button
              variant="secondary"
              onClick={decline}
              style={{ flex: 1, background: 'transparent', color: 'var(--text-2)' }}
            >
              Recusar
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
