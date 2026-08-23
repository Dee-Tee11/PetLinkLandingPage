import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, BackButton, Button, Card, IconButton, Pill, SectionLabel } from '../../components/ui';
import Icon from '../../components/Icon';
import { useApp } from '../../state/AppState';
import { formatDuration, formatEuro, plural } from '../../lib/format';

/** 06 · Cuidadora verificada */
export default function Caregiver() {
  const { caregiverId } = useParams();
  const navigate = useNavigate();
  const { getCaregiver, updateDraft, activeBooking } = useApp();
  const c = getCaregiver(caregiverId);

  if (!c) {
    navigate('/pesquisa', { replace: true });
    return null;
  }

  function book() {
    updateDraft({ caregiverId: c.id });
    navigate('/agendar');
  }

  return (
    <div className="screen" style={{ paddingTop: 6 }}>
      <div className="spread" style={{ marginBottom: 18 }}>
        <BackButton to="/pesquisa" />
        <div className="row" style={{ gap: 8 }}>
          <IconButton
            icon="MessageCircle"
            small
            size={18}
            label={`Conversar com ${c.name}`}
            onClick={() => navigate(`/conversa/${activeBooking?.id ?? 'b-001'}`)}
          />
          <IconButton icon="Heart" small size={18} label="Guardar nos favoritos" />
        </div>
      </div>

      <div className="stack" style={{ alignItems: 'center', textAlign: 'center', marginBottom: 20 }}>
        <Avatar initial={c.initial} tone={c.tone} size={88} style={{ marginBottom: 12 }} />
        <h1 className="display" style={{ fontSize: 26, letterSpacing: '-0.02em', margin: '0 0 6px' }}>
          {c.name}
        </h1>
        <Pill tone="moss" icon="ShieldCheck" large>
          {c.verified ? `Cuidador${c.tone === 'sand' ? '' : 'a'} verificad${c.tone === 'sand' ? 'o' : 'a'}` : 'Por verificar'}
        </Pill>
        <p className="t-secondary" style={{ fontSize: 13, lineHeight: 1.6, margin: '14px 0 0' }}>
          {c.bio}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
        {[
          { value: c.rating.toFixed(1).replace('.', ','), label: plural(c.ratingCount, 'avaliação', 'avaliações') },
          { value: `${c.responseRate}%`, label: 'taxa resposta' },
          { value: plural(c.years, 'ano', 'anos'), label: 'experiência' },
        ].map((s) => (
          <Card key={s.label} radius="sm" style={{ padding: '12px 8px', textAlign: 'center' }}>
            <p className="display" style={{ fontSize: 18, margin: 0 }}>
              {s.value}
            </p>
            <p className="t-micro" style={{ marginTop: 3 }}>
              {s.label}
            </p>
          </Card>
        ))}
      </div>

      {c.trust.length > 0 && (
        <>
          <SectionLabel style={{ margin: '0 0 10px' }}>Confiança</SectionLabel>
          <Card style={{ padding: '6px 16px', borderRadius: 20, marginBottom: 18, background: 'rgba(255,255,240,0.85)' }}>
            {c.trust.map((t, i) => (
              <div
                key={t.label}
                className="row"
                style={{ gap: 10, padding: '12px 0', borderBottom: i < c.trust.length - 1 ? '0.5px solid var(--rule)' : 'none' }}
              >
                <Icon name="Check" size={16} color="var(--moss-dark)" style={{ flex: 'none' }} />
                <span className="grow">
                  <span style={{ fontSize: 13, display: 'block' }}>{t.label}</span>
                  <span className="t-meta">{t.detail}</span>
                </span>
              </div>
            ))}
          </Card>
        </>
      )}

      <SectionLabel style={{ margin: '0 0 10px' }}>Serviços</SectionLabel>
      <Card style={{ padding: '6px 16px', borderRadius: 20, marginBottom: 18, background: 'rgba(255,255,240,0.85)' }}>
        {c.priceList.map((s, i) => (
          <div
            key={s.code}
            className="spread"
            style={{ padding: '12px 0', borderBottom: i < c.priceList.length - 1 ? '0.5px solid var(--rule)' : 'none' }}
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

      {c.reviews.length > 0 && (
        <>
          <SectionLabel style={{ margin: '0 0 10px' }}>Avaliações</SectionLabel>
          {c.reviews.map((r) => (
            <Card key={r.id} style={{ borderRadius: 20, marginBottom: 14, background: 'rgba(255,255,240,0.85)' }}>
              <div className="row" style={{ gap: 9, marginBottom: 9 }}>
                <Avatar initial={r.author[0]} tone="sage" size={30} />
                <div className="grow">
                  <p style={{ fontSize: 13, margin: 0 }}>{r.author}</p>
                  <p className="t-meta" style={{ fontSize: 11 }}>
                    {r.service} · há 9 dias
                  </p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500 }}>
                  {r.rating.toFixed(1).replace('.', ',')} ★
                </span>
              </div>
              <p className="t-secondary" style={{ margin: '0 0 10px' }}>
                {r.body}
              </p>
              <div className="row" style={{ gap: 7 }}>
                {r.photos.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt="Foto do serviço"
                    className="washed"
                    style={{ width: 62, height: 62, borderRadius: 14 }}
                  />
                ))}
                {r.morePhotos > 0 && (
                  <span
                    style={{
                      width: 62,
                      height: 62,
                      borderRadius: 14,
                      background: 'rgba(100,110,80,0.09)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 12,
                      color: 'var(--text-2)',
                    }}
                  >
                    +{r.morePhotos}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </>
      )}

      <Button block onClick={book}>
        Agendar com {c.tone === 'sand' ? 'o' : 'a'} {c.name}
      </Button>
    </div>
  );
}
