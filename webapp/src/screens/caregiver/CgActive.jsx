import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Empty, IconButton, PetPhoto, Pill, SectionLabel } from '../../components/ui';
import { Button } from '../../components/ui';
import Icon from '../../components/Icon';
import { useApp } from '../../state/AppState';
import { formatDuration, formatEuro, formatStopwatch, formatTime } from '../../lib/format';

/** 17 · Serviço a decorrer (cuidador) */
export default function CgActive() {
  const navigate = useNavigate();
  const { activeBooking, getPet, getUser, addBookingUpdate, finishService } = useApp();

  // Cronómetro em display, ao segundo.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!activeBooking) {
    return (
      <div className="screen" style={{ paddingTop: 6 }}>
        <h1 className="t-screen-title" style={{ fontSize: 26, marginBottom: 18 }}>
          Serviço
        </h1>
        <Card>
          <Empty icon="Clock" title="Nenhum serviço a decorrer">
            Aceita um pedido para começares a enviar atualizações ao tutor.
          </Empty>
        </Card>
        <Button block onClick={() => navigate('/cuidar')} style={{ marginTop: 16 }}>
          Ver pedidos
        </Button>
      </div>
    );
  }

  const pet = getPet(activeBooking.petId);
  const tutor = getUser(activeBooking.tutorId);
  const elapsedSeconds = activeBooking.startedAt
    ? Math.max(0, Math.floor((now - new Date(activeBooking.startedAt)) / 1000))
    : 0;
  const sent = activeBooking.updates;
  const article = pet.species === 'Gato' ? 'a' : 'o';

  function addNote() {
    const text = window.prompt('Nota para enviar ao tutor:');
    if (text?.trim()) addBookingUpdate(activeBooking.id, { kind: 'nota', text: text.trim() });
  }

  function addPhoto() {
    // No protótipo a câmara é simulada com uma das fotos de placeholder.
    addBookingUpdate(activeBooking.id, {
      kind: 'foto',
      text: 'Atualização com foto',
      photo: '/images/ImagesPets/pet4.jpeg',
    });
  }

  function finish() {
    if (!window.confirm(`Terminar o serviço com ${article} ${pet.name}?`)) return;
    finishService(activeBooking.id);
    navigate('/cuidar/ganhos');
  }

  return (
    <div className="screen" style={{ paddingTop: 6 }}>
      <div className="spread" style={{ marginBottom: 18 }}>
        <Pill tone="moss" large>
          <span className="dot" style={{ background: 'var(--moss)' }} />
          Serviço a decorrer
        </Pill>
        <span className="display" style={{ fontSize: 20 }} aria-label="Tempo decorrido">
          {formatStopwatch(elapsedSeconds)}
        </span>
      </div>

      <Card className="row" style={{ gap: 13, padding: '15px 16px', marginBottom: 16, background: 'rgba(255,255,240,0.88)' }}>
        <PetPhoto src={pet.photo} alt={pet.name} height={50} round />
        <div className="grow">
          <p style={{ fontSize: 15, fontWeight: 500, margin: '0 0 2px' }}>
            {activeBooking.serviceLabel} · {pet.name}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-2)', margin: 0 }}>
            {tutor.name} · começou às {formatTime(activeBooking.startedAt)} · {formatDuration(activeBooking.durationMinutes)}
          </p>
        </div>
        <IconButton
          icon="MessageCircle"
          small
          size={17}
          dark
          label={`Conversar com ${tutor.name}`}
          onClick={() => navigate(`/conversa/${activeBooking.id}`)}
        />
      </Card>

      <SectionLabel style={{ marginBottom: 11 }}>Enviar atualização</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <Card
          as="button"
          type="button"
          className="pressable"
          onClick={addPhoto}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '18px 10px',
            borderRadius: 20,
            background: 'rgba(255,255,240,0.88)',
          }}
        >
          <Icon name="Camera" size={22} color="var(--moss)" />
          <span style={{ fontSize: 13 }}>Foto</span>
        </Card>
        <Card
          as="button"
          type="button"
          className="pressable"
          onClick={addNote}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '18px 10px',
            borderRadius: 20,
            background: 'rgba(255,255,240,0.88)',
          }}
        >
          <Icon name="AlignLeft" size={22} color="var(--moss)" />
          <span style={{ fontSize: 13 }}>Nota</span>
        </Card>
      </div>

      <SectionLabel style={{ marginBottom: 11 }}>Enviado {tutor.name === 'Bia' ? 'à' : 'a'} {tutor.name}</SectionLabel>
      {sent.length === 0 ? (
        <Card style={{ marginBottom: 18 }}>
          <Empty icon="Camera" title="Ainda não enviaste nada">
            Uma foto a meio do serviço é o que os tutores mais agradecem.
          </Empty>
        </Card>
      ) : (
        <div className="stack" style={{ gap: 14, marginBottom: 18 }}>
          {sent.map((u) =>
            u.photo ? (
              <Card key={u.id} style={{ padding: '14px 16px', borderRadius: 20, background: 'rgba(255,255,240,0.88)' }}>
                <p style={{ fontSize: 13, margin: '0 0 3px' }}>{u.text}</p>
                <p className="t-meta" style={{ margin: '0 0 10px' }}>
                  {formatTime(u.at)} · entregue
                </p>
                <img src={u.photo} alt={`${pet.name} durante o serviço`} className="washed" style={{ width: '100%', height: 110, borderRadius: 14 }} />
              </Card>
            ) : (
              <Card key={u.id} className="row" style={{ gap: 11, padding: '14px 16px', borderRadius: 20, background: 'rgba(255,255,240,0.88)' }}>
                <Icon name="Check" size={16} color="var(--moss)" style={{ flex: 'none' }} />
                <div className="grow">
                  <p style={{ fontSize: 13, margin: '0 0 2px' }}>{u.text}</p>
                  <p className="t-meta" style={{ margin: 0 }}>
                    {formatTime(u.at)} · {u.kind === 'checkin' ? 'GPS ativo' : 'entregue'}
                  </p>
                </div>
              </Card>
            ),
          )}
        </div>
      )}

      <Button block onClick={finish}>
        Terminar serviço
      </Button>
      <p className="t-meta" style={{ textAlign: 'center', lineHeight: 1.55, margin: '12px 0 0' }}>
        Ao terminar, os {formatEuro(activeBooking.priceCents)} do serviço entram nos teus ganhos.
      </p>
    </div>
  );
}
