import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Card, Chip, Empty, Pill } from '../../components/ui';
import Icon from '../../components/Icon';
import { useApp } from '../../state/AppState';
import { formatEuro, plural } from '../../lib/format';

/** 05 · Pesquisa e filtros */
export default function Search() {
  const navigate = useNavigate();
  const { caregivers, servicesCatalog, draft, updateDraft } = useApp();
  const [service, setService] = useState(draft.service || 'passeio');

  const label = servicesCatalog.find((s) => s.code === service)?.label ?? 'Serviços';
  const results = caregivers.filter((c) => c.priceList.some((p) => p.code === service));

  function pick(code) {
    setService(code);
    updateDraft({ service: code });
  }

  return (
    <div className="screen" style={{ paddingTop: 6 }}>
      <h1 className="name" style={{ fontSize: 27, margin: '0 0 4px' }}>
        {label.toLowerCase()}
      </h1>
      <p className="t-secondary" style={{ margin: '0 0 16px' }}>
        {results.length
          ? `${plural(results.length, 'cuidador verificado', 'cuidadores verificados')} perto de Espinho`
          : 'Nenhum cuidador neste raio'}
      </p>

      <div
        className="row"
        style={{
          gap: 10,
          background: 'rgba(255,255,245,0.9)',
          border: '0.5px solid var(--border-field)',
          borderRadius: 999,
          padding: '0 16px',
          minHeight: 48,
          marginBottom: 12,
        }}
      >
        <Icon name="Search" size={18} color="var(--text-2)" />
        <span style={{ fontSize: 14, color: 'var(--text-2)' }}>Espinho · 10 km</span>
      </div>

      <div className="hscroll" style={{ gap: 8, paddingBottom: 14, marginInline: 'calc(var(--gutter) * -1)', paddingInline: 'var(--gutter)' }}>
        {servicesCatalog.map((s) => (
          <Chip key={s.code} active={s.code === service} onClick={() => pick(s.code)}>
            {s.label}
          </Chip>
        ))}
      </div>

      {results.length === 0 ? (
        <Card>
          <Empty icon="MapPin" title="Ninguém disponível neste raio">
            Experimenta outro serviço ou aumenta a distância da pesquisa.
          </Empty>
        </Card>
      ) : (
        <div className="stack" style={{ gap: 12 }}>
          {results.map((c) => {
            const price = c.priceList.find((p) => p.code === service);
            return (
              <Card
                key={c.id}
                as="button"
                type="button"
                className="pressable"
                onClick={() => navigate(`/cuidador/${c.id}`)}
                style={{ textAlign: 'left', background: 'rgba(255,255,240,0.85)' }}
              >
                <div className="row" style={{ gap: 13, alignItems: 'flex-start' }}>
                  <Avatar initial={c.initial} tone={c.tone} size={52} />
                  <div className="grow">
                    <div className="row" style={{ gap: 6 }}>
                      <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>
                        {c.name}, {c.zone}
                      </p>
                      {c.verified && <Icon name="ShieldCheck" size={15} color="var(--moss-dark)" />}
                    </div>
                    <div className="row" style={{ gap: 5, margin: '5px 0 7px' }}>
                      <Icon name="Star" size={13} color="var(--terracotta)" fill="var(--terracotta)" />
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{c.rating.toFixed(1).replace('.', ',')}</span>
                      <span className="t-secondary" style={{ fontSize: 12 }}>
                        · {c.services} serviços · responde em {c.responseTime}
                      </span>
                    </div>
                    <p className="t-secondary" style={{ fontSize: 12, margin: 0 }}>
                      {c.shortBio}
                    </p>
                  </div>
                </div>

                <div className="spread" style={{ marginTop: 13, paddingTop: 13, borderTop: '0.5px solid var(--rule)' }}>
                  <span className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                    {c.badges.map((b, i) => (
                      <Pill key={b} tone={i === 0 ? 'moss' : 'neutral'}>
                        {b}
                      </Pill>
                    ))}
                  </span>
                  <p className="display" style={{ fontSize: 17, margin: 0, whiteSpace: 'nowrap' }}>
                    {formatEuro(price.priceCents, { decimals: price.priceCents % 100 ? 2 : 0 })}
                    <span style={{ fontSize: 11.5, fontWeight: 400, color: 'var(--text-2)' }}>
                      /{price.duration >= 240 ? 'dia' : 'serviço'}
                    </span>
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
