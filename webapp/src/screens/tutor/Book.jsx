import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton, Button, Card, Checkbox, Chip, Input, PetPhoto, Textarea } from '../../components/ui';
import Icon from '../../components/Icon';
import { useApp } from '../../state/AppState';
import { formatEuro } from '../../lib/format';

/** 07 · Agendar */
export default function Book() {
  const navigate = useNavigate();
  const { draft, updateDraft, draftPrice, getCaregiver, pets, getPet, confirmBooking } = useApp();
  const caregiver = getCaregiver(draft.caregiverId);
  const [petPickerOpen, setPetPickerOpen] = useState(false);

  // Sem cuidador escolhido não há nada que agendar.
  useEffect(() => {
    if (!caregiver) navigate('/pesquisa', { replace: true });
  }, [caregiver, navigate]);
  if (!caregiver) return null;

  const pet = getPet(draft.petId) ?? pets[0];
  const article = caregiver.tone === 'sand' ? 'o' : 'a';
  const ready = Boolean(draft.date && draft.time);

  function confirm() {
    confirmBooking();
    navigate('/confirmado');
  }

  return (
    <div className="screen" style={{ paddingTop: 6 }}>
      <div style={{ marginBottom: 16 }}>
        <BackButton to={`/cuidador/${caregiver.id}`} />
      </div>
      <h1 className="name" style={{ fontSize: 26, lineHeight: 1.2, margin: '0 0 20px' }}>
        Agendar com
        <br />
        {caregiver.name}
      </h1>

      <Card
        radius="xl"
        style={{ background: 'rgba(255,255,245,0.9)', border: '0.5px solid rgba(100,110,80,0.18)', padding: 18 }}
      >
        {/* Animal */}
        <div className="spread" style={{ paddingBottom: 14, borderBottom: '0.5px solid var(--rule)' }}>
          <span style={{ fontSize: 14.5 }}>Seleciona o pet</span>
          <button type="button" className="row" style={{ gap: 8 }} onClick={() => setPetPickerOpen((o) => !o)}>
            <PetPhoto src={pet.photo} alt={pet.name} height={26} round />
            <span style={{ fontSize: 14, fontWeight: 500 }}>{pet.name}</span>
            <Icon name={petPickerOpen ? 'ChevronUp' : 'ChevronDown'} size={16} color="var(--text-2)" />
          </button>
        </div>
        {petPickerOpen && (
          <div className="row" style={{ gap: 8, flexWrap: 'wrap', paddingTop: 12 }}>
            {pets.map((p) => (
              <Chip
                key={p.id}
                active={p.id === pet.id}
                onClick={() => {
                  updateDraft({ petId: p.id });
                  setPetPickerOpen(false);
                }}
              >
                {p.name}
              </Chip>
            ))}
          </div>
        )}

        {/* Serviço */}
        <div style={{ padding: '14px 0', borderBottom: '0.5px solid var(--rule)' }}>
          <p className="t-micro" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            Serviço
          </p>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            {caregiver.priceList.map((s) => (
              <Chip key={s.code} active={s.code === draft.service} onClick={() => updateDraft({ service: s.code })}>
                {s.label} · {formatEuro(s.priceCents, { decimals: s.priceCents % 100 ? 2 : 0 })}
              </Chip>
            ))}
          </div>
        </div>

        {/* Data e hora */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '14px 0', borderBottom: '0.5px solid var(--rule)' }}>
          <div>
            <p className="t-micro" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              Data
            </p>
            <Input
              type="date"
              value={draft.date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => updateDraft({ date: e.target.value })}
              style={{ minHeight: 42, padding: '0 12px', fontSize: 14 }}
            />
          </div>
          <div>
            <p className="t-micro" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              Hora
            </p>
            <Input
              type="time"
              value={draft.time}
              onChange={(e) => updateDraft({ time: e.target.value })}
              style={{ minHeight: 42, padding: '0 12px', fontSize: 14 }}
            />
          </div>
        </div>

        {/* Notas + partilha do registo médico */}
        <div style={{ paddingTop: 14 }}>
          <p className="t-micro" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Infos importantes
          </p>
          <Textarea
            placeholder="Insere aqui informações que possam ser relevantes ao cuidador"
            value={draft.note}
            onChange={(e) => updateDraft({ note: e.target.value })}
            style={{ borderRadius: 14, fontSize: 12.5 }}
          />
          <div style={{ marginTop: 6 }}>
            <Checkbox checked={draft.shareHealthRecord} onChange={(v) => updateDraft({ shareHealthRecord: v })}>
              Partilhar registo médico do {pet.name} com {article} {caregiver.name}
            </Checkbox>
          </div>
        </div>
      </Card>

      <div className="spread" style={{ margin: '18px 2px 16px' }}>
        <span className="t-list" style={{ color: 'var(--text-2)' }}>
          Preço do serviço
        </span>
        <span className="display" style={{ fontSize: 24 }}>
          {formatEuro(draftPrice.priceCents, { decimals: draftPrice.priceCents % 100 ? 2 : 0 })}
        </span>
      </div>

      <Button block disabled={!ready} onClick={confirm}>
        Confirmar agendamento
      </Button>
      {!ready && (
        <p className="t-meta" style={{ textAlign: 'center', marginTop: 8 }}>
          Escolhe a data e a hora para continuar.
        </p>
      )}
      <Button variant="ghost" block onClick={() => navigate(`/cuidador/${caregiver.id}`)} style={{ marginTop: 6 }}>
        voltar
      </Button>
    </div>
  );
}
