import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, BackButton, Card, Empty, IconButton, Pill, SectionLabel } from '../../components/ui';
import { useApp } from '../../state/AppState';
import { formatDuration, formatTime } from '../../lib/format';

/**
 * TODO: substituir por mapa real (MapKit / Google Maps / Mapbox) com a rota GPS
 * do passeio. O SVG abaixo é o placeholder do handoff, assumidamente representativo.
 */
function MapPlaceholder({ distanceKm, place }) {
  return (
    <div
      style={{
        margin: '0 var(--gutter) 18px',
        height: 198,
        borderRadius: 22,
        overflow: 'hidden',
        position: 'relative',
        background: 'linear-gradient(160deg,#dfe7d0 0%,#cfdcc0 55%,#e6e2d2 100%)',
        border: '0.5px solid rgba(100,110,80,0.18)',
      }}
      role="img"
      aria-label={`Percurso ao vivo: ${distanceKm} km no ${place}`}
    >
      <svg viewBox="0 0 320 198" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path d="M-10 150 L60 140 L120 152 L200 138 L330 150" stroke="rgba(255,255,240,0.65)" strokeWidth="9" fill="none" />
        <path d="M40 -10 L52 60 L44 130 L58 210" stroke="rgba(255,255,240,0.5)" strokeWidth="7" fill="none" />
        <path d="M230 -10 L222 70 L236 140 L228 210" stroke="rgba(255,255,240,0.5)" strokeWidth="7" fill="none" />
        <rect x="70" y="60" width="70" height="55" rx="8" fill="rgba(122,158,110,0.22)" />
        <rect x="150" y="40" width="55" height="70" rx="8" fill="rgba(122,158,110,0.18)" />
        <path
          d="M52 62 C 90 60, 100 130, 150 120 S 210 96, 236 100"
          stroke="#7a9e6e"
          strokeWidth="3.5"
          strokeDasharray="8 7"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="52" cy="62" r="6" fill="#fdffe6" stroke="#7a9e6e" strokeWidth="3" />
        <circle cx="236" cy="100" r="24" fill="rgba(26,26,24,0.12)" />
        <circle cx="236" cy="100" r="13" fill="#1a1a18" />
        <path d="M231 100 l3.5 3.5 6-7" stroke="#fdffe6" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 12,
          bottom: 12,
          background: 'rgba(253,255,230,0.92)',
          borderRadius: 14,
          padding: '9px 12px',
        }}
      >
        <p className="t-micro" style={{ fontSize: 11, marginBottom: 2 }}>
          Percurso ao vivo
        </p>
        <p style={{ fontSize: 12.5, fontWeight: 500, margin: 0 }}>
          {String(distanceKm).replace('.', ',')} km · {place}
        </p>
      </div>
    </div>
  );
}

/** 10 · Acompanhamento */
export default function Tracking() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { getBooking, getCaregiver, getPet } = useApp();
  const booking = getBooking(bookingId);

  // Cronómetro do serviço a decorrer, atualizado a cada minuto.
  const [, tick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 60000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!booking) navigate('/inicio', { replace: true });
  }, [booking, navigate]);
  if (!booking) return null;

  const caregiver = getCaregiver(booking.caregiverId);
  const pet = getPet(booking.petId);
  const live = booking.status === 'a_decorrer';
  const elapsed = booking.startedAt ? Math.max(0, Math.round((Date.now() - new Date(booking.startedAt)) / 60000)) : 0;
  const article = caregiver.tone === 'sand' ? 'o' : 'a';

  return (
    <div style={{ padding: '6px 0 32px' }}>
      <div className="spread" style={{ padding: '0 var(--gutter)', marginBottom: 14 }}>
        <BackButton to="/inicio" />
        {live ? (
          <Pill tone="moss" large>
            <span className="dot" style={{ background: 'var(--moss)' }} />
            {booking.serviceLabel} a decorrer · {formatDuration(elapsed)}
          </Pill>
        ) : (
          <Pill tone="neutral" large>
            {booking.status === 'concluido' ? 'Serviço concluído' : 'Ainda não começou'}
          </Pill>
        )}
      </div>

      {live && <MapPlaceholder distanceKm={booking.track?.distanceKm ?? 0} place={booking.track?.place ?? booking.location} />}

      <div style={{ padding: '0 var(--gutter)' }}>
        <Card className="row" style={{ gap: 12, padding: '14px 16px', borderRadius: 20, marginBottom: 18, background: 'rgba(255,255,240,0.85)' }}>
          <Avatar initial={caregiver.initial} tone={caregiver.tone} size={42} />
          <div className="grow">
            <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 2px' }}>
              {caregiver.name} com {pet.species === 'Gato' ? 'a' : 'o'} {pet.name}
            </p>
            <p className="t-meta" style={{ margin: 0 }}>
              {booking.startedAt ? `Começou às ${formatTime(booking.startedAt)}` : `Marcado para as ${formatTime(booking.scheduledAt)}`}
            </p>
          </div>
          <IconButton
            icon="MessageCircle"
            small
            size={17}
            dark
            label={`Conversar com ${article} ${caregiver.name}`}
            onClick={() => navigate(`/conversa/${booking.id}`)}
          />
        </Card>

        <SectionLabel>Atualizações</SectionLabel>
        {booking.updates.length === 0 ? (
          <Card>
            <Empty icon="Clock" title="Ainda sem atualizações">
              Assim que o serviço começar, as fotos e o check-in aparecem aqui.
            </Empty>
          </Card>
        ) : (
          booking.updates.map((u, i) => {
            const last = i === booking.updates.length - 1;
            return (
              <div key={u.id} className="row" style={{ gap: 13, alignItems: 'stretch' }}>
                <div className="stack" style={{ alignItems: 'center', flex: 'none', paddingTop: 4 }}>
                  <span
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: '50%',
                      background: i === 0 ? 'var(--moss)' : 'rgba(100,110,80,0.35)',
                      flex: 'none',
                    }}
                  />
                  {!last && <span style={{ width: 1.5, flex: 1, background: 'rgba(100,110,80,0.2)', minHeight: 34 }} />}
                </div>
                <div className="grow" style={{ paddingBottom: last ? 0 : 16 }}>
                  <p className="t-list" style={{ margin: '0 0 3px' }}>
                    {u.text}
                  </p>
                  <p className="t-meta" style={{ margin: 0, marginBottom: u.photo ? 9 : 0 }}>
                    {formatTime(u.at)} · {u.by ?? caregiver.name}
                  </p>
                  {u.photo && (
                    <img
                      src={u.photo}
                      alt={`${pet.name} durante o serviço`}
                      className="washed"
                      style={{ width: '100%', height: 112, borderRadius: 16 }}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
