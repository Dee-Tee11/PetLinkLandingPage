import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../../components/ui';
import Icon from '../../components/Icon';
import { useApp } from '../../state/AppState';
import { formatDuration, formatEuro, formatWhen } from '../../lib/format';

/** 09 · Confirmado — sem barra de separadores */
export default function Confirmed() {
  const navigate = useNavigate();
  const { lastBookingId, getBooking, getCaregiver, getPet } = useApp();
  const booking = getBooking(lastBookingId);

  useEffect(() => {
    if (!booking) navigate('/inicio', { replace: true });
  }, [booking, navigate]);
  if (!booking) return null;

  const caregiver = getCaregiver(booking.caregiverId);
  const pet = getPet(booking.petId);
  const article = caregiver.tone === 'sand' ? 'O' : 'A';

  return (
    <div className="screen full-height" style={{ justifyContent: 'center', textAlign: 'center', padding: '0 26px 32px' }}>
      <span
        className="pop-in"
        style={{
          width: 76,
          height: 76,
          borderRadius: 999,
          background: 'var(--moss)',
          display: 'grid',
          placeItems: 'center',
          margin: '0 auto 22px',
        }}
      >
        <Icon name="Check" size={34} color="#fdffe6" />
      </span>

      <h1 className="display" style={{ fontSize: 28, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
        Agendamento <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--moss)' }}>confirmado</em>
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 24px' }}>
        {article} {caregiver.name} já recebeu o pedido e vai tratar do {pet.name} — {formatWhen(booking.scheduledAt).toLowerCase()}.
      </p>

      <Card style={{ background: 'rgba(255,255,240,0.85)', padding: 18, textAlign: 'left', marginBottom: 20 }}>
        <div className="spread" style={{ marginBottom: 10 }}>
          <span className="t-secondary">Referência</span>
          <span style={{ fontSize: 12.5, fontWeight: 500 }}>{booking.reference}</span>
        </div>
        <div className="spread" style={{ marginBottom: 10 }}>
          <span className="t-secondary">Serviço</span>
          <span style={{ fontSize: 12.5, fontWeight: 500 }}>
            {formatDuration(booking.durationMinutes)} · {formatEuro(booking.priceCents, { decimals: booking.priceCents % 100 ? 2 : 0 })}
          </span>
        </div>
        <div className="spread">
          <span className="t-secondary">Registo médico</span>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: booking.shareHealthRecord ? 'var(--moss-dark)' : 'var(--text-2)' }}>
            {booking.shareHealthRecord ? 'Partilhado' : 'Não partilhado'}
          </span>
        </div>
      </Card>

      <Button block onClick={() => navigate(`/acompanhar/${booking.id}`)} style={{ marginBottom: 8 }}>
        Acompanhar serviço
      </Button>
      <Button variant="ghost" block onClick={() => navigate('/inicio')}>
        Voltar ao início
      </Button>
    </div>
  );
}
